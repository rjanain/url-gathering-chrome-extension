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

    // Set up message listener for opening side panel from popup
    api.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action === 'openSidePanelDirect') {
        // For browsers that support side panel
        Browser.utils.conditional({
          chrome: async () => {
            if (api.sidePanel && api.sidePanel.open) {
              try {
                // Get the tab that sent the message (popup tab)
                const tabs = await api.tabs.query({ active: true, currentWindow: true });
                if (tabs[0]) {
                  // Use the window ID from the active tab
                  await api.sidePanel.open({ windowId: tabs[0].windowId });
                  sendResponse({ success: true });
                } else {
                  sendResponse({ success: false, error: 'No active tab found' });
                }
              } catch (error) {
                console.log('Side panel open failed:', error);
                sendResponse({ success: false, error: error.message });
              }
            } else {
              sendResponse({ success: false, error: 'Side panel not supported' });
            }
          },
          edge: async () => {
            if (api.sidePanel && api.sidePanel.open) {
              try {
                const tabs = await api.tabs.query({ active: true, currentWindow: true });
                if (tabs[0]) {
                  await api.sidePanel.open({ windowId: tabs[0].windowId });
                  sendResponse({ success: true });
                } else {
                  sendResponse({ success: false, error: 'No active tab found' });
                }
              } catch (error) {
                console.log('Side panel open failed:', error);
                sendResponse({ success: false, error: error.message });
              }
            } else {
              sendResponse({ success: false, error: 'Side panel not supported' });
            }
          }
        }, () => {
          // For browsers without side panel support
          sendResponse({ success: false, error: 'Side panel not supported in this browser' });
        });

        // Return true to indicate we'll respond asynchronously
        return true;
      }

      // Handle legacy openSidePanel message for backwards compatibility
      if (message.action === 'openSidePanel') {
        // Redirect to the direct method
        return api.runtime.onMessage.dispatch({ action: 'openSidePanelDirect' }, sender, sendResponse);
      }
    });

    console.log('Background script initialized successfully');
  } catch (error) {
    console.error('Failed to initialize background script:', error);
  }
};

// Initialize the background script
initBackgroundScript();




