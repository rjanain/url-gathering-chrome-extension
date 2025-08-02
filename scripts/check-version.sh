#!/bin/bash

# Version Validation Script
# Checks that all files have consistent version numbers

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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
    log_error "jq is required but not installed."
    exit 1
fi

# Files to check
VERSION_FILE="version.json"
MANIFEST_FILE="public/manifest.json"
MANIFEST_FIREFOX="public/manifest-firefox.json"
MANIFEST_SAFARI="public/manifest-safari.json"
PACKAGE_FILE="package.json"

log_info "Checking version consistency across all files..."

# Get versions from each file
if [[ -f "$VERSION_FILE" ]]; then
    VERSION_JSON=$(jq -r '.version' "$VERSION_FILE")
    log_info "version.json: $VERSION_JSON"
else
    log_error "$VERSION_FILE not found"
    exit 1
fi

if [[ -f "$MANIFEST_FILE" ]]; then
    MANIFEST_VERSION=$(jq -r '.version' "$MANIFEST_FILE")
    log_info "manifest.json: $MANIFEST_VERSION"
else
    log_error "$MANIFEST_FILE not found"
    exit 1
fi

if [[ -f "$MANIFEST_FIREFOX" ]]; then
    MANIFEST_FIREFOX_VERSION=$(jq -r '.version' "$MANIFEST_FIREFOX")
    log_info "manifest-firefox.json: $MANIFEST_FIREFOX_VERSION"
else
    log_warning "$MANIFEST_FIREFOX not found"
    MANIFEST_FIREFOX_VERSION=""
fi

if [[ -f "$MANIFEST_SAFARI" ]]; then
    MANIFEST_SAFARI_VERSION=$(jq -r '.version' "$MANIFEST_SAFARI")
    log_info "manifest-safari.json: $MANIFEST_SAFARI_VERSION"
else
    log_warning "$MANIFEST_SAFARI not found"
    MANIFEST_SAFARI_VERSION=""
fi

if [[ -f "$PACKAGE_FILE" ]]; then
    PACKAGE_VERSION=$(jq -r '.version' "$PACKAGE_FILE")
    log_info "package.json: $PACKAGE_VERSION"
else
    log_error "$PACKAGE_FILE not found"
    exit 1
fi

echo

# Check consistency
INCONSISTENT=false

if [[ "$VERSION_JSON" != "$MANIFEST_VERSION" ]]; then
    log_error "Version mismatch: version.json ($VERSION_JSON) vs manifest.json ($MANIFEST_VERSION)"
    INCONSISTENT=true
fi

if [[ -n "$MANIFEST_FIREFOX_VERSION" && "$VERSION_JSON" != "$MANIFEST_FIREFOX_VERSION" ]]; then
    log_error "Version mismatch: version.json ($VERSION_JSON) vs manifest-firefox.json ($MANIFEST_FIREFOX_VERSION)"
    INCONSISTENT=true
fi

if [[ -n "$MANIFEST_SAFARI_VERSION" && "$VERSION_JSON" != "$MANIFEST_SAFARI_VERSION" ]]; then
    log_error "Version mismatch: version.json ($VERSION_JSON) vs manifest-safari.json ($MANIFEST_SAFARI_VERSION)"
    INCONSISTENT=true
fi

if [[ "$VERSION_JSON" != "$PACKAGE_VERSION" ]]; then
    log_error "Version mismatch: version.json ($VERSION_JSON) vs package.json ($PACKAGE_VERSION)"
    INCONSISTENT=true
fi

if [[ "$INCONSISTENT" == "true" ]]; then
    echo
    log_error "Version inconsistencies found!"
    log_info "Run './version-bump.sh patch' to fix version inconsistencies"
    exit 1
else
    log_success "All versions are consistent: $VERSION_JSON"
fi

# Display additional version info
echo
log_info "Version Information:"
echo "  Current Version: $VERSION_JSON"

if [[ -f "$VERSION_FILE" ]]; then
    PREVIOUS_VERSION=$(jq -r '.previousVersion' "$VERSION_FILE")
    RELEASE_DATE=$(jq -r '.releaseDate' "$VERSION_FILE")
    RELEASE_TYPE=$(jq -r '.releaseType' "$VERSION_FILE")
    
    echo "  Previous Version: $PREVIOUS_VERSION"
    echo "  Release Date: $RELEASE_DATE"
    echo "  Release Type: $RELEASE_TYPE"
fi

# Check if version follows semantic versioning
if [[ $VERSION_JSON =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    log_success "Version follows semantic versioning format"
else
    log_warning "Version does not follow semantic versioning format (MAJOR.MINOR.PATCH)"
fi
