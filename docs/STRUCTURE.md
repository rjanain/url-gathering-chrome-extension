# Project Structure

This extension follows a modular, cross-browser compatible structure for better maintainability and scalability:

```
URL-Gathering-Tool/
├── docs/                          # 📚 Documentation
│   ├── README.md                 # Documentation index
│   ├── VERSION-MANAGEMENT.md     # Version management guide
│   ├── CROSS-BROWSER-MANIFEST.md # Cross-browser compatibility
│   └── RELEASE-CHECKLIST.md      # Release process checklist
├── scripts/                      # 🔧 Build and utility scripts
│   ├── README.md                 # Scripts documentation
│   ├── build-manifest.sh         # Browser-specific manifest builder
│   ├── version-bump.sh           # Automated version management
│   └── check-version.sh          # Version consistency checker
├── src/                          # 💻 Source code
│   ├── background/               # Background scripts (service workers)
│   │   └── serviceWorker.js
│   ├── popup/                    # Popup-related files
│   │   ├── index.js              # Popup entry point
│   │   └── App.js                # Main popup React component
│   ├── content/                  # Content scripts
│   │   └── contentScript.js
│   ├── shared/                   # Shared components and utilities
│   │   ├── components/           # React components used across the app
│   │   │   ├── Home.js
│   │   │   ├── home/
│   │   │   ├── options/
│   │   │   └── index.js          # Component exports
│   │   └── index.js              # Shared exports
│   ├── utils/                    # Utility functions
│   │   ├── chromeAPI.js          # Chrome extension API utilities
│   │   ├── copyAPI.js            # Copy functionality
│   │   ├── handlerStorage.js     # Storage utilities
│   │   └── index.js              # Utility exports
│   └── assets/                   # Static assets (if needed in src)
├── public/                       # 🌐 Static public files
│   ├── assets/                   # Static assets (images, fonts, CSS, etc.)
│   │   ├── css/
│   │   ├── font/
│   │   ├── img/
│   │   └── js/
│   ├── manifest.json             # Chrome/Edge Manifest V3
│   ├── manifest-firefox.json     # Firefox Manifest V2
│   ├── manifest-safari.json      # Safari Manifest V2
│   └── popup.html                # Popup HTML template
├── dist/                         # 📦 Distribution files (generated)
│   ├── chrome/                   # Chrome/Edge build
│   ├── firefox/                  # Firefox build
│   └── safari/                   # Safari build
├── output/                       # 📁 Release packages
├── screenshots/                  # 📸 Store screenshots
├── version.json                  # 🏷️ Master version file
├── CHANGELOG.md                  # 📝 Version history
├── package.json                  # 📦 npm configuration
└── webpack configs               # ⚙️ Build configuration
```

## Benefits of this structure:

1. **Cross-Browser Support**: Multiple manifest files for different browsers
2. **Documentation-First**: Comprehensive docs in dedicated folder
3. **Automated Workflows**: Scripts for building and version management
4. **Separation of Concerns**: Each folder has a specific purpose
5. **Scalability**: Easy to add new features without cluttering
6. **Maintainability**: Clear organization makes finding and updating code easier
7. **Reusability**: Shared components and utilities can be easily imported
8. **Professional Setup**: Proper versioning, changelogs, and release processes

## Key Files and Their Purpose:

### Configuration Files
- `manifest.json` - Chrome/Edge Manifest V3 (primary)
- `manifest-firefox.json` - Firefox-specific Manifest V2
- `manifest-safari.json` - Safari-specific Manifest V2
- `version.json` - Master version file with metadata
- `package.json` - npm configuration with build scripts

### Documentation
- `docs/README.md` - Documentation index and overview
- `docs/VERSION-MANAGEMENT.md` - Complete versioning guide
- `docs/CROSS-BROWSER-MANIFEST.md` - Browser compatibility details
- `docs/RELEASE-CHECKLIST.md` - Step-by-step release process

### Build Scripts
- `scripts/build-manifest.sh` - Creates browser-specific builds
- `scripts/version-bump.sh` - Automated semantic versioning
- `scripts/check-version.sh` - Version consistency validation

## Import Conventions:

- Use index.js files for cleaner imports
- Relative imports for local dependencies
- Shared components accessible from `../shared/components`
- Utilities accessible from `../utils`
