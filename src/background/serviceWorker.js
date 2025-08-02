/**
 * Background Script For the Chrome Extension
 *
 */

// Dynamically import polyfill if needed
const initPolyfill = async () => {
  if (typeof browser === 'undefined') {
    try {
      // Try to import webextension-polyfill
      const polyfill = await import('webextension-polyfill');
      globalThis.browser = polyfill.default;
    } catch (error) {
      // Fallback to chrome if polyfill fails
      console.warn('WebExtension polyfill not available, falling back to chrome:', error);
      globalThis.browser = chrome;
    }
  }
};

// Initialize and set up listeners
initPolyfill().then(() => {
  // Gather feedback on uninstall
  browser.runtime.onInstalled.addListener(details => {
      if (details.reason === browser.runtime.OnInstalledReason.INSTALL) {
        browser.runtime.setUninstallURL("https://rjana.in/extra/uninstall-url-gathering/", null);
      }
    });
});




