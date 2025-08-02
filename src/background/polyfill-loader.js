/**
 * Polyfill loader for service worker
 */

// Load webextension-polyfill for cross-browser compatibility
importScripts('assets/js/browser-polyfill.min.js');

// Export browser for use in other modules
if (typeof globalThis !== 'undefined') {
    globalThis.browser = browser;
}
