/**
 * QR Export Utility
 * Handles QR code generation and ZIP creation for URL collections
 */

import QRCode from 'qrcode-esm';
import { getQRExportMode } from './settingsStorage.js';

/**
 * Generate SVG QR code for a single URL
 * @param {string} url - URL to encode
 * @param {Object} options - QR code options
 * @returns {Promise<string>} SVG string
 */
export async function generateQRCodeSVG(url, options = {}) {
    const defaultOptions = {
        type: 'svg',
        width: 256,
        margin: 2,
        color: {
            dark: '#000000',
            light: '#FFFFFF'
        },
        ...options
    };

    try {
        const svgString = await QRCode.toString(url, defaultOptions);
        return svgString;
    } catch (error) {
        console.error('Failed to generate QR code:', error);
        throw new Error('QR code generation failed');
    }
}

/**
 * Generate a single QR code containing all URLs
 * @param {Array} urls - Array of URL objects
 * @param {Object} options - QR code options
 * @returns {Promise<string>} SVG string
 */
export async function generateCombinedQRCodeSVG(urls, options = {}) {
    if (!urls || urls.length === 0) {
        throw new Error('No URLs provided for QR generation');
    }

    // Extract URLs and combine them
    const urlStrings = urls.map(urlObj => urlObj.url || urlObj);

    // For single URL, just use the URL
    if (urlStrings.length === 1) {
        return await generateQRCodeSVG(urlStrings[0], options);
    }

    // For multiple URLs, combine them with newlines
    const combinedUrls = urlStrings.join('\n');

    // Check if combined content is too large for QR code
    if (combinedUrls.length > 2953) { // QR Code version 40 (max) capacity for alphanumeric
        throw new Error('Too many URLs to fit in a single QR code. Please use separate QR codes option.');
    }

    return await generateQRCodeSVG(combinedUrls, options);
}

/**
 * Download a single combined QR code as SVG
 * @param {Array} urls - Array of URL objects
 * @param {string} filename - SVG filename
 * @param {Object} options - QR code options
 * @returns {Promise<Object>} Result object
 */
export async function downloadCombinedQRCodeSVG(urls, filename = 'combined-qr.svg', options = {}) {
    try {
        const svgString = await generateCombinedQRCodeSVG(urls, options);

        // Create blob and download
        const blob = new Blob([svgString], { type: 'image/svg+xml' });
        const downloadUrl = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clean up
        setTimeout(() => URL.revokeObjectURL(downloadUrl), 100);

        return {
            success: true,
            filename,
            count: urls.length,
            type: 'combined'
        };
    } catch (error) {
        console.error('Failed to download combined QR code:', error);
        return {
            success: false,
            error: error.message,
            type: 'combined'
        };
    }
}

/**
 * Generate QR code as data URL (for preview)
 * @param {string} url - URL to encode
 * @param {Object} options - QR code options
 * @returns {Promise<string>} Data URL
 */
export async function generateQRCodeDataURL(url, options = {}) {
    const defaultOptions = {
        width: 256,
        margin: 2,
        color: {
            dark: '#000000',
            light: '#FFFFFF'
        },
        ...options
    };

    try {
        const dataURL = await QRCode.toDataURL(url, defaultOptions);
        return dataURL;
    } catch (error) {
        console.error('Failed to generate QR code data URL:', error);
        throw new Error('QR code generation failed');
    }
}

/**
 * Download single QR code as SVG file
 * @param {string} url - URL to encode
 * @param {string} filename - Optional filename
 * @param {Object} options - QR code options
 */
