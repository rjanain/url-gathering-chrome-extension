#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Extension Zipper Script
 * Creates distribution-ready zip files for each browser from the dist folder
 * Usage: node scripts/zip-extension.js [browser|all]
 */

const DIST_DIR = path.resolve(__dirname, '../dist');
const BUILD_DIR = path.resolve(__dirname, '../build');
const SUPPORTED_BROWSERS = ['chrome', 'firefox', 'safari'];

// Get version from package.json
const packageJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../package.json'), 'utf8'));
const version = packageJson.version;

/**
 * Ensure the build directory exists
 */
function ensureBuildDir() {
    if (!fs.existsSync(BUILD_DIR)) {
        fs.mkdirSync(BUILD_DIR, { recursive: true });
        console.log('✓ Created build directory');
    }
}

/**
 * Check if a browser build directory exists
 * @param {string} browser - Browser name
 * @returns {boolean}
 */
function browserBuildExists(browser) {
    const browserDir = path.join(DIST_DIR, browser);
    return fs.existsSync(browserDir) && fs.statSync(browserDir).isDirectory();
}

/**
 * Create zip file for a specific browser
 * @param {string} browser - Browser name (chrome, firefox, safari)
 */
function zipBrowser(browser) {
    if (!browserBuildExists(browser)) {
        console.error(`❌ Browser build not found: ${browser}`);
        console.log(`   Run 'npm run build:${browser}' or 'npm run build:all' first`);
        return false;
    }

    const browserDir = path.join(DIST_DIR, browser);
    const zipName = `${browser}-v${version}.zip`;
    const zipPath = path.join(BUILD_DIR, zipName);

    // Remove existing zip if it exists
    if (fs.existsSync(zipPath)) {
        fs.unlinkSync(zipPath);
        console.log(`✓ Removed existing ${zipName}`);
    }

    try {
        // Create zip using system zip command (cross-platform)
        process.chdir(browserDir);
        execSync(`zip -r "${zipPath}" .`, { stdio: 'pipe' });

        // Get file size for display
        const stats = fs.statSync(zipPath);
        const fileSizeInKB = Math.round(stats.size / 1024);

        console.log(`✓ Created ${zipName} (${fileSizeInKB} KB)`);
        return true;
    } catch (error) {
        console.error(`❌ Failed to create zip for ${browser}:`, error.message);
        return false;
    }
}

/**
 * Create zips for all browsers
 */
function zipAllBrowsers() {
    let successCount = 0;

    console.log(`Creating extension zips for version ${version}...\n`);

    for (const browser of SUPPORTED_BROWSERS) {
        if (zipBrowser(browser)) {
            successCount++;
        }
    }

    console.log(`\n📦 Created ${successCount}/${SUPPORTED_BROWSERS.length} browser zips`);

    if (successCount > 0) {
        console.log(`\n📁 Extension zips available in: ${BUILD_DIR}`);

        // List created files
        const zipFiles = fs.readdirSync(BUILD_DIR)
            .filter(file => file.endsWith('.zip'))
            .sort();

        if (zipFiles.length > 0) {
            console.log('\nCreated files:');
            zipFiles.forEach(file => {
                const filePath = path.join(BUILD_DIR, file);
                const stats = fs.statSync(filePath);
                const fileSizeInKB = Math.round(stats.size / 1024);
                console.log(`  • ${file} (${fileSizeInKB} KB)`);
            });
        }
    }

    return successCount === SUPPORTED_BROWSERS.length;
}

/**
 * Display usage information
 */
function showUsage() {
    console.log('Extension Zipper - Create distribution zips for browser stores');
    console.log('\nUsage:');
    console.log('  node scripts/zip-extension.js [browser|all]');
    console.log('\nBrowsers:');
    console.log('  chrome   - Create Chrome/Edge extension zip');
    console.log('  firefox  - Create Firefox extension zip');
    console.log('  safari   - Create Safari extension zip');
    console.log('  all      - Create zips for all browsers (default)');
    console.log('\nExamples:');
    console.log('  node scripts/zip-extension.js');
    console.log('  node scripts/zip-extension.js chrome');
    console.log('  node scripts/zip-extension.js all');
}

/**
 * Main execution
 */
function main() {
    const args = process.argv.slice(2);
    const target = args[0] || 'all';

    if (target === '--help' || target === '-h') {
        showUsage();
        return;
    }

    // Ensure we're in the right directory
    process.chdir(path.resolve(__dirname, '..'));

    // Ensure build directory exists
    ensureBuildDir();

    if (target === 'all') {
        const success = zipAllBrowsers();
        process.exit(success ? 0 : 1);
    } else if (SUPPORTED_BROWSERS.includes(target)) {
        console.log(`Creating extension zip for ${target} (version ${version})...\n`);
        const success = zipBrowser(target);

        if (success) {
            console.log(`\n📁 Extension zip available in: ${BUILD_DIR}`);
        }

        process.exit(success ? 0 : 1);
    } else {
        console.error(`❌ Unknown browser: ${target}`);
        console.log(`Available options: ${SUPPORTED_BROWSERS.join(', ')}, all`);
        console.log('\nUse --help for more information');
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = {
    zipBrowser,
    zipAllBrowsers,
    ensureBuildDir
};
