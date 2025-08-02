#!/bin/bash

# Extension Validation Script
# Validates extension package before cross-browser testing

set -e

echo "🔍 Extension Package Validation"
echo "==============================="

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

# Check if jq is available for JSON parsing
check_jq() {
    if ! command -v jq &> /dev/null; then
        print_warning "jq not found - JSON validation will be limited"
        return 1
    fi
    return 0
}

# Validate manifest.json
validate_manifest() {
    local manifest_file="$1"
    print_status "Validating $manifest_file..."

    if [ ! -f "$manifest_file" ]; then
        print_error "Manifest file not found: $manifest_file"
        return 1
    fi

    # Check JSON syntax
    if ! jq empty "$manifest_file" 2>/dev/null; then
        print_error "Invalid JSON in $manifest_file"
        return 1
    fi

    # Check required fields
    local required_fields=("name" "version" "manifest_version")
    for field in "${required_fields[@]}"; do
        if ! jq -e ".$field" "$manifest_file" > /dev/null 2>&1; then
            print_error "Missing required field: $field in $manifest_file"
            return 1
        fi
    done

    # Check permissions
    if ! jq -e '.permissions' "$manifest_file" > /dev/null 2>&1; then
        print_warning "No permissions field found in $manifest_file"
    fi

    print_success "Manifest validation passed: $manifest_file"
    return 0
}

# Validate directory structure
validate_structure() {
    print_status "Validating extension structure..."

    local base_dir="$1"
    local required_files=(
        "manifest.json"
        "vendor/serviceWorker.js"
        "vendor/popup.js"
        "popup.html"
    )

    for file in "${required_files[@]}"; do
        if [ ! -f "$base_dir/$file" ]; then
            print_error "Required file missing: $file"
            return 1
        fi
    done

    # Check assets
    if [ ! -d "$base_dir/assets" ]; then
        print_warning "Assets directory not found"
    else
        # Check for icons
        local icon_sizes=(16 32 128)
        for size in "${icon_sizes[@]}"; do
            if [ ! -f "$base_dir/assets/img/${size}.png" ]; then
                print_warning "Icon ${size}.png not found"
            fi
        done
    fi

    print_success "Structure validation passed"
    return 0
}

# Check file sizes
validate_sizes() {
    print_status "Checking file sizes..."

    local base_dir="$1"
    local warnings=0

    # Check for large files that might cause issues
    find "$base_dir" -type f -size +1M | while read -r file; do
        local size=$(du -h "$file" | cut -f1)
        print_warning "Large file detected: $file ($size)"
        warnings=$((warnings + 1))
    done

    # Check total extension size
    local total_size=$(du -sh "$base_dir" | cut -f1)
    print_status "Total extension size: $total_size"

    # Warn if extension is very large
    local size_mb=$(du -sm "$base_dir" | cut -f1)
    if [ "$size_mb" -gt 10 ]; then
        print_warning "Extension is large (${total_size}) - consider optimization"
    fi

    return 0
}

# Validate JavaScript files
validate_javascript() {
    print_status "Validating JavaScript files..."

    local base_dir="$1"
    local js_files=$(find "$base_dir" -name "*.js" -type f)

    if [ -z "$js_files" ]; then
        print_warning "No JavaScript files found"
        return 0
    fi

    local syntax_errors=0
    while IFS= read -r js_file; do
        # Basic syntax check using node
        if command -v node &> /dev/null; then
            if ! node -c "$js_file" 2>/dev/null; then
                print_error "Syntax error in: $js_file"
                syntax_errors=$((syntax_errors + 1))
            fi
        fi
    done <<< "$js_files"

    if [ "$syntax_errors" -eq 0 ]; then
        print_success "JavaScript validation passed"
    else
        print_error "$syntax_errors JavaScript files have syntax errors"
        return 1
    fi

    return 0
}

# Check for security issues
validate_security() {
    print_status "Checking for security issues..."

    local base_dir="$1"
    local warnings=0

    # Check for eval usage
    if grep -r "eval(" "$base_dir" --include="*.js" 2>/dev/null; then
        print_warning "eval() usage detected - may cause CSP issues"
        warnings=$((warnings + 1))
    fi

    # Check for inline scripts in HTML
    if grep -r "onclick\|onload\|onerror" "$base_dir" --include="*.html" 2>/dev/null; then
        print_warning "Inline event handlers detected - may violate CSP"
        warnings=$((warnings + 1))
    fi

    # Check for overly broad permissions
    if grep -r '"<all_urls>"' "$base_dir" --include="*.json" 2>/dev/null; then
        print_warning "Overly broad <all_urls> permission detected"
        warnings=$((warnings + 1))
    fi

    if [ "$warnings" -eq 0 ]; then
        print_success "No security issues detected"
    else
        print_warning "$warnings potential security issues found"
    fi

    return 0
}

# Validate browser-specific builds
validate_browser_builds() {
    print_status "Validating browser-specific builds..."

    # Check if dist directory exists
    if [ ! -d "dist" ]; then
        print_error "dist/ directory not found. Run 'npm run build' first."
        return 1
    fi

    # Validate main build
    validate_manifest "dist/manifest.json"
    validate_structure "dist"
    validate_sizes "dist"
    validate_javascript "dist"
    validate_security "dist"

    # Check if multiple manifests exist in public/
    local manifest_count=$(find public -name "manifest*.json" | wc -l)
    if [ "$manifest_count" -gt 1 ]; then
        print_status "Found $manifest_count browser-specific manifests"

        # Validate each browser manifest
        for manifest in public/manifest*.json; do
            if [ "$manifest" != "public/manifest.json" ]; then
                validate_manifest "$manifest"
            fi
        done
    fi

    return 0
}

# Main validation function
main() {
    echo
    print_status "Starting extension validation..."
    echo

    # Check prerequisites
    if ! check_jq; then
        print_status "Install jq for better JSON validation: brew install jq"
    fi

    # Check if we're in the right directory
    if [ ! -f "package.json" ]; then
        print_error "package.json not found. Are you in the extension root directory?"
        exit 1
    fi

    # Run validation
    if validate_browser_builds; then
        echo
        print_success "✅ Extension validation completed successfully!"
        echo
        print_status "Extension is ready for cross-browser testing."
        print_status "Run 'npm run test' to start browser testing."
    else
        echo
        print_error "❌ Extension validation failed!"
        echo
        print_status "Please fix the issues above before testing."
        exit 1
    fi
}

# Run main function
main "$@"
