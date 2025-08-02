/**
 * Browser abstraction layer for cross-browser compatibility
 * Handles browser-specific logic and provides unified API access
 */

/**
 * Browser detection and identification
 */
export const BrowserInfo = {
    // Browser types
    CHROME: 'chrome',
    FIREFOX: 'firefox',
    SAFARI: 'safari',
    EDGE: 'edge',
    OPERA: 'opera',
    UNKNOWN: 'unknown',

    /**
     * Detect the current browser
     * @returns {string} Browser identifier
     */
    detect() {
        // Check if we're in a browser environment
        if (typeof navigator === 'undefined') {
            return this.UNKNOWN;
        }

        const userAgent = navigator.userAgent.toLowerCase();

        // Edge detection (must come before Chrome since Edge includes 'chrome' in UA)
        if (userAgent.includes('edg/') || userAgent.includes('edge/')) {
            return this.EDGE;
        }

        // Chrome detection (must come before Safari since Chrome includes 'safari' in UA)
        if (userAgent.includes('chrome/') && !userAgent.includes('edg/')) {
            return this.CHROME;
        }

        // Firefox detection
        if (userAgent.includes('firefox/')) {
            return this.FIREFOX;
        }

        // Safari detection
        if (userAgent.includes('safari/') && !userAgent.includes('chrome/')) {
            return this.SAFARI;
        }

        // Opera detection
        if (userAgent.includes('opr/') || userAgent.includes('opera/')) {
            return this.OPERA;
        }

        return this.UNKNOWN;
    },

    /**
     * Get the current browser
     * @returns {string} Current browser identifier
     */
    getCurrent() {
        if (!this._current) {
            this._current = this.detect();
        }
        return this._current;
    },

    /**
     * Check if current browser is Chrome
     * @returns {boolean}
     */
    isChrome() {
        return this.getCurrent() === this.CHROME;
    },

    /**
     * Check if current browser is Firefox
     * @returns {boolean}
     */
    isFirefox() {
        return this.getCurrent() === this.FIREFOX;
    },

    /**
     * Check if current browser is Safari
     * @returns {boolean}
     */
    isSafari() {
        return this.getCurrent() === this.SAFARI;
    },

    /**
     * Check if current browser is Edge
     * @returns {boolean}
     */
    isEdge() {
        return this.getCurrent() === this.EDGE;
    },

    /**
     * Check if current browser is Opera
     * @returns {boolean}
     */
    isOpera() {
        return this.getCurrent() === this.OPERA;
    },

    /**
     * Check if browser supports Manifest V3
     * @returns {boolean}
     */
    supportsManifestV3() {
        const browser = this.getCurrent();
        switch (browser) {
            case this.CHROME:
                return true; // Chrome supports MV3
            case this.EDGE:
                return true; // Edge supports MV3
            case this.FIREFOX:
                return false; // Firefox still uses MV2
            case this.SAFARI:
                return false; // Safari uses its own extension format
            default:
                return false;
        }
    },

    /**
     * Get the preferred manifest version for current browser
     * @returns {number}
     */
    getManifestVersion() {
        return this.supportsManifestV3() ? 3 : 2;
    }
};

/**
 * Browser API abstraction
 */
export const BrowserAPI = {
    /**
     * Get the appropriate browser API object
     * Prioritizes the webextension-polyfill browser object, falls back to chrome
     * @returns {object} Browser API object
     */
    getAPI() {
        // Check for webextension-polyfill browser object first
        if (typeof browser !== 'undefined' && browser.runtime && browser.runtime.getManifest) {
            return browser;
        }

        // Fallback to chrome API
        if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getManifest) {
            return chrome;
        }

        throw new Error('No browser extension API available');
    },

    /**
     * Get tabs API with browser-specific handling
     * @returns {object} Tabs API object
     */
    getTabs() {
        const api = this.getAPI();
        return api.tabs;
    },

    /**
     * Get storage API with browser-specific handling
     * @returns {object} Storage API object
     */
    getStorage() {
        const api = this.getAPI();
        return api.storage;
    },

    /**
     * Get runtime API with browser-specific handling
     * @returns {object} Runtime API object
     */
    getRuntime() {
        const api = this.getAPI();
        return api.runtime;
    }
};

