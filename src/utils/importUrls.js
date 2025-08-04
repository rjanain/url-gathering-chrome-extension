/**
 * Import and Tab Management Utility
 * Handles importing URLs from text/CSV and creating tabs across all browsers
 */

import { Browser } from './browser.js';

const api = Browser.api.getAPI();

/**
 * Parse URLs from text input (newline or CSV separated)
 * @param {string} text - Raw text input
 * @returns {Array} Array of unique, valid URLs
 */
export function parseUrlsFromText(text) {
    if (!text || typeof text !== 'string') {
        return [];
    }

    // Split by newlines, commas, or semicolons
    const lines = text.split(/[\n,;]/)
        .map(line => line.trim())
        .filter(line => line.length > 0);

    const urls = [];
    const seenUrls = new Set();

    for (const line of lines) {
        // Try to extract URLs from the line
        const extractedUrls = extractUrlsFromLine(line);

        for (const url of extractedUrls) {
            const normalizedUrl = normalizeUrl(url);
            if (normalizedUrl && !seenUrls.has(normalizedUrl)) {
                seenUrls.add(normalizedUrl);
                urls.push({
                    url: normalizedUrl,
                    originalText: line,
                    title: extractTitleFromLine(line, normalizedUrl)
                });
            }
        }
    }

    return urls;
}

/**
 * Extract URLs from a single line of text
 * @param {string} line - Line of text
 * @returns {Array} Array of URLs found in the line
 */
function extractUrlsFromLine(line) {
    // URL regex pattern that captures http/https URLs
    const urlRegex = /https?:\/\/[^\s,;"'\[\]{}()]+/gi;
    const matches = line.match(urlRegex) || [];

    // If no URLs found with protocol, check if the line looks like a domain
    if (matches.length === 0) {
        const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        const trimmedLine = line.trim();

        if (domainRegex.test(trimmedLine) && trimmedLine.includes('.')) {
            return ['https://' + trimmedLine];
        }
    }

    return matches;
}

/**
 * Try to extract title from line (for CSV format like "Title,URL")
 * @param {string} line - Original line
 * @param {string} url - Extracted URL
 * @returns {string} Extracted title or URL
 */
function extractTitleFromLine(line, url) {
    // If line contains comma, try to extract title
    if (line.includes(',')) {
        const parts = line.split(',').map(p => p.trim());
        for (const part of parts) {
            if (part !== url && !part.includes('http')) {
                return part;
            }
        }
    }

    // If line contains quotes, extract content
    const quotedMatch = line.match(/["']([^"']+)["']/);
    if (quotedMatch && quotedMatch[1] !== url) {
        return quotedMatch[1];
    }

    return url;
}

/**
 * Normalize URL (add protocol if missing, clean up)
 * @param {string} url - Raw URL
 * @returns {string|null} Normalized URL or null if invalid
 */
function normalizeUrl(url) {
    if (!url) return null;

    try {
        // Remove common prefixes/suffixes that might interfere
        url = url.replace(/^["'\s]+|["'\s]+$/g, '');

        // If URL doesn't have protocol, add https://
        if (!url.match(/^https?:\/\//i)) {
            url = 'https://' + url;
        }

        // Validate URL
        const urlObj = new URL(url);

        // Basic validation - must have valid hostname
        if (!urlObj.hostname || urlObj.hostname.length < 3) {
            return null;
        }

        return urlObj.href;
    } catch (error) {
        console.log('Invalid URL:', url);
        return null;
    }
}

/**
 * Create tabs from URL list with deduplication
 * @param {Array} urls - Array of URL objects
 * @param {Object} options - Options for tab creation
 * @returns {Promise<Object>} Result with success/failure counts
 */
export async function createTabsFromUrls(urls, options = {}) {
    const {
        deduplicate = true,
        maxTabs = 20,
        openInBackground = true,
        windowId = null
    } = options;

    if (!urls || urls.length === 0) {
        return { success: 0, failed: 0, skipped: 0, errors: [] };
    }

    let urlsToOpen = urls;
    const results = {
        success: 0,
        failed: 0,
        skipped: 0,
        errors: []
    };

    // Deduplicate against existing tabs if requested
    if (deduplicate) {
        try {
            const existingTabs = await api.tabs.query({});
            const existingUrls = new Set(existingTabs.map(tab => tab.url));

            urlsToOpen = urls.filter(urlObj => {
                if (existingUrls.has(urlObj.url)) {
                    results.skipped++;
                    return false;
                }
                return true;
            });
        } catch (error) {
            console.error('Failed to get existing tabs for deduplication:', error);
        }
    }

    // Limit number of tabs to prevent browser overload
    if (urlsToOpen.length > maxTabs) {
        console.warn(`Limiting tabs to ${maxTabs} out of ${urlsToOpen.length} URLs`);
        urlsToOpen = urlsToOpen.slice(0, maxTabs);
    }

    // Create tabs
    for (const urlObj of urlsToOpen) {
        try {
            const tabCreateOptions = {
                url: urlObj.url,
                active: !openInBackground
            };

            // Add windowId if specified (Chrome/Edge feature)
            if (windowId && (Browser.BrowserInfo.detect() === Browser.BrowserInfo.CHROME ||
                           Browser.BrowserInfo.detect() === Browser.BrowserInfo.EDGE)) {
                tabCreateOptions.windowId = windowId;
            }

            await api.tabs.create(tabCreateOptions);
            results.success++;

            // Small delay to prevent overwhelming the browser
            if (urlsToOpen.length > 5) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        } catch (error) {
            console.error('Failed to create tab for URL:', urlObj.url, error);
            results.failed++;
            results.errors.push({
                url: urlObj.url,
                error: error.message
            });
        }
    }

    return results;
}

/**
 * Import URLs and create tabs in one operation
 * @param {string} text - Raw text input
 * @param {Object} options - Options for import and tab creation
 * @returns {Promise<Object>} Import results
 */
export async function importAndCreateTabs(text, options = {}) {
    const urls = parseUrlsFromText(text);

    if (urls.length === 0) {
        return {
            parsed: 0,
            success: 0,
            failed: 0,
            skipped: 0,
            errors: ['No valid URLs found in the input text']
        };
    }

    const results = await createTabsFromUrls(urls, options);

    return {
        parsed: urls.length,
        ...results
    };
}

/**
 * Validate import text and provide preview
 * @param {string} text - Raw text input
 * @returns {Object} Validation results with preview
 */
export function validateImportText(text) {
    const urls = parseUrlsFromText(text);

    return {
        isValid: urls.length > 0,
        urlCount: urls.length,
        urls: urls.slice(0, 10), // Preview first 10
        hasMore: urls.length > 10,
        errors: urls.length === 0 ? ['No valid URLs found'] : []
    };
}
