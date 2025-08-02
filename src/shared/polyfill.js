/**
 * WebExtension polyfill for cross-browser compatibility
 * This provides the browser.* API across Chrome, Firefox, Edge, and Safari
 */
import browser from 'webextension-polyfill';

// Make browser API globally available
if (typeof globalThis !== 'undefined') {
    globalThis.browser = browser;
} else if (typeof window !== 'undefined') {
    window.browser = browser;
} else if (typeof self !== 'undefined') {
    self.browser = browser;
}

export default browser;
