#!/bin/bash

# Cross-Browser Extension Testing Runner
# Orchestrates testing across Chrome, Firefox, Safari, and Edge

set -e

echo "🌐 Cross-Browser Extension Testing Runner"
echo "========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
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

print_header() {
    echo -e "${CYAN}$1${NC}"
}

# Show usage information
show_usage() {
    echo "Usage: $0 [browser1] [browser2] ..."
    echo
    echo "Available browsers:"
    echo "  chrome   - Test on Google Chrome"
    echo "  firefox  - Test on Mozilla Firefox"
    echo "  safari   - Test on Safari (macOS only)"
    echo "  edge     - Test on Microsoft Edge"
    echo "  all      - Test on all browsers"
    echo
    echo "Examples:"
    echo "  $0 chrome firefox    # Test on Chrome and Firefox"
    echo "  $0 all              # Test on all browsers"
    echo "  $0                  # Interactive mode"
}

# Check if script is executable
make_scripts_executable() {
    print_status "Making test scripts executable..."

    chmod +x scripts/test-chrome.sh 2>/dev/null || true
    chmod +x scripts/test-firefox.sh 2>/dev/null || true
    chmod +x scripts/test-safari.sh 2>/dev/null || true
    chmod +x scripts/test-edge.sh 2>/dev/null || true

    print_success "Scripts are executable"
}

# Run Chrome tests
test_chrome() {
    print_header "🔧 Testing Chrome Extension"
    echo "=================================="

    if [ -f "scripts/test-chrome.sh" ]; then
        ./scripts/test-chrome.sh
    else
        print_error "Chrome test script not found"
        return 1
    fi
}

# Run Firefox tests
test_firefox() {
    print_header "🦊 Testing Firefox Extension"
    echo "==================================="

    if [ -f "scripts/test-firefox.sh" ]; then
        ./scripts/test-firefox.sh
    else
        print_error "Firefox test script not found"
        return 1
    fi
}

# Run Safari tests
test_safari() {
    print_header "🧭 Testing Safari Extension"
    echo "=================================="

    # Check if running on macOS
    if [ "$(uname)" != "Darwin" ]; then
        print_warning "Safari testing requires macOS - skipping"
        return 0
    fi

    if [ -f "scripts/test-safari.sh" ]; then
        ./scripts/test-safari.sh
    else
        print_error "Safari test script not found"
        return 1
    fi
}

# Run Edge tests
test_edge() {
    print_header "🌐 Testing Edge Extension"
    echo "================================"

    if [ -f "scripts/test-edge.sh" ]; then
        ./scripts/test-edge.sh
    else
        print_error "Edge test script not found"
        return 1
    fi
}

# Interactive browser selection
interactive_mode() {
    echo
    print_status "Interactive browser testing mode"
    echo
    echo "Select browsers to test:"
    echo "1) Chrome"
    echo "2) Firefox"
    echo "3) Safari (macOS only)"
    echo "4) Edge"
    echo "5) All browsers"
    echo "6) Exit"
    echo

    read -p "Enter your choice (1-6): " choice

    case $choice in
        1)
            test_chrome
            ;;
        2)
            test_firefox
            ;;
        3)
            test_safari
            ;;
        4)
            test_edge
            ;;
        5)
            test_all_browsers
            ;;
        6)
            print_status "Exiting..."
            exit 0
            ;;
        *)
            print_error "Invalid choice. Please select 1-6."
            interactive_mode
            ;;
    esac
}

# Test all browsers
test_all_browsers() {
    print_header "🌍 Testing All Browsers"
    echo "========================="

    local failed_tests=()

    # Test Chrome
    echo
    if ! test_chrome; then
        failed_tests+=("Chrome")
    fi

    # Test Firefox
    echo
    if ! test_firefox; then
        failed_tests+=("Firefox")
    fi

    # Test Safari (if on macOS)
    echo
    if ! test_safari; then
        failed_tests+=("Safari")
    fi

    # Test Edge
    echo
    if ! test_edge; then
        failed_tests+=("Edge")
    fi

    # Summary
    echo
    print_header "📊 Testing Summary"
    echo "=================="

    if [ ${#failed_tests[@]} -eq 0 ]; then
        print_success "All browser tests completed successfully!"
    else
        print_warning "Some tests had issues:"
        for browser in "${failed_tests[@]}"; do
            echo "  - $browser"
        done
    fi
}

# Parse command line arguments
parse_arguments() {
    if [ $# -eq 0 ]; then
        interactive_mode
        return
    fi

    for arg in "$@"; do
        case $arg in
            chrome)
                test_chrome
                ;;
            firefox)
                test_firefox
                ;;
            safari)
                test_safari
                ;;
            edge)
                test_edge
                ;;
            all)
                test_all_browsers
                ;;
            help|--help|-h)
                show_usage
                exit 0
                ;;
            *)
                print_error "Unknown browser: $arg"
                show_usage
                exit 1
                ;;
        esac
        echo
    done
}

# Pre-flight checks
preflight_checks() {
    print_status "Running pre-flight checks..."

    # Check if we're in the right directory
    if [ ! -f "package.json" ]; then
        print_error "package.json not found. Are you in the extension root directory?"
        exit 1
    fi

    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        print_warning "node_modules not found. Run 'npm install' first."
        read -p "Install dependencies now? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            npm install
        else
            print_error "Dependencies required for building. Exiting."
            exit 1
        fi
    fi

    make_scripts_executable
    print_success "Pre-flight checks completed"
}

# Main execution
main() {
    echo
    print_status "Starting cross-browser extension testing..."
    echo

    # Run pre-flight checks
    preflight_checks

    echo
    print_status "Available test commands:"
    echo "  npm run test:chrome   - Test Chrome only"
    echo "  npm run test:firefox  - Test Firefox only"
    echo "  npm run test:safari   - Test Safari only"
    echo "  npm run test:edge     - Test Edge only"
    echo "  npm run test:all      - Test all browsers"
    echo

    # Parse arguments and run tests
    parse_arguments "$@"

    echo
    print_success "Cross-browser testing session complete!"

    # Show next steps
    echo
    print_status "Next steps:"
    echo "1. Review any warnings or errors from the tests"
    echo "2. Manually test each extension in the respective browsers"
    echo "3. Fix any issues found during testing"
    echo "4. Create distribution packages with 'npm run package'"
}

# Run main function with all arguments
main "$@"
