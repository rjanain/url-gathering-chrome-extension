#!/bin/bash

# Extension Verification Script
# Checks if all required files are present for Chrome extension

CHROME_DIR="./dist/chrome"

echo "🔍 Verifying Chrome Extension Build..."

# Check if directory exists
if [ ! -d "$CHROME_DIR" ]; then
    echo "❌ Chrome build directory not found: $CHROME_DIR"
    exit 1
fi

# Required files for Chrome extension
required_files=(
    "manifest.json"
    "popup.html"
    "vendor/serviceWorker.js"
    "vendor/contentScript.js"
    "vendor/popup.js"
)

# Check each required file
missing_files=()
for file in "${required_files[@]}"; do
    if [ -f "$CHROME_DIR/$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file (MISSING)"
        missing_files+=("$file")
    fi
done

# Check if assets directory exists
if [ -d "$CHROME_DIR/assets" ]; then
    echo "✅ assets/ directory"

    # Check for icon files
    icon_files=("assets/img/16.png" "assets/img/32.png" "assets/img/180.png")
    for icon in "${icon_files[@]}"; do
        if [ -f "$CHROME_DIR/$icon" ]; then
            echo "✅ $icon"
        else
            echo "⚠️  $icon (missing but not critical)"
        fi
    done
else
    echo "❌ assets/ directory (MISSING)"
    missing_files+=("assets/")
fi

echo ""

# Summary
if [ ${#missing_files[@]} -eq 0 ]; then
    echo "🎉 Chrome extension build is complete and ready to load!"
    echo ""
    echo "📂 To load in Chrome:"
    echo "   1. Open Chrome and go to chrome://extensions/"
    echo "   2. Enable 'Developer mode' (top-right toggle)"
    echo "   3. Click 'Load unpacked'"
    echo "   4. Select the directory: $CHROME_DIR"
    echo ""
    echo "📁 Extension directory: $(pwd)/$CHROME_DIR"
else
    echo "❌ Missing ${#missing_files[@]} required file(s):"
    printf '   - %s\n' "${missing_files[@]}"
    echo ""
    echo "🔧 To fix: Run 'npm run build:chrome' to rebuild"
fi