/**
 * Browser-specific behavior handlers
 */
export const BrowserQuirks = {
    /**
     * Handle clipboard operations with browser-specific logic
     * @param {string} text - Text to copy to clipboard
     * @returns {Promise<boolean>} Success status
     */
    async copyToClipboard(text) {
        try {
            // Modern browsers support navigator.clipboard
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(text);
                return true;
            }

            // Fallback for older browsers or restricted contexts
            return this._fallbackCopyToClipboard(text);
        } catch (error) {
            console.warn('Clipboard copy failed:', error);
            return this._fallbackCopyToClipboard(text);
        }
    },

    /**
     * Fallback clipboard copy method
     * @param {string} text - Text to copy
     * @returns {boolean} Success status
     */
    _fallbackCopyToClipboard(text) {
        try {
            // Create a temporary textarea element
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);

            textarea.select();
            const success = document.execCommand('copy');
            document.body.removeChild(textarea);

            return success;
        } catch (error) {
            console.error('Fallback clipboard copy failed:', error);
            return false;
        }
    },

    /**
     * Get browser-specific URL filtering patterns
     * @returns {RegExp} URL filtering regex
     */
    getUrlFilterPattern() {
        const browser = BrowserInfo.getCurrent();

        switch (browser) {
            case BrowserInfo.FIREFOX:
                // Firefox has different internal URL patterns
                return /^(https?|ftp|ssh):\/\//i;
            case BrowserInfo.SAFARI:
                // Safari extension URLs
                return /^(https?|ftp|ssh):\/\//i;
            case BrowserInfo.CHROME:
            case BrowserInfo.EDGE:
            default:
                // Chrome and Edge internal pages start with chrome:// or edge://
                return /^(https?|ftp|ssh):\/\//i;
        }
    },

    /**
     * Filter out browser-specific internal URLs
     * @param {Array} tabs - Array of tab objects
     * @returns {Array} Filtered tabs
     */
    filterInternalUrls(tabs) {
        const pattern = this.getUrlFilterPattern();
        const browser = BrowserInfo.getCurrent();

        return tabs.filter(tab => {
            // Basic protocol filtering
            if (!pattern.test(tab.url)) {
                return false;
            }

            // Browser-specific filtering
            switch (browser) {
                case BrowserInfo.FIREFOX:
                    // Filter out Firefox-specific URLs
                    return !tab.url.startsWith('moz-extension://') &&
                           !tab.url.startsWith('about:');

                case BrowserInfo.SAFARI:
                    // Filter out Safari-specific URLs
                    return !tab.url.startsWith('safari-extension://') &&
                           !tab.url.startsWith('safari-web-extension://');

                case BrowserInfo.CHROME:
                    // Filter out Chrome-specific URLs
                    return !tab.url.startsWith('chrome://') &&
                           !tab.url.startsWith('chrome-extension://');

                case BrowserInfo.EDGE:
                    // Filter out Edge-specific URLs
                    return !tab.url.startsWith('edge://') &&
                           !tab.url.startsWith('extension://');

                default:
                    return true;
            }
        });
    },

    /**
     * Handle browser-specific storage limitations
     * @param {object} data - Data to store
     * @returns {Promise<boolean>} Success status
     */
    async handleStorageQuotas(data) {
        const browser = BrowserInfo.getCurrent();
        const api = BrowserAPI.getStorage();

        try {
            switch (browser) {
                case BrowserInfo.FIREFOX:
                    // Firefox has different storage limits
                    const firefoxQuota = await api.local.getBytesInUse();
                    if (firefoxQuota > 5 * 1024 * 1024) { // 5MB limit
                        console.warn('Firefox storage quota approaching limit');
                    }
                    break;

                case BrowserInfo.SAFARI:
                    // Safari has more restrictive storage
                    // Use sync storage sparingly
                    break;

                default:
                    // Chrome and Edge have more generous limits
                    break;
            }

            return true;
        } catch (error) {
            console.error('Storage quota check failed:', error);
            return false;
        }
    },

    /**
     * Get browser-specific icon size preferences
     * @returns {object} Icon size configuration
     */
    getIconSizes() {
        const browser = BrowserInfo.getCurrent();

        switch (browser) {
            case BrowserInfo.FIREFOX:
                return {
                    small: 16,
                    medium: 32,
                    large: 48,
                    toolbar: 16
                };

            case BrowserInfo.SAFARI:
                return {
                    small: 16,
                    medium: 32,
                    large: 64,
                    toolbar: 16
                };

            case BrowserInfo.CHROME:
            case BrowserInfo.EDGE:
            default:
                return {
                    small: 16,
                    medium: 32,
                    large: 128,
                    toolbar: 16
                };
        }
    },

    /**
     * Handle browser-specific permission requirements
     * @param {Array} permissions - Required permissions
     * @returns {Promise<boolean>} Permission granted status
     */
    async checkPermissions(permissions) {
        const api = BrowserAPI.getAPI();
        const browser = BrowserInfo.getCurrent();

        try {
            // Some browsers handle permissions differently
            if (browser === BrowserInfo.FIREFOX) {
                // Firefox might have different permission handling
                return await api.permissions.contains({ permissions });
            }

            // Standard permission check
            return await api.permissions.contains({ permissions });
        } catch (error) {
            console.error('Permission check failed:', error);
            return false;
        }
    }
};

