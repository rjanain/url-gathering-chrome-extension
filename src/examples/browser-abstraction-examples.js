/**
 * Example usage of the Browser Abstraction Module
 * This file demonstrates how to use utils/browser.js for cross-browser compatibility
 */

import { Browser } from '../utils/browser.js';

// =============================================================================
// BROWSER DETECTION EXAMPLES
// =============================================================================

export const browserDetectionExamples = () => {
  console.group('Browser Detection Examples');

  // Get current browser
  const currentBrowser = Browser.info.getCurrent();
  console.log('Current browser:', currentBrowser);

  // Check specific browsers
  console.log('Is Chrome:', Browser.info.isChrome());
  console.log('Is Firefox:', Browser.info.isFirefox());
  console.log('Is Safari:', Browser.info.isSafari());
  console.log('Is Edge:', Browser.info.isEdge());

  // Check manifest version support
  console.log('Supports Manifest V3:', Browser.info.supportsManifestV3());
  console.log('Preferred Manifest Version:', Browser.info.getManifestVersion());

  console.groupEnd();
};

// =============================================================================
// API ABSTRACTION EXAMPLES
// =============================================================================

export const apiAbstractionExamples = async () => {
  console.group('API Abstraction Examples');

  try {
    // Get unified browser API
    const api = Browser.api.getAPI();
    console.log('Browser API available:', !!api);

    // Get specific APIs
    const tabs = Browser.api.getTabs();
    const storage = Browser.api.getStorage();
    const runtime = Browser.api.getRuntime();

    // Example: Query current tabs
    const currentTabs = await tabs.query({ currentWindow: true });
    console.log('Current tabs count:', currentTabs.length);

    // Example: Get extension info
    const manifest = runtime.getManifest();
    console.log('Extension name:', manifest.name);
    console.log('Extension version:', manifest.version);

  } catch (error) {
    console.error('API access failed:', error);
  }

  console.groupEnd();
};

// =============================================================================
// CLIPBOARD OPERATION EXAMPLES
// =============================================================================

export const clipboardExamples = async () => {
  console.group('Clipboard Operation Examples');

  try {
    // Copy simple text
    const textToCopy = `Extension running on: ${Browser.info.getCurrent()}`;
    const success = await Browser.quirks.copyToClipboard(textToCopy);

    if (success) {
      console.log('✅ Text copied successfully:', textToCopy);
    } else {
      console.log('❌ Failed to copy text');
    }

  } catch (error) {
    console.error('Clipboard operation failed:', error);
  }

  console.groupEnd();
};

// =============================================================================
// URL FILTERING EXAMPLES
// =============================================================================

export const urlFilteringExamples = async () => {
  console.group('URL Filtering Examples');

  try {
    // Get all tabs
    const tabs = await Browser.api.getTabs().query({});
    console.log('Total tabs:', tabs.length);

    // Filter out browser-specific internal URLs
    const filteredTabs = Browser.quirks.filterInternalUrls(tabs);
    console.log('Filtered tabs (web content only):', filteredTabs.length);

    // Show filtering pattern for current browser
    const pattern = Browser.quirks.getUrlFilterPattern();
    console.log('URL filter pattern:', pattern);

    // Example filtered URLs
    const webUrls = filteredTabs.slice(0, 3).map(tab => tab.url);
    console.log('Sample web URLs:', webUrls);

  } catch (error) {
    console.error('URL filtering failed:', error);
  }

  console.groupEnd();
};

// =============================================================================
// CONDITIONAL BROWSER BEHAVIOR EXAMPLES
// =============================================================================

export const conditionalBehaviorExamples = () => {
  console.group('Conditional Browser Behavior Examples');

  // Execute different code based on browser
  const result = Browser.utils.conditional({
    chrome: () => {
      console.log('🟢 Executing Chrome-specific logic');
      return { browser: 'chrome', features: ['manifest-v3', 'offscreen-api'] };
    },
    firefox: () => {
      console.log('🟠 Executing Firefox-specific logic');
      return { browser: 'firefox', features: ['manifest-v2', 'webextension-api'] };
    },
    safari: () => {
      console.log('🔵 Executing Safari-specific logic');
      return { browser: 'safari', features: ['safari-extension-api'] };
    },
    edge: () => {
      console.log('🟡 Executing Edge-specific logic');
      return { browser: 'edge', features: ['manifest-v3', 'edge-apis'] };
    }
  }, () => {
    console.log('⚪ Executing default logic for unknown browser');
    return { browser: 'unknown', features: ['basic-webextension'] };
  });

  console.log('Browser behavior result:', result);
  console.groupEnd();
};

// =============================================================================
// CONFIGURATION EXAMPLES
// =============================================================================

export const configurationExamples = () => {
  console.group('Configuration Examples');

  // Get browser-specific configuration
  const maxStorage = Browser.utils.getConfig('maxStorageSize');
  const maxItems = Browser.utils.getConfig('maxStorageItems');
  const supportsOffscreen = Browser.utils.getConfig('supportsOffscreen');
  const supportsDeclarative = Browser.utils.getConfig('supportsDeclarativeNetRequest');

  console.log('Configuration for', Browser.info.getCurrent());
  console.log('Max storage size:', Math.round(maxStorage / 1024 / 1024) + 'MB');
  console.log('Max storage items:', maxItems.toLocaleString());
  console.log('Supports offscreen API:', supportsOffscreen);
  console.log('Supports declarative net request:', supportsDeclarative);

  // Get icon size preferences
  const iconSizes = Browser.quirks.getIconSizes();
  console.log('Icon size preferences:', iconSizes);

  console.groupEnd();
};

