#!/bin/bash

# Chrome Extension Testing Script
# Tests the URL Gathering Tool extension on Chrome browser

set -e

echo "🔧 Chrome Extension Testing Script"
echo "=================================="

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

# Check if Chrome is installed
check_chrome() {
    if command -v "Google Chrome" &> /dev/null; then
        print_success "Chrome is installed"
        return 0
    elif [ -d "/Applications/Google Chrome.app" ]; then
        print_success "Chrome is installed"
        return 0
    else
        print_error "Chrome is not installed. Please install Chrome first."
        exit 1
    fi
}

# Build Chrome version
build_chrome() {
    print_status "Building Chrome version..."

    if ! npm run build:chrome; then
        print_error "Failed to build Chrome version"
        exit 1
    fi

    print_success "Chrome build completed"
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

    # Check manifest version
    manifest_version=$(grep -o '"manifest_version": [0-9]*' dist/manifest.json | grep -o '[0-9]*')
    if [ "$manifest_version" != "3" ]; then
        print_error "Expected Manifest V3, found V$manifest_version"
        exit 1
    fi

    print_success "Build verification passed"
}

# Check for common issues
check_issues() {
    print_status "Checking for common issues..."

    # Check for service worker
    if [ ! -f "dist/vendor/serviceWorker.js" ]; then
        print_warning "Service worker not found at expected location"
    fi

    # Check for required permissions
    if ! grep -q '"tabs"' dist/manifest.json; then
        print_error "tabs permission missing from manifest"
        exit 1
    fi

    if ! grep -q '"storage"' dist/manifest.json; then
        print_error "storage permission missing from manifest"
        exit 1
    fi

    print_success "No critical issues found"
}

# Open Chrome extensions page
open_chrome_extensions() {
    print_status "Opening Chrome extensions page..."

    if [ -d "/Applications/Google Chrome.app" ]; then
        open -a "Google Chrome" "chrome://extensions/"
    else
        google-chrome "chrome://extensions/" 2>/dev/null || print_warning "Could not automatically open Chrome"
    fi
}

# Main execution
main() {
    echo
    print_status "Starting Chrome extension testing..."
    echo

    # Run checks
    check_chrome
    build_chrome
    verify_build
    check_issues

    echo
    print_success "Pre-flight checks completed successfully!"
    echo

    # Instructions for manual testing
    echo "📋 Manual Testing Instructions:"
    echo "================================"
    echo
    echo "1. Navigate to chrome://extensions/ in Chrome"
    echo "2. Enable 'Developer mode' (top-right toggle)"
    echo "3. Click 'Load unpacked'"
    echo "4. Select the 'dist/' directory"
    echo
    echo "🧪 Test Checklist:"
    echo "- [ ] Extension icon appears in toolbar"
    echo "- [ ] Popup opens when clicking icon"
    echo "- [ ] All tabs are listed correctly"
    echo "- [ ] URL copying works (all formats)"
    echo "- [ ] Settings persist between sessions"
    echo "- [ ] No console errors in background/content scripts"
    echo

    # Ask if user wants to open Chrome
    read -p "Open Chrome extensions page now? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        open_chrome_extensions
    fi

    print_success "Chrome testing setup complete!"
}

# Run main function
main "$@"
