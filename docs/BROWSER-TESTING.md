# Cross-Browser Testing Guide

This guide provides step-by-step instructions for testing the URL Gathering Tool extension across Chrome, Firefox, Safari, and Edge browsers.

## Prerequisites

- Extension built using `npm run build:all`
- Latest versions of target browsers installed
- Xcode installed (for Safari testing on macOS)

---

## 🔧 1. Test Extension on Chrome

### Quick Start
```bash
npm run build:chrome
```

### Manual Testing Steps

1. **Load Extension**
   - Open Chrome
   - Navigate to `chrome://extensions/`
   - Enable "Developer mode" (top-right toggle)
   - Click "Load unpacked"
   - Select the `dist/` directory

2. **Verify Core Functionality**
   - [ ] Extension icon appears in toolbar
   - [ ] Popup opens when clicking icon
   - [ ] All tabs are listed correctly
   - [ ] URL copying works (all formats: Markdown, CSV, HTML, JSON, plain text)
   - [ ] Storage settings persist between sessions

3. **Check Developer Tools**
   - [ ] No errors in Background page console (`chrome://extensions/` → "service worker")
   - [ ] No errors in Content script console (F12 on any webpage)
   - [ ] No errors in Popup console (F12 while popup is open)

4. **Test Permissions**
   - [ ] Extension requests minimal required permissions
   - [ ] Tabs API works across different domains
   - [ ] Storage API saves/loads settings correctly

---

## 🦊 2. Test Extension on Firefox

### Quick Start
```bash
npm run build:firefox
```

### Manual Testing Steps

1. **Load Extension**
   - Open Firefox
   - Navigate to `about:debugging`
   - Click "This Firefox"
   - Click "Load Temporary Add-on"
   - Select `manifest.json` from `dist/` directory

2. **Verify Polyfill Compatibility**
   - [ ] Extension loads without manifest errors
   - [ ] All `browser.*` APIs work correctly via webextension-polyfill
   - [ ] Background scripts execute properly (Manifest V2 compatibility)

3. **Test Core Features**
   - [ ] Extension icon appears in toolbar
   - [ ] Popup functionality matches Chrome behavior
   - [ ] URL gathering works across all open tabs
   - [ ] Copy operations work in all formats

4. **Firefox-Specific Checks**
   - [ ] No unsupported manifest fields flagged
   - [ ] Extension works in private browsing (if enabled)
   - [ ] Permissions properly requested and granted

---

## 🧭 3. Convert and Test Extension on Safari

### Prerequisites
- macOS with Xcode installed
- Safari 14+ with extension support

### Conversion Process
```bash
# Build Safari-compatible version
npm run build:safari

# Convert to Safari extension
xcrun safari-web-extension-converter dist/ --project-location ./safari-build/
```

### Manual Testing Steps

1. **Open in Xcode**
   - Navigate to `./safari-build/`
   - Open `.xcodeproj` file in Xcode

2. **Configure Signing**
   - Select project in navigator
   - Choose appropriate Team/Signing Certificate
   - Ensure proper Bundle Identifier is set

3. **Build and Install**
   - Build project (⌘+B)
   - Run on device/simulator (⌘+R)
   - Enable extension in Safari → Preferences → Extensions

4. **Test Functionality**
   - [ ] Extension appears in Safari toolbar
   - [ ] Popup opens and displays correctly
   - [ ] Permission prompts work properly
   - [ ] URL gathering works across Safari tabs
   - [ ] All copy formats function correctly

5. **Safari-Specific Validation**
   - [ ] Native Safari UI integration
   - [ ] Proper permission handling
   - [ ] Extension works with Safari's content blocking

---

## 🌐 4. Test Extension on Edge

### Quick Start
```bash
# Use Chrome build (Edge is Chromium-based)
npm run build:chrome
```

### Manual Testing Steps

1. **Load Extension**
   - Open Microsoft Edge
   - Navigate to `edge://extensions/`
   - Enable "Developer mode" (left sidebar)
   - Click "Load unpacked"
   - Select the `dist/` directory

2. **Verify Chromium Compatibility**
   - [ ] Extension loads without issues
   - [ ] Manifest V3 features work identically to Chrome
   - [ ] Service worker functions properly

3. **Test Core Features**
   - [ ] Extension icon appears in toolbar
   - [ ] Popup displays and functions correctly
   - [ ] URL gathering works across Edge tabs
   - [ ] All copy formats work as expected

4. **Edge-Specific Tests**
   - [ ] Works with Edge's enhanced security features
   - [ ] Compatible with Edge's tracking prevention
   - [ ] Functions properly with Edge Collections (if applicable)

---

## 🔍 Automated Testing Commands

### Build All Browser Versions
```bash
npm run build:all    # Builds for all browsers
npm run package      # Builds and creates ZIP files
```

### Individual Browser Builds
```bash
npm run build:chrome   # Chrome/Edge compatible
npm run build:firefox  # Firefox compatible
npm run build:safari   # Safari compatible
```

### Verification Script
```bash
npm run verify         # Runs basic extension validation
```

---

## 🐛 Common Issues & Solutions

### Chrome/Edge Issues
- **Service Worker not loading**: Check background script syntax
- **Manifest errors**: Validate JSON syntax and required fields
- **Permission denied**: Ensure proper host_permissions

### Firefox Issues
- **Polyfill errors**: Verify webextension-polyfill is properly loaded
- **Manifest V2 compatibility**: Check background.scripts vs service_worker
- **API differences**: Some Chrome APIs may not exist in Firefox

### Safari Issues
- **Conversion failures**: Ensure manifest is Safari-compatible
- **Signing issues**: Verify Xcode project configuration
- **Permission prompts**: Safari handles permissions differently

### General Debugging
- Check browser developer tools console
- Verify extension permissions are granted
- Test in incognito/private mode
- Clear extension storage if needed

---

## 📋 Testing Checklist

### ✅ Core Functionality (All Browsers)
- [ ] Extension loads successfully
- [ ] Icon appears in browser toolbar
- [ ] Popup opens and displays correctly
- [ ] Tabs are listed accurately
- [ ] URL copying works in all formats
- [ ] Settings persist between sessions
- [ ] No console errors

### ✅ Browser-Specific Features
- [ ] Chrome: Manifest V3 compliance
- [ ] Firefox: Webextension-polyfill compatibility
- [ ] Safari: Native integration and permissions
- [ ] Edge: Chromium feature parity

### ✅ Performance & Compatibility
- [ ] Fast loading times
- [ ] Minimal memory usage
- [ ] Works with browser updates
- [ ] Compatible with other extensions

---

## 📦 Distribution Preparation

After successful testing across all browsers:

1. **Create Release Builds**
   ```bash
   npm run package  # Creates ZIP files for all browsers
   ```

2. **Prepare Store Submissions**
   - Chrome Web Store: Use `build/chrome-v*.zip`
   - Firefox Add-ons: Use `build/firefox-v*.zip`
   - Safari App Store: Submit via Xcode
   - Edge Add-ons: Use Chrome build

3. **Validate Packages**
   - Test each ZIP file before submission
   - Verify version numbers match
   - Check all required assets are included
