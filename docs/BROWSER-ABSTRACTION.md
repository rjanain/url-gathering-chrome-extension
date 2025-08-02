# Browser Abstraction Module

The `utils/browser.js` module provides a comprehensive abstraction layer for handling browser-specific logic across Chrome, Firefox, Safari, Edge, and Opera.

## Features

### Browser Detection
- Automatic browser detection
- Support for Chrome, Firefox, Safari, Edge, Opera
- Manifest version detection (V2 vs V3)

### API Abstraction
- Unified access to browser extension APIs
- Automatic fallback to Chrome API when polyfill unavailable
- Consistent interface across all browsers

### Browser-Specific Quirks Handling
- Clipboard operations with fallbacks
- URL filtering for browser-specific internal pages
- Storage quota management
- Icon size preferences
- Permission handling

## Usage Examples

### Basic Browser Detection

```javascript
import { Browser } from './utils/browser.js';

// Get current browser
const currentBrowser = Browser.info.getCurrent();
console.log('Current browser:', currentBrowser);

// Check specific browsers
if (Browser.info.isChrome()) {
    console.log('Running on Chrome');
} else if (Browser.info.isFirefox()) {
    console.log('Running on Firefox');
}
```

### API Access

```javascript
import { Browser } from './utils/browser.js';

// Get browser API (with polyfill support)
const api = Browser.api.getAPI();

// Get specific APIs
const tabs = Browser.api.getTabs();
const storage = Browser.api.getStorage();
const runtime = Browser.api.getRuntime();

// Query tabs
const allTabs = await tabs.query({ currentWindow: true });
```

### Clipboard Operations

```javascript
import { Browser } from './utils/browser.js';

// Copy text with browser-specific handling
const success = await Browser.quirks.copyToClipboard('Hello World!');
if (success) {
    console.log('Text copied successfully');
} else {
    console.log('Failed to copy text');
}
```

### URL Filtering

```javascript
import { Browser } from './utils/browser.js';

// Filter out browser-specific internal URLs
const tabs = await Browser.api.getTabs().query({ currentWindow: true });
const filteredTabs = Browser.quirks.filterInternalUrls(tabs);
console.log('Filtered tabs:', filteredTabs);
```

### Conditional Browser Behavior

```javascript
import { Browser } from './utils/browser.js';

// Execute different code based on browser
const result = Browser.utils.conditional({
    chrome: () => {
        console.log('Chrome-specific logic');
        return 'chrome-result';
    },
    firefox: () => {
        console.log('Firefox-specific logic');
        return 'firefox-result';
    },
    safari: () => {
        console.log('Safari-specific logic');
        return 'safari-result';
    }
}, () => {
    // Default handler
    console.log('Default logic for other browsers');
    return 'default-result';
});
```

### Browser Configuration

```javascript
import { Browser } from './utils/browser.js';

// Get browser-specific configuration
const maxStorageSize = Browser.utils.getConfig('maxStorageSize');
const supportsOffscreen = Browser.utils.getConfig('supportsOffscreen');

console.log('Max storage size:', maxStorageSize);
console.log('Supports offscreen API:', supportsOffscreen);
```

### Permission Handling

```javascript
import { Browser } from './utils/browser.js';

// Check permissions with browser-specific handling
const hasTabsPermission = await Browser.quirks.checkPermissions(['tabs']);
if (hasTabsPermission) {
    console.log('Tabs permission granted');
} else {
    console.log('Tabs permission denied');
}
```

### Storage Quota Management

```javascript
import { Browser } from './utils/browser.js';

// Handle storage with quota awareness
const data = { key: 'value', timestamp: Date.now() };
const success = await Browser.quirks.handleStorageQuotas(data);
if (success) {
    // Proceed with storage operation
    await Browser.api.getStorage().local.set(data);
}
```

## Integration Examples

### In React Components

