#!/bin/bash

# Cross-browser manifest builder
# Usage: ./build-manifest.sh [chrome|firefox|safari|all]

BROWSER=${1:-chrome}
PUBLIC_DIR="./public"

build_for_browser() {
    local browser=$1
    echo "Building manifest for $browser..."
    
    case $browser in
        "chrome"|"edge")
            cp "$PUBLIC_DIR/manifest.json" "$PUBLIC_DIR/manifest-active.json"
            echo "✓ Chrome/Edge Manifest V3 ready"
            ;;
        "firefox")
            cp "$PUBLIC_DIR/manifest-firefox.json" "$PUBLIC_DIR/manifest-active.json"
            echo "✓ Firefox Manifest V2 ready"
            ;;
        "safari")
            cp "$PUBLIC_DIR/manifest-safari.json" "$PUBLIC_DIR/manifest-active.json"
            echo "✓ Safari Manifest V2 ready"
            ;;
        *)
            echo "❌ Unknown browser: $browser"
            echo "Available options: chrome, firefox, safari, all"
            exit 1
            ;;
    esac
}

if [ "$BROWSER" = "all" ]; then
    echo "Building manifests for all browsers..."
    
    # Create browser-specific output directories
    mkdir -p dist/chrome dist/firefox dist/safari
    
    # Copy base files to each directory
    for browser_dir in chrome firefox safari; do
        cp -r "$PUBLIC_DIR"/* "dist/$browser_dir/"
        cp -r src/ "dist/$browser_dir/"
    done
    
    # Copy appropriate manifests
    cp "$PUBLIC_DIR/manifest.json" "dist/chrome/manifest.json"
    cp "$PUBLIC_DIR/manifest-firefox.json" "dist/firefox/manifest.json"
    cp "$PUBLIC_DIR/manifest-safari.json" "dist/safari/manifest.json"
    
    echo "✓ All browser builds ready in dist/ directory"
else
    build_for_browser "$BROWSER"
fi

echo "Build complete!"
