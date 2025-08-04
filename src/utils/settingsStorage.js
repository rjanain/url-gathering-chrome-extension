/**
 * Settings Storage Utility
 * Handles user preferences and settings persistence
 */

import browser from 'webextension-polyfill';

const DEFAULT_SETTINGS = {
    format: 'plaintext',
    includeName: false,
    qrExportMode: 'single' // 'single' for combined QR, 'separate' for ZIP with individual QRs
};

/**
 * Get all settings from storage
 * @returns {Promise<Object>} Settings object
 */
export async function getAllSettings() {
    try {
        const result = await browser.storage.sync.get(DEFAULT_SETTINGS);
        return { ...DEFAULT_SETTINGS, ...result };
    } catch (error) {
        console.error('Failed to load settings:', error);
        return DEFAULT_SETTINGS;
    }
}

/**
 * Get a specific setting value
 * @param {string} key - Setting key
 * @param {*} defaultValue - Default value if not found
 * @returns {Promise<*>} Setting value
 */
export async function getSetting(key, defaultValue = null) {
    try {
        const result = await browser.storage.sync.get({ [key]: defaultValue });
        return result[key];
    } catch (error) {
        console.error(`Failed to load setting ${key}:`, error);
        return defaultValue;
    }
}

/**
 * Save a setting to storage
 * @param {string} key - Setting key
 * @param {*} value - Setting value
 * @returns {Promise<boolean>} Success status
 */
export async function saveSetting(key, value) {
    try {
        await browser.storage.sync.set({ [key]: value });
        return true;
    } catch (error) {
        console.error(`Failed to save setting ${key}:`, error);
        return false;
    }
}

/**
 * Save multiple settings to storage
 * @param {Object} settings - Settings object
 * @returns {Promise<boolean>} Success status
 */
export async function saveSettings(settings) {
    try {
        await browser.storage.sync.set(settings);
        return true;
    } catch (error) {
        console.error('Failed to save settings:', error);
        return false;
    }
}

/**
 * Reset settings to defaults
 * @returns {Promise<boolean>} Success status
 */
export async function resetSettings() {
    try {
        await browser.storage.sync.clear();
        await browser.storage.sync.set(DEFAULT_SETTINGS);
        return true;
    } catch (error) {
        console.error('Failed to reset settings:', error);
        return false;
    }
}

/**
 * Get QR export mode preference
 * @returns {Promise<string>} 'single' or 'separate'
 */
export async function getQRExportMode() {
    return await getSetting('qrExportMode', 'single');
}

/**
 * Set QR export mode preference
 * @param {string} mode - 'single' or 'separate'
 * @returns {Promise<boolean>} Success status
 */
export async function setQRExportMode(mode) {
    if (!['single', 'separate'].includes(mode)) {
        throw new Error('Invalid QR export mode. Must be "single" or "separate".');
    }
    return await saveSetting('qrExportMode', mode);
}
