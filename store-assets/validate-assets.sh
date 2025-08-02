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
