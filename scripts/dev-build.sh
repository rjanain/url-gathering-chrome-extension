#!/bin/bash

# Development Build Script for Chrome Extension
# This script builds the extension for development with relaxed CSP for debugging

echo "🔧 Building URL Gathering Tool for Development..."

# Run webpack development build
npm run dev:build

if [ $? -eq 0 ]; then
    echo "✅ Webpack build completed successfully"

    # Copy the standard manifest for development
    echo "📝 Creating development manifest..."
    cp public/manifest-active.json dist/manifest.json
    echo "✅ Development manifest created"

    echo "🚀 Development build complete!"
    echo "📁 Output: dist/"
    echo "ℹ️  Content scripts are CSP-compliant (no source maps)"

else
    echo "❌ Webpack build failed"
    exit 1
fi
