#!/bin/bash

# Store Assets Preparation Script
# This script helps prepare all necessary assets for store submissions

set -e

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

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "This script must be run from the project root directory"
    exit 1
fi

print_status "Starting store assets preparation..."

# Create necessary directories
print_status "Creating store asset directories..."
mkdir -p store-assets/{chrome,firefox,safari,edge}/screenshots
mkdir -p store-assets/shared/icons

# Check for existing screenshots
print_status "Checking for existing screenshots..."
if [ -d "screenshots/store" ]; then
    print_status "Copying existing store screenshots..."
    cp screenshots/store/*.png store-assets/chrome/screenshots/ 2>/dev/null || true
    cp screenshots/store/*.png store-assets/firefox/screenshots/ 2>/dev/null || true
    cp screenshots/store/*.png store-assets/edge/screenshots/ 2>/dev/null || true
    print_success "Screenshots copied to store asset directories"
else
    print_warning "No existing store screenshots found in screenshots/store/"
    print_warning "Please add screenshots manually to store-assets/*/screenshots/ directories"
fi

# Copy icons
print_status "Copying extension icons..."
if [ -d "public/assets/img" ]; then
    cp public/assets/img/*.png store-assets/shared/icons/ 2>/dev/null || true
    print_success "Icons copied to shared directory"
else
    print_warning "Icon directory not found. Please ensure icons are available."
fi

# Generate README for each store
print_status "Generating store-specific README files..."

# Chrome README
cat > store-assets/chrome/README.md << 'EOF'
# Chrome Web Store Assets

This directory contains all assets needed for Chrome Web Store submission.

## Contents
- `metadata.md` - Complete store listing information
- `submission-checklist.md` - Pre-submission checklist
- `screenshots/` - Store screenshots (1280x800 recommended)

## Submission Process
1. Complete all items in `submission-checklist.md`
2. Use metadata from `metadata.md` for store listing
3. Upload screenshots from `screenshots/` directory
4. Test extension package: `npm run package:chrome`

## Required Screenshots
1. Main popup interface
2. Copy functionality demo
3. Format selection options
4. Bulk copy feature
5. Clean interface showcase

Each screenshot should be 1280x800 pixels for best quality.
EOF

# Firefox README
cat > store-assets/firefox/README.md << 'EOF'
# Firefox Add-ons (AMO) Assets

This directory contains all assets needed for Firefox Add-ons submission.

## Contents
- `metadata.md` - Complete AMO listing information
- `submission-checklist.md` - Pre-submission checklist
- `screenshots/` - AMO screenshots (1280x800 recommended)

## Submission Process
1. Run `npx web-ext lint --source-dir=build/firefox` and fix all issues
2. Complete all items in `submission-checklist.md`
3. Use metadata from `metadata.md` for AMO listing
4. Test extension package: `npm run package:firefox`

## Firefox-Specific Requirements
- Add-on ID: url-gathering-tool@rjana.in
- Minimum Firefox version: 109.0
- Must pass web-ext lint without errors
- Source code may be required for review

## Required Screenshots
1. Firefox popup interface
2. Tab collection demo
3. Format options
4. Firefox integration features
5. Privacy focus demonstration
EOF

# Safari README
cat > store-assets/safari/README.md << 'EOF'
# Safari App Extension Assets

This directory contains all assets needed for Safari App Extension submission.

## Contents
- `metadata.md` - Complete Mac App Store listing information
- `screenshots/` - Mac App Store screenshots

## Submission Process
1. Convert extension using Xcode Safari Extension converter
2. Configure app bundle and signing
3. Use metadata from `metadata.md` for App Store listing
4. Submit through App Store Connect

## Special Requirements
- Requires Xcode for conversion and submission
- Code signing certificate needed
- App Store Connect account required
- May require app icons in addition to extension icons

## Mac App Store Screenshots
Should show extension working within Safari on macOS interface.
EOF

# Edge README
cat > store-assets/edge/README.md << 'EOF'
# Microsoft Edge Add-ons Assets

This directory contains all assets needed for Edge Add-ons submission.

## Contents
- `metadata.md` - Complete Edge Add-ons store listing information
- `screenshots/` - Edge store screenshots (1280x800 recommended)

## Submission Process
1. Use Chrome build for Edge (Chromium compatibility)
2. Use metadata from `metadata.md` for Edge store listing
3. Test in Microsoft Edge browser
4. Submit through Microsoft Partner Center

## Edge-Specific Features
- Emphasize Edge Collections integration
- Highlight business/enterprise compatibility
- Show Edge-specific UI elements in screenshots

## Required Screenshots
1. Edge integration showcase
2. Collections compatibility
3. Multi-format export
4. Business workflow demonstration
5. Touch interface (if applicable)
EOF

print_success "Store-specific README files generated"

# Generate quick validation script
print_status "Creating validation script..."
cat > store-assets/validate-assets.sh << 'EOF'
#!/bin/bash

# Quick validation script for store assets

echo "🔍 Validating store assets..."

# Check for required files
stores=("chrome" "firefox" "safari" "edge")
required_files=("metadata.md" "README.md")

for store in "${stores[@]}"; do
    echo "Checking $store assets..."
    for file in "${required_files[@]}"; do
        if [ -f "store-assets/$store/$file" ]; then
            echo "  ✅ $file exists"
        else
            echo "  ❌ $file missing"
        fi
    done

    # Check for screenshots
    screenshot_count=$(ls store-assets/$store/screenshots/*.png 2>/dev/null | wc -l)
    if [ $screenshot_count -gt 0 ]; then
        echo "  ✅ $screenshot_count screenshots found"
    else
        echo "  ⚠️  No screenshots found"
    fi
done

# Check for shared assets
if [ -d "store-assets/shared/icons" ]; then
    icon_count=$(ls store-assets/shared/icons/*.png 2>/dev/null | wc -l)
    echo "📱 $icon_count shared icons found"
else
    echo "⚠️  No shared icons directory"
fi

# Check builds
echo "🔨 Checking builds..."
for store in "${stores[@]}"; do
    if [ -f "build/$store-v*.zip" ]; then
        echo "  ✅ $store build exists"
    else
        echo "  ❌ $store build missing (run npm run package:$store)"
    fi
done

echo "✨ Validation complete!"
EOF

chmod +x store-assets/validate-assets.sh
print_success "Validation script created at store-assets/validate-assets.sh"

# Generate submission tracking sheet
print_status "Creating submission tracking sheet..."
cat > store-assets/SUBMISSION-TRACKER.md << 'EOF'
# Store Submission Tracker

Track the progress of submissions across all browser stores.

## Submission Status

| Store | Status | Submitted Date | Review Status | Approval Date | Notes |
|-------|--------|----------------|---------------|---------------|-------|
| Chrome Web Store | ⏳ Pending | - | - | - | - |
| Firefox AMO | ⏳ Pending | - | - | - | - |
| Safari App Store | ⏳ Pending | - | - | - | - |
| Microsoft Edge | ⏳ Pending | - | - | - | - |

## Status Legend
- ⏳ Pending - Not yet submitted
- 🔄 In Review - Submitted and under review
- ✅ Approved - Approved and live
- ❌ Rejected - Rejected, needs fixes
- 🔧 Fixing - Working on fixes for resubmission

## Review Timeline Tracking

### Chrome Web Store
- **Submission Date**:
- **Initial Review**:
- **Additional Reviews**:
- **Approval Date**:
- **Live Date**:

### Firefox AMO
- **Submission Date**:
- **Lint Check**:
- **Security Review**:
- **Final Review**:
- **Approval Date**:

### Safari App Store
- **Xcode Conversion**:
- **Submission Date**:
- **Review Status**:
- **Approval Date**:

### Microsoft Edge
- **Submission Date**:
- **Certification Review**:
- **Approval Date**:

## Store URLs (After Approval)
- **Chrome**:
- **Firefox**:
- **Safari**:
- **Edge**:

## Notes and Feedback
### Chrome Web Store
-

### Firefox AMO
-

### Safari App Store
-

### Microsoft Edge
-

## Next Actions
- [ ]
- [ ]
- [ ]

---
*Last updated: August 3, 2025*
EOF

print_success "Submission tracker created at store-assets/SUBMISSION-TRACKER.md"

# Final summary
echo ""
print_success "🎉 Store assets preparation complete!"
echo ""
print_status "Next steps:"
echo "1. Run './store-assets/validate-assets.sh' to check your assets"
echo "2. Add screenshots to store-assets/*/screenshots/ directories"
echo "3. Review and customize metadata in store-assets/*/metadata.md files"
echo "4. Complete submission checklists in store-assets/*/submission-checklist.md"
echo "5. Build packages: npm run package"
echo "6. Start with Chrome Web Store submission (easiest/fastest)"
echo ""
print_status "📁 All assets are organized in the store-assets/ directory"
print_status "📊 Track your submissions using store-assets/SUBMISSION-TRACKER.md"
echo ""
