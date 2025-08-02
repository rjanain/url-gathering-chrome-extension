#!/bin/bash

# Safari Extension Testing Script
# Converts and tests the URL Gathering Tool extension on Safari

set -e

echo "🧭 Safari Extension Testing Script"
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

# Check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."

    # Check macOS
    if [ "$(uname)" != "Darwin" ]; then
        print_error "Safari extension conversion requires macOS"
        exit 1
    fi

    # Check Xcode command line tools
    if ! command -v xcrun &> /dev/null; then
        print_error "Xcode command line tools not found. Install with: xcode-select --install"
        exit 1
    fi

    # Check Safari
    if [ ! -d "/Applications/Safari.app" ]; then
        print_error "Safari not found. Please install Safari."
        exit 1
    fi

    # Check if Xcode is installed
    if [ ! -d "/Applications/Xcode.app" ]; then
        print_warning "Xcode not found. You'll need Xcode for signing and testing."
    fi

    print_success "Prerequisites check passed"
}

# Build Safari version
build_safari() {
    print_status "Building Safari version..."

    if ! npm run build:safari; then
        print_error "Failed to build Safari version"
        exit 1
    fi

    print_success "Safari build completed"
}

# Convert to Safari extension
convert_extension() {
    print_status "Converting extension for Safari..."

    # Create safari-build directory if it doesn't exist
    mkdir -p safari-build

    # Remove existing conversion if present
    if [ -d "safari-build/URL Gathering Tool" ]; then
        print_status "Removing existing Safari conversion..."
        rm -rf "safari-build/URL Gathering Tool"
    fi

    # Convert extension
    print_status "Running safari-web-extension-converter..."
    if ! xcrun safari-web-extension-converter dist/ --project-location ./safari-build/ --force; then
        print_error "Safari conversion failed"
        exit 1
    fi

    print_success "Safari conversion completed"
}

# Verify conversion
verify_conversion() {
    print_status "Verifying Safari conversion..."

    # Check if Xcode project was created
    xcode_project=$(find safari-build -name "*.xcodeproj" -type d | head -n 1)
    if [ -z "$xcode_project" ]; then
        print_error "Xcode project not found after conversion"
        exit 1
    fi

    print_success "Xcode project created: $xcode_project"

    # Check for Swift files
    if find safari-build -name "*.swift" | grep -q .; then
        print_success "Swift wrapper files created"
    else
        print_warning "No Swift files found"
    fi
}

# Open in Xcode
open_xcode() {
    print_status "Opening project in Xcode..."

    xcode_project=$(find safari-build -name "*.xcodeproj" -type d | head -n 1)
    if [ -n "$xcode_project" ]; then
        open "$xcode_project"
        print_success "Xcode project opened"
    else
        print_error "Could not find Xcode project to open"
        exit 1
    fi
}

# Check Safari extension requirements
check_safari_requirements() {
    print_status "Checking Safari extension requirements..."

    # Check manifest compatibility
    if [ -f "dist/manifest.json" ]; then
        # Safari uses Manifest V2
        manifest_version=$(grep -o '"manifest_version": [0-9]*' dist/manifest.json | grep -o '[0-9]*')
        if [ "$manifest_version" = "2" ]; then
            print_success "Manifest V2 compatible with Safari"
        else
            print_warning "Safari prefers Manifest V2"
        fi

        # Check for unsupported fields
        if grep -q '"service_worker"' dist/manifest.json; then
            print_warning "Service worker detected - Safari may use background scripts"
        fi
    fi
}

# Main execution
main() {
    echo
    print_status "Starting Safari extension conversion and testing..."
    echo

    # Run checks
    check_prerequisites
    build_safari
    check_safari_requirements
    convert_extension
    verify_conversion

    echo
    print_success "Safari conversion completed successfully!"
    echo

    # Instructions for manual testing
    echo "📋 Manual Testing Instructions:"
    echo "================================"
    echo
    echo "1. The Xcode project will open automatically"
    echo "2. In Xcode:"
    echo "   - Select the project in navigator"
    echo "   - Choose appropriate Team/Signing Certificate"
    echo "   - Ensure Bundle Identifier is set"
    echo "   - Build project (⌘+B)"
    echo "   - Run on device/simulator (⌘+R)"
    echo
    echo "3. In Safari:"
    echo "   - Open Safari → Preferences → Extensions"
    echo "   - Enable the URL Gathering Tool extension"
    echo "   - Grant necessary permissions"
    echo
    echo "🧪 Test Checklist:"
    echo "- [ ] Extension appears in Safari toolbar"
    echo "- [ ] Popup opens and displays correctly"
    echo "- [ ] Permission prompts work properly"
    echo "- [ ] URL gathering works across Safari tabs"
    echo "- [ ] All copy formats function correctly"
    echo "- [ ] Native Safari UI integration"
    echo "- [ ] Proper permission handling"
    echo

    echo "🔧 Safari-Specific Notes:"
    echo "- Extension runs in Safari's sandboxed environment"
    echo "- Requires proper code signing for distribution"
    echo "- May need App Store approval for public release"
    echo "- Uses Swift wrapper for native integration"
    echo

    # Ask if user wants to open Xcode
    read -p "Open Xcode project now? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        open_xcode
    fi

    print_success "Safari testing setup complete!"
    echo
    print_status "Next steps:"
    echo "1. Configure signing in Xcode"
    echo "2. Build and run the project"
    echo "3. Enable extension in Safari preferences"
    echo "4. Test all functionality"
}

# Run main function
main "$@"
