/**
 * Background Script For the Chrome Extension
 * 
 */


// Gather feedback on uninstall 
chrome.runtime.onInstalled.addListener(details => {
    if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
      chrome.runtime.setUninstallURL("https://rjana.in/extra/uninstall-url-gathering/", null);
    }
  });

 


 