export async function downloadQRCodeSVG(url, filename = null, options = {}) {
    try {
        const svgString = await generateQRCodeSVG(url, options);

        // Generate filename if not provided
        if (!filename) {
            const urlObj = new URL(url);
            filename = `qr-${urlObj.hostname.replace(/[^a-z0-9]/gi, '-')}.svg`;
        }

        // Ensure .svg extension
        if (!filename.endsWith('.svg')) {
            filename += '.svg';
        }

        // Create and trigger download
        const blob = new Blob([svgString], { type: 'image/svg+xml' });
        const downloadUrl = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clean up the object URL
        setTimeout(() => URL.revokeObjectURL(downloadUrl), 100);

        return { success: true, filename };
    } catch (error) {
        console.error('Failed to download QR code:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Create ZIP file with QR codes for multiple URLs
 * @param {Array} urls - Array of URL objects
 * @param {string} zipFilename - ZIP filename
 * @param {Object} options - Options for QR generation
 * @returns {Promise<Object>} Result object
 */
export async function createQRCodeZip(urls, zipFilename = 'qr-codes.zip', options = {}) {
    try {
        // Dynamic import of JSZip for better compatibility
        const JSZip = (await import('jszip')).default;
        const zip = new JSZip();

        const results = {
            success: 0,
            failed: 0,
            errors: []
        };

        // Generate QR codes for each URL
        for (let i = 0; i < urls.length; i++) {
            const urlObj = urls[i];
            const url = urlObj.url || urlObj;

            try {
                const svgString = await generateQRCodeSVG(url, options);

                // Generate filename for this QR code
                let filename;
                try {
                    const urlObject = new URL(url);
                    const hostname = urlObject.hostname.replace(/[^a-z0-9]/gi, '-');
                    filename = `${i + 1}-${hostname}.svg`;
                } catch {
                    filename = `${i + 1}-qr-code.svg`;
                }

                // Add to ZIP
                zip.file(filename, svgString);
                results.success++;

                // Add a small delay to prevent blocking
                if (i % 5 === 0 && i > 0) {
                    await new Promise(resolve => setTimeout(resolve, 10));
                }
            } catch (error) {
                console.error(`Failed to generate QR for URL ${url}:`, error);
                results.failed++;
                results.errors.push({
                    url,
                    error: error.message
                });
            }
        }

        // Generate ZIP file
        const zipBlob = await zip.generateAsync({ type: 'blob' });

        // Trigger download
        const downloadUrl = URL.createObjectURL(zipBlob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = zipFilename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clean up
        setTimeout(() => URL.revokeObjectURL(downloadUrl), 100);

        return {
            success: true,
            filename: zipFilename,
            ...results
        };
    } catch (error) {
        console.error('Failed to create QR code ZIP:', error);
        return {
            success: false,
            error: error.message,
            failed: urls.length,
            success: 0
        };
    }
}

/**
 * Export collection as QR codes (single combined or separate ZIP)
 * @param {Object} collection - Collection object
 * @param {Object} options - Export options
 * @returns {Promise<Object>} Export result
 */
export async function exportCollectionAsQR(collection, options = {}) {
    const { format = 'auto', filename = null } = options;

    if (!collection || !collection.urls || collection.urls.length === 0) {
        return {
            success: false,
            error: 'No URLs found in collection'
        };
    }

    const urls = collection.urls;

    // Single URL - always export as individual SVG
    if (urls.length === 1) {
        const url = urls[0].url || urls[0];
        const svgFilename = filename || `${collection.name.replace(/[^a-z0-9]/gi, '-')}-qr.svg`;
        return await downloadQRCodeSVG(url, svgFilename, options);
    }

    // Multiple URLs - check user preference
    const qrExportMode = await getQRExportMode();

    if (format === 'single' || (format === 'auto' && qrExportMode === 'single')) {
        // Export as single combined QR code
        const svgFilename = filename || `${collection.name.replace(/[^a-z0-9]/gi, '-')}-combined-qr.svg`;
        return await downloadCombinedQRCodeSVG(urls, svgFilename, options);
    } else {
        // Export as ZIP with separate QR codes (legacy/fallback behavior)
        const zipFilename = filename || `${collection.name.replace(/[^a-z0-9]/gi, '-')}-qr-codes.zip`;
        return await createQRCodeZip(urls, zipFilename, options);
    }
}

/**
 * Generate QR code preview for UI (supports single URL or combined URLs)
 * @param {string|Array} urlOrUrls - Single URL string or array of URL objects
 * @param {number} size - QR code size
 * @returns {Promise<string>} Data URL for preview
 */
export async function generateQRPreview(urlOrUrls, size = 128) {
    const options = {
        width: size,
        margin: 1
    };

    // Handle single URL string
    if (typeof urlOrUrls === 'string') {
        return await generateQRCodeDataURL(urlOrUrls, options);
    }

    // Handle array of URLs (combine them)
    if (Array.isArray(urlOrUrls) && urlOrUrls.length > 0) {
        if (urlOrUrls.length === 1) {
            const url = urlOrUrls[0].url || urlOrUrls[0];
            return await generateQRCodeDataURL(url, options);
        }

        // For multiple URLs, create combined QR
        const urlStrings = urlOrUrls.map(urlObj => urlObj.url || urlObj);
        const combinedUrls = urlStrings.join('\n');

        // Check size limit for preview
        if (combinedUrls.length > 2953) {
            throw new Error('Too many URLs for QR preview');
        }

        return await generateQRCodeDataURL(combinedUrls, options);
    }

    throw new Error('Invalid input for QR preview');
}
