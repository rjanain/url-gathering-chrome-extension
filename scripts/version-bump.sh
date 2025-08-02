#!/bin/bash

# Version Management Script for URL Gathering Tool
# Usage: ./version-bump.sh [major|minor|patch] [message]

set -e

VERSION_FILE="version.json"
MANIFEST_FILE="public/manifest.json"
MANIFEST_FIREFOX="public/manifest-firefox.json"
MANIFEST_SAFARI="public/manifest-safari.json"
PACKAGE_FILE="package.json"
CHANGELOG_FILE="CHANGELOG.md"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

log_success() {
    echo -e "${GREEN}✓${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

log_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check if jq is installed
if ! command -v jq &> /dev/null; then
    log_error "jq is required but not installed. Please install jq first."
    echo "  macOS: brew install jq"
    echo "  Ubuntu/Debian: sudo apt-get install jq"
    exit 1
fi

# Get current version
if [[ ! -f "$VERSION_FILE" ]]; then
    log_error "Version file not found: $VERSION_FILE"
    exit 1
fi

CURRENT_VERSION=$(jq -r '.version' "$VERSION_FILE")
log_info "Current version: $CURRENT_VERSION"

# Parse version components
IFS='.' read -r MAJOR MINOR PATCH <<< "$CURRENT_VERSION"

# Determine new version based on bump type
BUMP_TYPE=${1:-patch}
MESSAGE=${2:-"Version bump"}

case $BUMP_TYPE in
    "major")
        NEW_MAJOR=$((MAJOR + 1))
        NEW_MINOR=0
        NEW_PATCH=0
        ;;
    "minor")
        NEW_MAJOR=$MAJOR
        NEW_MINOR=$((MINOR + 1))
        NEW_PATCH=0
        ;;
    "patch")
        NEW_MAJOR=$MAJOR
        NEW_MINOR=$MINOR
        NEW_PATCH=$((PATCH + 1))
        ;;
    *)
        log_error "Invalid bump type: $BUMP_TYPE"
        echo "Usage: $0 [major|minor|patch] [message]"
        exit 1
        ;;
esac

NEW_VERSION="$NEW_MAJOR.$NEW_MINOR.$NEW_PATCH"
log_info "New version: $NEW_VERSION"

# Confirm version bump
read -p "Bump version from $CURRENT_VERSION to $NEW_VERSION? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    log_warning "Version bump cancelled"
    exit 0
fi

# Update version.json
log_info "Updating $VERSION_FILE..."
TEMP_VERSION=$(mktemp)
jq --arg version "$NEW_VERSION" \
   --arg prev "$CURRENT_VERSION" \
   --arg date "$(date '+%Y-%m-%d')" \
   --arg type "$BUMP_TYPE" \
   '.version = $version | .previousVersion = $prev | .releaseDate = $date | .releaseType = $type' \
   "$VERSION_FILE" > "$TEMP_VERSION"
mv "$TEMP_VERSION" "$VERSION_FILE"
log_success "Updated $VERSION_FILE"

# Update manifest.json files
update_manifest() {
    local file=$1
    log_info "Updating $file..."
    TEMP_MANIFEST=$(mktemp)
    jq --arg version "$NEW_VERSION" '.version = $version' "$file" > "$TEMP_MANIFEST"
    mv "$TEMP_MANIFEST" "$file"
    log_success "Updated $file"
}

update_manifest "$MANIFEST_FILE"
update_manifest "$MANIFEST_FIREFOX"
update_manifest "$MANIFEST_SAFARI"

# Update package.json
log_info "Updating $PACKAGE_FILE..."
TEMP_PACKAGE=$(mktemp)
jq --arg version "$NEW_VERSION" '.version = $version' "$PACKAGE_FILE" > "$TEMP_PACKAGE"
mv "$TEMP_PACKAGE" "$PACKAGE_FILE"
log_success "Updated $PACKAGE_FILE"

# Update CHANGELOG.md
log_info "Updating $CHANGELOG_FILE..."
TODAY=$(date '+%Y-%m-%d')
TEMP_CHANGELOG=$(mktemp)

# Read the current changelog and insert new version
awk -v version="$NEW_VERSION" -v date="$TODAY" -v msg="$MESSAGE" '
    /^## \[Unreleased\]/ {
        print $0
        print ""
        print "## [" version "] - " date
        print ""
        print "### Changed"
        print "- " msg
        print ""
        next
    }
    { print }
' "$CHANGELOG_FILE" > "$TEMP_CHANGELOG"

mv "$TEMP_CHANGELOG" "$CHANGELOG_FILE"
log_success "Updated $CHANGELOG_FILE"

# Create git tag if we're in a git repository
if git rev-parse --git-dir > /dev/null 2>&1; then
    log_info "Creating git tag v$NEW_VERSION..."
    git add .
    git commit -m "chore: bump version to $NEW_VERSION

$MESSAGE"
    git tag "v$NEW_VERSION" -m "Version $NEW_VERSION

$MESSAGE"
    log_success "Created git tag v$NEW_VERSION"
    
    echo
    log_info "To push changes and tags to remote:"
    echo "  git push origin $(git branch --show-current)"
    echo "  git push origin v$NEW_VERSION"
else
    log_warning "Not in a git repository, skipping git operations"
fi

echo
log_success "Version bump complete!"
log_info "Version: $CURRENT_VERSION → $NEW_VERSION"
log_info "Files updated:"
echo "  - $VERSION_FILE"
echo "  - $MANIFEST_FILE"
echo "  - $MANIFEST_FIREFOX"
echo "  - $MANIFEST_SAFARI"
echo "  - $PACKAGE_FILE"
echo "  - $CHANGELOG_FILE"