// =============================================================================
// PERMISSION HANDLING EXAMPLES
// =============================================================================

export const permissionExamples = async () => {
  console.group('Permission Handling Examples');

  try {
    // Check various permissions
    const permissions = ['tabs', 'storage', 'activeTab'];

    for (const permission of permissions) {
      const hasPermission = await Browser.quirks.checkPermissions([permission]);
      console.log(`Permission "${permission}":`, hasPermission ? '✅ Granted' : '❌ Denied');
    }

  } catch (error) {
    console.error('Permission check failed:', error);
  }

  console.groupEnd();
};

// =============================================================================
// STORAGE QUOTA EXAMPLES
// =============================================================================

export const storageQuotaExamples = async () => {
  console.group('Storage Quota Examples');

  try {
    // Example data to store
    const testData = {
      timestamp: Date.now(),
      browser: Browser.info.getCurrent(),
      extensionId: 'url-gathering-tool',
      settings: {
        theme: 'dark',
        notifications: true,
        autoUpdate: false
      }
    };

    // Check storage quota before storing
    const quotaOk = await Browser.quirks.handleStorageQuotas(testData);
    console.log('Storage quota check:', quotaOk ? '✅ OK' : '❌ Warning');

    if (quotaOk) {
      const storage = Browser.api.getStorage();
      await storage.local.set({ exampleData: testData });
      console.log('✅ Data stored successfully');

      // Retrieve and verify
      const retrieved = await storage.local.get(['exampleData']);
      console.log('Retrieved data:', retrieved.exampleData);
    }

  } catch (error) {
    console.error('Storage operation failed:', error);
  }

  console.groupEnd();
};

// =============================================================================
// COMPREHENSIVE EXAMPLE RUNNER
// =============================================================================

export const runAllExamples = async () => {
  console.log('🚀 Running Browser Abstraction Examples');
  console.log('=====================================');

  // Log comprehensive browser information
  Browser.utils.logBrowserInfo();

  // Run all examples
  try {
    browserDetectionExamples();
    await apiAbstractionExamples();
    await clipboardExamples();
    await urlFilteringExamples();
    conditionalBehaviorExamples();
    configurationExamples();
    await permissionExamples();
    await storageQuotaExamples();

    console.log('✅ All examples completed successfully');
  } catch (error) {
    console.error('❌ Example execution failed:', error);
  }
};

// =============================================================================
// REACT COMPONENT EXAMPLE
// =============================================================================

export const BrowserInfoComponent = () => {
  const [browserInfo, setBrowserInfo] = React.useState(null);
  const [clipboardResult, setClipboardResult] = React.useState('');

  React.useEffect(() => {
    // Initialize browser info
    setBrowserInfo({
      name: Browser.info.getCurrent(),
      manifestVersion: Browser.info.getManifestVersion(),
      supportsV3: Browser.info.supportsManifestV3(),
      maxStorage: Browser.utils.getConfig('maxStorageSize'),
      iconSizes: Browser.quirks.getIconSizes()
    });
  }, []);

  const handleCopyTest = async () => {
    const testText = `Browser: ${Browser.info.getCurrent()}, Time: ${new Date().toISOString()}`;
    const success = await Browser.quirks.copyToClipboard(testText);
    setClipboardResult(success ? 'Copy successful!' : 'Copy failed!');

    // Clear message after 3 seconds
    setTimeout(() => setClipboardResult(''), 3000);
  };

  return React.createElement('div', { style: { padding: '20px', fontFamily: 'monospace' } }, [
    React.createElement('h3', { key: 'title' }, 'Browser Abstraction Demo'),

    browserInfo && React.createElement('div', { key: 'info' }, [
      React.createElement('h4', { key: 'info-title' }, 'Browser Information:'),
      React.createElement('ul', { key: 'info-list' }, [
        React.createElement('li', { key: 'name' }, `Browser: ${browserInfo.name}`),
        React.createElement('li', { key: 'manifest' }, `Manifest Version: ${browserInfo.manifestVersion}`),
        React.createElement('li', { key: 'supports' }, `Supports MV3: ${browserInfo.supportsV3 ? 'Yes' : 'No'}`),
        React.createElement('li', { key: 'storage' }, `Max Storage: ${Math.round(browserInfo.maxStorage / 1024 / 1024)}MB`),
        React.createElement('li', { key: 'icons' }, `Icon Sizes: ${Object.values(browserInfo.iconSizes).join(', ')}px`)
      ])
    ]),

    React.createElement('div', { key: 'actions', style: { marginTop: '20px' } }, [
      React.createElement('button', {
        key: 'copy-btn',
        onClick: handleCopyTest,
        style: { padding: '10px 20px', marginRight: '10px' }
      }, 'Test Clipboard'),

      React.createElement('button', {
        key: 'examples-btn',
        onClick: runAllExamples,
        style: { padding: '10px 20px' }
      }, 'Run All Examples')
    ]),

    clipboardResult && React.createElement('div', {
      key: 'result',
      style: {
        marginTop: '10px',
        padding: '10px',
        backgroundColor: clipboardResult.includes('successful') ? '#d4edda' : '#f8d7da',
        color: clipboardResult.includes('successful') ? '#155724' : '#721c24',
        borderRadius: '4px'
      }
    }, clipboardResult)
  ]);
};

// Export for use in popup or options page
export default {
  runAllExamples,
  BrowserInfoComponent,
  browserDetectionExamples,
  apiAbstractionExamples,
  clipboardExamples,
  urlFilteringExamples,
  conditionalBehaviorExamples,
  configurationExamples,
  permissionExamples,
  storageQuotaExamples
};
