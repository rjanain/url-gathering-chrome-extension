# Cross-Browser Testing Checklist

Quick reference for testing the URL Gathering Tool extension across all browsers.

## 🚀 Quick Start Commands

```bash
# Test all browsers
npm run test

# Test specific browsers
npm run test:chrome
npm run test:firefox
npm run test:safari
npm run test:edge
```

## ✅ Pre-Testing Checklist

- [ ] Dependencies installed (`npm install`)
- [ ] Extension builds successfully (`npm run build:all`)
- [ ] All target browsers installed
- [ ] Developer mode enabled in browsers

## 🔧 Chrome Testing

### Setup
```bash
npm run test:chrome
```

### Manual Steps
1. Open `chrome://extensions/`
2. Enable Developer mode
3. Load unpacked from `dist/` directory

### Verify
- [ ] Extension icon in toolbar
- [ ] Popup opens correctly
- [ ] All tabs listed
- [ ] Copy functions work
- [ ] No console errors
- [ ] Settings persist

## 🦊 Firefox Testing

### Setup
```bash
npm run test:firefox
```

### Manual Steps
1. Open `about:debugging`
2. Click "This Firefox"
3. Load temporary add-on from `dist/manifest.json`

### Verify
- [ ] Loads without manifest errors
- [ ] webextension-polyfill works
- [ ] Background scripts execute
- [ ] All features match Chrome
- [ ] No Firefox-specific errors

## 🧭 Safari Testing (macOS only)

### Setup
```bash
npm run test:safari
```

### Manual Steps
1. Script converts extension automatically
2. Open Xcode project
3. Configure signing
4. Build and run
5. Enable in Safari preferences

### Verify
- [ ] Conversion successful
- [ ] Builds in Xcode
- [ ] Extension appears in Safari
- [ ] Native integration works
- [ ] Permissions granted properly

## 🌐 Edge Testing

### Setup
```bash
npm run test:edge
```

### Manual Steps
1. Open `edge://extensions/`
2. Enable Developer mode
3. Load unpacked from `dist/` directory

### Verify
- [ ] Loads like Chrome
- [ ] Manifest V3 compatibility
- [ ] Works with tracking prevention
- [ ] InPrivate mode support
- [ ] All features functional

## 🔍 Testing Matrix

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Extension loads | ✅ | ✅ | ✅ | ✅ |
| Popup displays | ✅ | ✅ | ✅ | ✅ |
| URL gathering | ✅ | ✅ | ✅ | ✅ |
| Copy all formats | ✅ | ✅ | ✅ | ✅ |
| Settings persist | ✅ | ✅ | ✅ | ✅ |
| Permissions work | ✅ | ✅ | ✅ | ✅ |
| No console errors | ✅ | ✅ | ✅ | ✅ |

## 🐛 Common Issues

### Chrome/Edge
- Service worker not loading → Check background script
- Permission denied → Verify host_permissions

### Firefox
- Polyfill errors → Check webextension-polyfill loading
- Manifest V2 issues → Verify background.scripts format

### Safari
- Conversion fails → Check manifest compatibility
- Signing issues → Configure Xcode properly

## 🎯 Success Criteria

All browsers must:
- [ ] Load extension without errors
- [ ] Display popup correctly
- [ ] Gather URLs from all tabs
- [ ] Copy in all formats (Markdown, CSV, HTML, JSON, plain)
- [ ] Persist settings between sessions
- [ ] Handle permissions appropriately
- [ ] Work in private/incognito mode
- [ ] Show no console errors

## 📦 After Testing

```bash
# Create distribution packages
npm run package

# Individual packages
npm run package:chrome
npm run package:firefox
npm run package:safari
```

## 🔗 Related Documents

- [Browser Testing Guide](./BROWSER-TESTING.md) - Detailed instructions
- [Release Checklist](../RELEASE-CHECKLIST.md) - Pre-release steps
- [Cross-Browser Manifest](./CROSS-BROWSER-MANIFEST.md) - Manifest differences
