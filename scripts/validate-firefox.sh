#!/bin/bash

# Firefox Extension Linting and Validation Script
# This script helps prepare and validate the Firefox extension

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "This script must be run from the project root directory"
    exit 1
fi

print_status "🦊 Firefox Extension Validation Script"
echo ""

# Check if web-ext is installed
if ! command -v web-ext &> /dev/null; then
    print_warning "web-ext is not installed globally"
    print_status "Installing web-ext locally..."
    npx web-ext --version || {
        print_status "Installing web-ext..."
        npm install --save-dev web-ext
    }
fi

# Build Firefox extension if not exists
if [ ! -d "dist/firefox" ]; then
    print_status "Firefox build not found, building now..."
    npm run build:firefox
fi

print_status "Running web-ext lint on Firefox build..."
echo ""

# Run web-ext lint
if npx web-ext lint --source-dir=dist/firefox --pretty; then
    print_success "✅ Firefox extension passed all lint checks!"
else
    print_error "❌ Firefox extension failed lint checks"
    print_status "Please fix the issues above before submitting to AMO"
    exit 1
fi

echo ""
print_status "Running additional validation checks..."

# Check for Firefox-specific manifest fields
MANIFEST_FILE="dist/firefox/manifest.json"
if [ -f "$MANIFEST_FILE" ]; then

    # Check for gecko application field
    if jq -e '.applications.gecko.id' "$MANIFEST_FILE" > /dev/null 2>&1; then
        GECKO_ID=$(jq -r '.applications.gecko.id' "$MANIFEST_FILE")
        print_success "✅ Gecko application ID found: $GECKO_ID"
    else
        print_warning "⚠️  No gecko application ID found in manifest"
        print_status "Consider adding applications.gecko.id for better compatibility"
    fi

    # Check minimum Firefox version
    if jq -e '.applications.gecko.strict_min_version' "$MANIFEST_FILE" > /dev/null 2>&1; then
        MIN_VERSION=$(jq -r '.applications.gecko.strict_min_version' "$MANIFEST_FILE")
        print_success "✅ Minimum Firefox version specified: $MIN_VERSION"
    else
        print_warning "⚠️  No minimum Firefox version specified"
    fi

    # Check for content security policy
    if jq -e '.content_security_policy' "$MANIFEST_FILE" > /dev/null 2>&1; then
        print_success "✅ Content Security Policy found"
    else
        print_status "ℹ️  No explicit CSP found (using defaults)"
    fi

else
    print_error "❌ Firefox manifest.json not found!"
    exit 1
fi

# Check for common issues
print_status "Checking for common Firefox compatibility issues..."

# Check for Chrome-specific APIs
print_status "Scanning for Chrome-specific APIs..."
if grep -r "chrome\." dist/firefox/vendor/ 2>/dev/null | grep -v "browser-polyfill" | grep -v "/\*" | grep -v "//" ; then
    print_warning "⚠️  Found potential Chrome-specific API usage"
    print_status "Ensure you're using webextension-polyfill or browser.* APIs"
else
    print_success "✅ No Chrome-specific API usage detected"
fi

# Check file sizes
print_status "Checking package size..."
PACKAGE_SIZE=$(du -sh dist/firefox | cut -f1)
print_status "Package size: $PACKAGE_SIZE"

if [ -f "build/firefox-v*.zip" ]; then
    ZIP_SIZE=$(du -sh build/firefox-v*.zip | cut -f1)
    print_status "ZIP size: $ZIP_SIZE"
fi

# Test loading in Firefox (if available)
if command -v firefox &> /dev/null; then
    print_status "Firefox detected. You can test the extension with:"
    echo "  npx web-ext run --source-dir=dist/firefox --firefox=$(which firefox)"
else
    print_warning "Firefox not found in PATH. Install Firefox for testing."
fi

echo ""
print_success "🎉 Firefox validation complete!"
echo ""
print_status "Next steps for AMO submission:"
echo "1. Fix any warnings or issues reported above"
echo "2. Test the extension manually in Firefox"
echo "3. Review the submission checklist: store-assets/firefox/submission-checklist.md"
echo "4. Package for submission: npm run package:firefox"
echo "5. Submit to https://addons.mozilla.org/developers/"
echo ""

# Create a summary report
REPORT_FILE="store-assets/firefox/validation-report.md"
mkdir -p "$(dirname "$REPORT_FILE")"

cat > "$REPORT_FILE" << EOF
# Firefox Extension Validation Report

**Generated**: $(date)
**Extension Version**: $(jq -r '.version' "$MANIFEST_FILE")

## Lint Results
- ✅ Passed web-ext lint validation

## Manifest Validation
$(if jq -e '.applications.gecko.id' "$MANIFEST_FILE" > /dev/null 2>&1; then echo "- ✅ Gecko ID: $(jq -r '.applications.gecko.id' "$MANIFEST_FILE")"; else echo "- ⚠️  No Gecko ID specified"; fi)
$(if jq -e '.applications.gecko.strict_min_version' "$MANIFEST_FILE" > /dev/null 2>&1; then echo "- ✅ Min Firefox: $(jq -r '.applications.gecko.strict_min_version' "$MANIFEST_FILE")"; else echo "- ⚠️  No minimum version specified"; fi)
$(if jq -e '.content_security_policy' "$MANIFEST_FILE" > /dev/null 2>&1; then echo "- ✅ CSP defined"; else echo "- ℹ️  Using default CSP"; fi)

## Package Information
- **Size**: $PACKAGE_SIZE
- **Location**: dist/firefox/

## Recommendations
1. Review all warnings above
2. Test thoroughly in Firefox
3. Prepare source code if using minified libraries
4. Complete AMO submission checklist

## Ready for Submission
$(if [ $? -eq 0 ]; then echo "✅ Extension appears ready for AMO submission"; else echo "❌ Please fix issues before submitting"; fi)
EOF

print_status "📋 Validation report saved to: $REPORT_FILE"
