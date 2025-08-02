/* Content Script */

import { Browser } from '../utils/browser.js';

// Initialize content script with browser detection
const initContentScript = () => {
  try {
    // Log browser information for debugging (only in development)
    if (process.env.NODE_ENV === 'development') {
      Browser.utils.logBrowserInfo();
    }

    // Example: Browser-specific content script behavior
    const currentBrowser = Browser.info.getCurrent();

    // Add browser-specific CSS class to body for styling
    document.body.classList.add(`browser-${currentBrowser}`);

    // Browser-specific event handling
    Browser.utils.conditional({
      chrome: () => {
        console.log('Chrome-specific content script logic');
      },
      firefox: () => {
        console.log('Firefox-specific content script logic');
      },
      safari: () => {
        console.log('Safari-specific content script logic');
      }
    }, () => {
      console.log('Default content script logic');
    });

  } catch (error) {
    console.error('Content script initialization failed:', error);
  }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initContentScript);
} else {
  initContentScript();
}
