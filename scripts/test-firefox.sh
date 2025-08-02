#!/bin/bash

# Firefox Extension Testing Script
# Tests the URL Gathering Tool extension on Firefox browser

set -e

echo "🦊 Firefox Extension Testing Script"
echo "==================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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

# Check if Firefox is installed
check_firefox() {
    if command -v firefox &> /dev/null; then
        print_success "Firefox is installed"
        return 0
    elif [ -d "/Applications/Firefox.app" ]; then
        print_success "Firefox is installed"
        return 0
    else
        print_error "Firefox is not installed. Please install Firefox first."
        exit 1
    fi
}

# Build Firefox version
build_firefox() {
    print_status "Building Firefox version..."

    if ! npm run build:firefox; then
        print_error "Failed to build Firefox version"
        exit 1
    fi

    print_success "Firefox build completed"
}

# Verify build output
verify_build() {
    print_status "Verifying build output..."

    if [ ! -d "dist" ]; then
        print_error "dist/ directory not found"
        exit 1
    fi

    if [ ! -f "dist/manifest.json" ]; then
        print_error "manifest.json not found in dist/"
        exit 1
    fi

    # Check manifest version (Firefox uses V2)
    manifest_version=$(grep -o '"manifest_version": [0-9]*' dist/manifest.json | grep -o '[0-9]*')
    if [ "$manifest_version" != "2" ]; then
        print_error "Expected Manifest V2 for Firefox, found V$manifest_version"
        exit 1
    fi

    print_success "Build verification passed"
}

# Check Firefox-specific requirements
check_firefox_specific() {
    print_status "Checking Firefox-specific requirements..."

    # Check for webextension-polyfill
    if [ ! -f "dist/vendor/browser-polyfill.min.js" ]; then
        print_warning "Webextension-polyfill not found - may cause API issues"
    fi

    # Check for background scripts (not service worker)
    if grep -q '"service_worker"' dist/manifest.json; then
        print_error "Service worker found in manifest - Firefox uses background scripts"
        exit 1
    fi

    if ! grep -q '"scripts"' dist/manifest.json; then
        print_error "Background scripts not found in manifest"
        exit 1
    fi

    # Check for browser_action instead of action
    if grep -q '"action"' dist/manifest.json; then
        print_warning "Manifest V3 'action' field found - should be 'browser_action' for Firefox"
    fi

    print_success "Firefox-specific checks passed"
}

# Validate web-ext compatibility
validate_webext() {
    print_status "Validating web-ext compatibility..."

    # Check if web-ext is available
    if command -v web-ext &> /dev/null; then
        print_status "Running web-ext lint..."
        if web-ext lint --source-dir=dist/ --warnings-as-errors=false; then
            print_success "web-ext validation passed"
        else
            print_warning "web-ext validation found issues (non-critical)"
        fi
    else
        print_warning "web-ext not installed - skipping validation"
        print_status "Install with: npm install -g web-ext"
    fi
}

# Open Firefox debugging page
open_firefox_debugging() {
    print_status "Opening Firefox debugging page..."

    if [ -d "/Applications/Firefox.app" ]; then
        open -a "Firefox" "about:debugging"
    else
        firefox "about:debugging" 2>/dev/null || print_warning "Could not automatically open Firefox"
    fi
}

# Main execution
main() {
    echo
    print_status "Starting Firefox extension testing..."
    echo

    # Run checks
    check_firefox
    build_firefox
    verify_build
    check_firefox_specific
    validate_webext

    echo
    print_success "Pre-flight checks completed successfully!"
    echo

    # Instructions for manual testing
    echo "📋 Manual Testing Instructions:"
    echo "================================"
    echo
    echo "1. Navigate to about:debugging in Firefox"
    echo "2. Click 'This Firefox'"
    echo "3. Click 'Load Temporary Add-on'"
    echo "4. Select 'manifest.json' from the 'dist/' directory"
    echo
    echo "🧪 Test Checklist:"
    echo "- [ ] Extension loads without manifest errors"
    echo "- [ ] All browser.* APIs work via webextension-polyfill"
    echo "- [ ] Background scripts execute properly"
    echo "- [ ] Extension icon appears in toolbar"
    echo "- [ ] Popup functionality matches Chrome behavior"
    echo "- [ ] URL gathering works across all open tabs"
    echo "- [ ] Copy operations work in all formats"
    echo "- [ ] No unsupported manifest fields flagged"
    echo

    echo "🔧 Firefox-Specific Notes:"
    echo "- Uses Manifest V2 (not V3)"
    echo "- Uses browser_action instead of action"
    echo "- Requires webextension-polyfill for API compatibility"
    echo "- Background scripts instead of service worker"
    echo

    # Ask if user wants to open Firefox
    read -p "Open Firefox debugging page now? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        open_firefox_debugging
    fi

    print_success "Firefox testing setup complete!"
}

# Run main function
main "$@"
