# Cross-Browser Manifest Documentation

## Overview
This project supports multiple browsers with optimized manifest files for each platform:

- **Chrome/Edge**: Manifest V3 (`manifest.json`)
- **Firefox**: Manifest V2 (`manifest-firefox.json`)
- **Safari**: Manifest V2 (`manifest-safari.json`)

## Key Differences Between Browsers

### Chrome/Edge (Manifest V3)
- Uses `service_worker` instead of background scripts
- Requires `host_permissions` for cross-origin requests
- Uses `action` instead of `browser_action`
- Supports `minimum_chrome_version` specification
- Enhanced Content Security Policy structure
- `web_accessible_resources` requires match patterns

### Firefox (Manifest V2/V3 Hybrid)
- Currently supports Manifest V2 with some V3 features
- Uses `browser_action` instead of `action`
- Requires `applications.gecko` for Firefox-specific metadata
- Different CSP format
- Web accessible resources don't require match patterns

### Safari
- Based on Manifest V2
- Similar to Firefox but without Firefox-specific fields
- More restrictive permission model
- Limited support for some advanced features

## Manifest Features Comparison

| Feature | Chrome/Edge (V3) | Firefox (V2) | Safari (V2) |
|---------|------------------|--------------|-------------|
| Background | `service_worker` | `scripts` | `scripts` |
| Action Button | `action` | `browser_action` | `browser_action` |
| Host Permissions | `host_permissions` | Included in `permissions` | Included in `permissions` |
| CSP | Object format | String format | String format |
| Web Resources | Requires matches | Array of strings | Array of strings |
| Commands | Full support | Full support | Limited support |

## Permissions Breakdown

### Core Permissions (All Browsers)
- `tabs`: Access to browser tabs information
- `storage`: Local storage for extension data
- `activeTab`: Access to currently active tab

### Chrome/Edge Specific
- `host_permissions`: Required for cross-origin requests in V3

### Content Security Policy

#### Chrome/Edge (V3)
```json
"content_security_policy": {
    "extension_pages": "script-src 'self'; object-src 'self'; frame-ancestors 'none';"
}
```

#### Firefox/Safari (V2)
```json
"content_security_policy": "script-src 'self'; object-src 'self';"
```

## Building for Different Browsers

### Using the Build Script
```bash
# Build for specific browser
./scripts/build-manifest.sh chrome
./scripts/build-manifest.sh firefox
./scripts/build-manifest.sh safari

# Build for all browsers
./scripts/build-manifest.sh all
```

### Manual Process
1. Copy the appropriate manifest file to `manifest.json`
2. Ensure your JavaScript code handles API differences
3. Test thoroughly on target browser

## Browser API Compatibility

### Service Worker vs Background Scripts
```javascript
// Chrome/Edge (Service Worker)
chrome.runtime.onInstalled.addListener(details => {
    // Service worker code
});

// Firefox/Safari (Background Script)
// Same API, but different execution context
chrome.runtime.onInstalled.addListener(details => {
    // Background script code
});
```

### Action vs Browser Action
```javascript
// Chrome/Edge (V3)
chrome.action.setBadgeText({text: '5'});

// Firefox/Safari (V2)
chrome.browserAction.setBadgeText({text: '5'});
```

## Testing Recommendations

1. **Chrome/Edge**: Test with latest stable and beta versions
2. **Firefox**: Test with Firefox Developer Edition
3. **Safari**: Test with Safari Technology Preview

## Deployment Notes

### Chrome Web Store
- Use the main `manifest.json` (V3)
- Minimum Chrome version: 88+

### Firefox Add-ons (AMO)
- Use `manifest-firefox.json`
- Include proper `applications.gecko` ID
- Test with Firefox ESR for compatibility

### Safari App Store
- Use `manifest-safari.json`
- Additional native app wrapper required
- Follow Apple's extension guidelines

## Migration Path

If moving from V2 to V3:
1. Update background scripts to service workers
2. Change `browser_action` to `action`
3. Move host permissions from `permissions` to `host_permissions`
4. Update CSP format
5. Update web accessible resources format

## Browser-Specific Considerations

### Chrome/Edge
- Full Manifest V3 support
- Service workers have limited APIs compared to background scripts
- Strict CSP enforcement

### Firefox
- Gradual V3 adoption
- Some V3 features not yet supported
- Better background script persistence options

### Safari
- Requires native app wrapper for distribution
- More restrictive permission model
- Limited extension API support compared to other browsers
