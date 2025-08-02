#!/bin/bash

# Edge Extension Testing Script
# Tests the URL Gathering Tool extension on Microsoft Edge browser

set -e

echo "🌐 Edge Extension Testing Script"
echo "================================"

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

# Check if Edge is installed
check_edge() {
    edge_found=false

    # Check different possible locations for Edge
    if command -v "Microsoft Edge" &> /dev/null; then
        edge_found=true
    elif [ -d "/Applications/Microsoft Edge.app" ]; then
        edge_found=true
    elif command -v microsoft-edge &> /dev/null; then
        edge_found=true
    elif command -v edge &> /dev/null; then
        edge_found=true
    fi

    if [ "$edge_found" = true ]; then
        print_success "Microsoft Edge is installed"
        return 0
    else
        print_error "Microsoft Edge is not installed. Please install Edge first."
        print_status "Download from: https://www.microsoft.com/edge"
        exit 1
    fi
}

# Build Chrome version (Edge uses same build)
build_edge() {
    print_status "Building Edge-compatible version (using Chrome build)..."

    if ! npm run build:chrome; then
        print_error "Failed to build Edge-compatible version"
        exit 1
    fi

    print_success "Edge-compatible build completed"
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

    # Check manifest version (Edge supports V3 like Chrome)
    manifest_version=$(grep -o '"manifest_version": [0-9]*' dist/manifest.json | grep -o '[0-9]*')
    if [ "$manifest_version" != "3" ]; then
        print_error "Expected Manifest V3, found V$manifest_version"
        exit 1
    fi

    print_success "Build verification passed"
}

# Check Edge-specific compatibility
check_edge_compatibility() {
    print_status "Checking Edge-specific compatibility..."

    # Check for service worker (Edge supports this like Chrome)
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

    # Check for action (not browser_action in V3)
    if grep -q '"browser_action"' dist/manifest.json; then
        print_warning "browser_action found - Edge V3 uses 'action'"
    fi

    print_success "Edge compatibility checks passed"
}

# Test Edge-specific features
test_edge_features() {
    print_status "Checking Edge-specific features..."

    # Note: These are informational checks
    print_status "Edge features to test manually:"
    echo "  - Enhanced security features compatibility"
    echo "  - Tracking prevention compatibility"
    echo "  - Collections integration (if applicable)"
    echo "  - InPrivate browsing support"
    echo "  - Sync across devices"

    print_success "Edge feature notes documented"
}

# Open Edge extensions page
open_edge_extensions() {
    print_status "Opening Edge extensions page..."

    # Try different methods to open Edge
    if [ -d "/Applications/Microsoft Edge.app" ]; then
        open -a "Microsoft Edge" "edge://extensions/"
    elif command -v microsoft-edge &> /dev/null; then
        microsoft-edge "edge://extensions/" 2>/dev/null || print_warning "Could not automatically open Edge"
    elif command -v edge &> /dev/null; then
        edge "edge://extensions/" 2>/dev/null || print_warning "Could not automatically open Edge"
    else
        print_warning "Could not automatically open Edge extensions page"
        print_status "Manually navigate to: edge://extensions/"
    fi
}

# Main execution
main() {
    echo
    print_status "Starting Edge extension testing..."
    echo

    # Run checks
    check_edge
    build_edge
    verify_build
    check_edge_compatibility
    test_edge_features

    echo
    print_success "Pre-flight checks completed successfully!"
    echo

    # Instructions for manual testing
    echo "📋 Manual Testing Instructions:"
    echo "================================"
    echo
    echo "1. Navigate to edge://extensions/ in Microsoft Edge"
    echo "2. Enable 'Developer mode' (left sidebar)"
    echo "3. Click 'Load unpacked'"
    echo "4. Select the 'dist/' directory"
    echo
    echo "🧪 Test Checklist:"
    echo "- [ ] Extension loads without issues"
    echo "- [ ] Manifest V3 features work identically to Chrome"
    echo "- [ ] Service worker functions properly"
    echo "- [ ] Extension icon appears in toolbar"
    echo "- [ ] Popup displays and functions correctly"
    echo "- [ ] URL gathering works across Edge tabs"
    echo "- [ ] All copy formats work as expected"
    echo "- [ ] Works with Edge's enhanced security features"
    echo "- [ ] Compatible with Edge's tracking prevention"
    echo "- [ ] Functions in InPrivate browsing mode"
    echo

    echo "🔧 Edge-Specific Notes:"
    echo "- Edge is Chromium-based, so Chrome builds should work"
    echo "- Supports Manifest V3 like Chrome"
    echo "- Has additional privacy/security features to test"
    echo "- Supports Collections feature (test if applicable)"
    echo "- Syncs extensions across signed-in devices"
    echo

    echo "🔒 Security Testing:"
    echo "- Test with tracking prevention enabled"
    echo "- Verify functionality in InPrivate mode"
    echo "- Check permissions are properly requested"
    echo "- Ensure no data leakage between contexts"
    echo

    # Ask if user wants to open Edge
    read -p "Open Edge extensions page now? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        open_edge_extensions
    fi

    print_success "Edge testing setup complete!"
    echo
    print_status "Additional testing recommendations:"
    echo "1. Test with various tracking prevention levels"
    echo "2. Verify InPrivate browsing compatibility"
    echo "3. Check extension sync across devices"
    echo "4. Test with Edge Collections (if relevant)"
}

# Run main function
main "$@"
