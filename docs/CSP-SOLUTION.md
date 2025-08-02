# Content Security Policy (CSP) Solution for Chrome Extension Development

## Problem Solved
Fixed the CSP violation error: `EvalError: Refused to evaluate a string as JavaScript because 'unsafe-eval' is not an allowed source of script`

## Root Cause
Content scripts in Chrome extensions have stricter CSP requirements than extension pages:
- **Extension pages** (popup, options, background): Can use source maps with standard CSP
- **Content scripts**: Run in web page context with stricter CSP, cannot use source maps that require eval

## Solution Implemented

### 1. Selective Source Map Removal
Modified `webpack.config.js` to automatically remove source maps from content scripts while preserving them for other files:

```javascript
// Custom plugin to disable source maps for content scripts in development
...(isDevelopment ? [{
    apply: (compiler) => {
        compiler.hooks.afterEmit.tap('DisableContentScriptSourceMaps', (compilation) => {
            // Remove source map reference and file for content scripts only
        });
    }
}] : [])
```

### 2. Service Worker Context Fix
Fixed `document is not defined` error in service workers by replacing `document.baseURI` with `self.location.href` in webpack's chunk loading runtime.

### 3. Standard CSP Compliance
The extension now uses Chrome's standard CSP without requiring unsafe-eval:
```json
"content_security_policy": {
    "extension_pages": "script-src 'self'; object-src 'self'; frame-ancestors 'none';"
}
```

### 4. Build Results
- ✅ **Content Script**: No source map, no CSP violations, Chrome-compliant
- ✅ **Service Worker**: Source map preserved, no document errors, proper context handling
- ✅ **Popup Script**: Source map preserved for debugging
- ✅ **Vendor Libraries**: Source map preserved for debugging
- ✅ **Extension Loading**: Works without any CSP errors or warnings

## Files Modified
1. `webpack.config.js` - Added content script source map removal plugin
2. `package.json` - Updated dev:build script
3. `scripts/dev-build.sh` - Development build with relaxed CSP for extension pages

## Build Commands
```bash
# Development build (CSP-safe)
npm run dev:build

# Development build with relaxed CSP for extension pages
./scripts/dev-build.sh
```

## Debugging Approach
- **Content Scripts**: Use console.log() and Chrome DevTools (no source maps due to CSP)
- **Extension Pages**: Full source map debugging available
- **Service Worker**: Full source map debugging available

## Production
In production builds, this issue doesn't occur as we use different source map strategies optimized for release.

## Future Considerations
- Content scripts remain debuggable through Chrome DevTools console
- Extension pages maintain full debugging capabilities
- CSP compliance ensures extension works on all websites