/**
 * Utility functions for conditional browser behavior
 */
export const BrowserUtils = {
    /**
     * Execute code conditionally based on browser
     * @param {object} handlers - Object with browser-specific handlers
     * @param {*} defaultHandler - Default handler if browser not specified
     * @returns {*} Result of the executed handler
     */
    conditional(handlers, defaultHandler = null) {
        const browser = BrowserInfo.getCurrent();

        if (handlers[browser]) {
            return handlers[browser]();
        }

        if (defaultHandler) {
            return defaultHandler();
        }

        throw new Error(`No handler defined for browser: ${browser}`);
    },

    /**
     * Get browser-specific configuration
     * @param {string} key - Configuration key
     * @returns {*} Configuration value
     */
    getConfig(key) {
        const browser = BrowserInfo.getCurrent();

        const configs = {
            [BrowserInfo.CHROME]: {
                maxStorageItems: 100000,
                maxStorageSize: 10 * 1024 * 1024, // 10MB
                supportsOffscreen: true,
                supportsDeclarativeNetRequest: true
            },
            [BrowserInfo.FIREFOX]: {
                maxStorageItems: 50000,
                maxStorageSize: 5 * 1024 * 1024, // 5MB
                supportsOffscreen: false,
                supportsDeclarativeNetRequest: false
            },
            [BrowserInfo.SAFARI]: {
                maxStorageItems: 10000,
                maxStorageSize: 1 * 1024 * 1024, // 1MB
                supportsOffscreen: false,
                supportsDeclarativeNetRequest: false
            },
            [BrowserInfo.EDGE]: {
                maxStorageItems: 100000,
                maxStorageSize: 10 * 1024 * 1024, // 10MB
                supportsOffscreen: true,
                supportsDeclarativeNetRequest: true
            }
        };

        const config = configs[browser] || configs[BrowserInfo.CHROME];
        return config[key];
    },

    /**
     * Log browser-specific debug information
     */
    logBrowserInfo() {
        const browser = BrowserInfo.getCurrent();
        const manifestVersion = BrowserInfo.getManifestVersion();
        const api = BrowserAPI.getAPI();

        console.group('Browser Information');
        console.log('Detected Browser:', browser);
        console.log('Manifest Version:', manifestVersion);
        console.log('API Available:', !!api);
        console.log('User Agent:', navigator.userAgent);
        console.groupEnd();
    }
};

// Initialize and export unified browser object
export const Browser = {
    info: BrowserInfo,
    api: BrowserAPI,
    quirks: BrowserQuirks,
    utils: BrowserUtils
};

export default Browser;
