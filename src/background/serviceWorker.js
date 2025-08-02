/**
 * Background Script For the Chrome Extension
 */

import { Browser } from '../utils/browser.js';

// Initialize browser abstraction and set up listeners
const initBackgroundScript = async () => {
  try {
    // Log browser information for debugging
    Browser.utils.logBrowserInfo();

    // Get browser API
    const api = Browser.api.getAPI();

    // Set up installation listener with browser-specific handling
    api.runtime.onInstalled.addListener(details => {
      if (details.reason === api.runtime.OnInstalledReason.INSTALL) {
        // Use conditional browser logic for uninstall URLs
        Browser.utils.conditional({
          chrome: () => {
            api.runtime.setUninstallURL("https://rjana.in/extra/uninstall-url-gathering-chrome/", null);
          },
          firefox: () => {
            api.runtime.setUninstallURL("https://rjana.in/extra/uninstall-url-gathering-firefox/", null);
          },
          edge: () => {
            api.runtime.setUninstallURL("https://rjana.in/extra/uninstall-url-gathering-edge/", null);
          },
          safari: () => {
            api.runtime.setUninstallURL("https://rjana.in/extra/uninstall-url-gathering-safari/", null);
          }
        }, () => {
          // Default fallback
          api.runtime.setUninstallURL("https://rjana.in/extra/uninstall-url-gathering/", null);
        });
      }
    });

    console.log('Background script initialized successfully');
  } catch (error) {
    console.error('Failed to initialize background script:', error);
  }
};

// Initialize the background script
initBackgroundScript();




