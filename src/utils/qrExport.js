/**
 * QR Export Utility
 * Handles QR code generation and ZIP creation for URL collections
 */

import QRCode from 'qrcode-esm';

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
 * Export collection as QR codes (single SVG or ZIP)
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

    // Single URL - export as SVG
    if (urls.length === 1 || format === 'svg') {
        const url = urls[0].url || urls[0];
        const svgFilename = filename || `${collection.name.replace(/[^a-z0-9]/gi, '-')}-qr.svg`;
        return await downloadQRCodeSVG(url, svgFilename, options);
    }

    // Multiple URLs - export as ZIP
    const zipFilename = filename || `${collection.name.replace(/[^a-z0-9]/gi, '-')}-qr-codes.zip`;
    return await createQRCodeZip(urls, zipFilename, options);
}

/**
 * Generate QR code preview for UI
 * @param {string} url - URL to encode
 * @param {number} size - QR code size
 * @returns {Promise<string>} Data URL for preview
 */
export async function generateQRPreview(url, size = 128) {
    return await generateQRCodeDataURL(url, {
        width: size,
        margin: 1
    });
}