```javascript
import React, { useEffect, useState } from 'react';
import { Browser } from '../utils/browser.js';

const BrowserAwareComponent = () => {
    const [browserInfo, setBrowserInfo] = useState(null);

    useEffect(() => {
        // Log browser information on component mount
        Browser.utils.logBrowserInfo();

        setBrowserInfo({
            name: Browser.info.getCurrent(),
            manifestVersion: Browser.info.getManifestVersion(),
            supportsV3: Browser.info.supportsManifestV3()
        });
    }, []);

    const handleCopy = async (text) => {
        const success = await Browser.quirks.copyToClipboard(text);
        if (success) {
            alert('Copied to clipboard!');
        } else {
            alert('Failed to copy');
        }
    };

    return (
        <div>
            <h3>Browser Info</h3>
            {browserInfo && (
                <ul>
                    <li>Browser: {browserInfo.name}</li>
                    <li>Manifest Version: {browserInfo.manifestVersion}</li>
                    <li>Supports MV3: {browserInfo.supportsV3 ? 'Yes' : 'No'}</li>
                </ul>
            )}
            <button onClick={() => handleCopy('Hello from browser abstraction!')}>
                Copy Text
            </button>
        </div>
    );
};
```

### In Background Scripts

```javascript
import { Browser } from './utils/browser.js';

// Initialize browser abstraction
Browser.utils.logBrowserInfo();

// Set up listeners with browser-specific handling
const api = Browser.api.getAPI();

api.runtime.onInstalled.addListener((details) => {
    if (details.reason === api.runtime.OnInstalledReason.INSTALL) {
        // Handle installation with browser-specific logic
        Browser.utils.conditional({
            chrome: () => {
                api.runtime.setUninstallURL('https://example.com/uninstall-chrome');
            },
            firefox: () => {
                api.runtime.setUninstallURL('https://example.com/uninstall-firefox');
            }
        });
    }
});
```

## Browser Support Matrix

| Feature | Chrome | Firefox | Safari | Edge | Opera |
|---------|--------|---------|--------|------|-------|
| Manifest V3 | ✅ | ❌ | ❌ | ✅ | ✅ |
| WebExtension Polyfill | ✅ | ✅ | ✅ | ✅ | ✅ |
| Clipboard API | ✅ | ✅ | ✅ | ✅ | ✅ |
| Storage Sync | ✅ | ✅ | Limited | ✅ | ✅ |
| Offscreen API | ✅ | ❌ | ❌ | ✅ | ✅ |

## Migration Guide

### From Direct Chrome API Usage

Before:
```javascript
const tabs = await chrome.tabs.query({ currentWindow: true });
```

After:
```javascript
import { Browser } from './utils/browser.js';
const tabs = await Browser.api.getTabs().query({ currentWindow: true });
```

### From Manual Browser Detection

Before:
```javascript
const isFirefox = navigator.userAgent.includes('Firefox');
if (isFirefox) {
    // Firefox-specific code
}
```

After:
```javascript
import { Browser } from './utils/browser.js';
if (Browser.info.isFirefox()) {
    // Firefox-specific code
}
```

### From Direct Clipboard Usage

Before:
```javascript
await navigator.clipboard.writeText(text);
```

After:
```javascript
import { Browser } from './utils/browser.js';
const success = await Browser.quirks.copyToClipboard(text);
```

## Best Practices

1. **Always use the browser abstraction** instead of direct API access
2. **Check browser capabilities** before using advanced features
3. **Handle errors gracefully** with fallback mechanisms
4. **Log browser information** during development for debugging
5. **Test across all supported browsers** to ensure compatibility

## Troubleshooting

### Common Issues

1. **API not available**: Ensure webextension-polyfill is properly loaded
2. **Clipboard fails**: Check if the page has user interaction before copying
3. **Storage quota exceeded**: Use `handleStorageQuotas()` to check limits
4. **Permission denied**: Verify permissions in manifest and check with `checkPermissions()`

### Debug Information

```javascript
import { Browser } from './utils/browser.js';

// Get comprehensive browser information
Browser.utils.logBrowserInfo();

// Check specific capabilities
console.log('Supports MV3:', Browser.info.supportsManifestV3());
console.log('Max storage:', Browser.utils.getConfig('maxStorageSize'));
console.log('Current browser:', Browser.info.getCurrent());
```
