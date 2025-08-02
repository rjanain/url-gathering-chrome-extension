# URL Gathering Tool - Documentation

Welcome to the URL Gathering Tool documentation. This directory contains all the technical documentation, guides, and references for the extension.

## 📚 Documentation Index

### Core Documentation
- **[VERSION-MANAGEMENT.md](VERSION-MANAGEMENT.md)** - Complete guide to version management and release processes
- **[CROSS-BROWSER-MANIFEST.md](CROSS-BROWSER-MANIFEST.md)** - Cross-browser compatibility and manifest configuration
- **[RELEASE-CHECKLIST.md](RELEASE-CHECKLIST.md)** - Step-by-step release checklist

### Development & Setup
- **[STRUCTURE.md](STRUCTURE.md)** - Project structure and organization
- **[SETUP-GIT.md](SETUP-GIT.md)** - Cross-platform Git setup instructions
- **[DOCUMENTATION-STRUCTURE.md](DOCUMENTATION-STRUCTURE.md)** - Documentation organization best practices

### Project Files (Root Directory)
- **[README.md](../readme.md)** - Project overview and getting started (main project README)
- **[CHANGELOG.md](../CHANGELOG.md)** - Version history and changes
- **[TODO.md](../TODO.md)** - Project roadmap and planned features

## 📂 README Files Explained

This project follows standard documentation practices with two README files:

1. **Root README (`../readme.md`)**:
   - Project overview and description
   - Quick start guide for users
   - Installation and basic usage
   - Links to detailed documentation

2. **Documentation README (`docs/README.md`, this file)**:
   - Documentation index and navigation
   - Detailed technical guides
   - Developer-focused information
   - Complete reference materials

This separation follows industry best practices where:
- **Root README** = User-facing project introduction
- **Docs README** = Developer/maintainer documentation hub

## 🚀 Quick Start

### For Developers
1. **Setup**: See [main README](../readme.md) for installation
2. **Development**: Use `npm run dev` for live development
3. **Version Management**: Read [VERSION-MANAGEMENT.md](VERSION-MANAGEMENT.md)
4. **Cross-Browser**: Check [CROSS-BROWSER-MANIFEST.md](CROSS-BROWSER-MANIFEST.md)

### For Releases
1. **Pre-Release**: Follow [RELEASE-CHECKLIST.md](RELEASE-CHECKLIST.md)
2. **Version Bump**: Use `./version-bump.sh [type] "message"`
3. **Build**: Run `npm run build:all`
4. **Deploy**: Submit to browser stores

## 🏗️ Project Architecture

```
URL-Gathering-Tool/
├── docs/                          # 📚 Documentation (you are here)
│   ├── README.md                 # This file
│   ├── VERSION-MANAGEMENT.md     # Version management guide
│   ├── CROSS-BROWSER-MANIFEST.md # Cross-browser compatibility
│   └── RELEASE-CHECKLIST.md      # Release process checklist
├── public/                       # 🌐 Static assets and manifests
│   ├── manifest.json            # Chrome/Edge Manifest V3
│   ├── manifest-firefox.json    # Firefox Manifest V2
│   ├── manifest-safari.json     # Safari Manifest V2
│   └── assets/                  # Icons, CSS, JS
├── src/                         # 💻 Source code
│   ├── background/              # Service worker & background scripts
│   ├── content/                 # Content scripts
│   ├── popup/                   # Extension popup UI
│   ├── shared/                  # Shared components
│   └── utils/                   # Utility functions
├── scripts/                     # 🔧 Build and utility scripts
│   ├── build-manifest.sh       # Browser-specific manifest builder
│   ├── version-bump.sh          # Automated version management
│   └── check-version.sh         # Version consistency checker
└── configuration files          # ⚙️ Webpack, package.json, etc.
```

## 🎯 Key Features

- **Cross-Browser Support**: Chrome, Firefox, Safari, Edge
- **Manifest V3/V2**: Optimized for each browser platform
- **Multiple Export Formats**: Markdown, CSV, HTML, JSON, Plain Text
- **Version Management**: Automated semantic versioning
- **Build System**: Browser-specific builds with webpack

## 🛠️ Development Workflow

### Daily Development
```bash
npm run dev              # Start development mode with live reload
./check-version.sh       # Check version consistency
npm run build:chrome     # Test Chrome build
```

### Before Release
```bash
./check-version.sh                    # Verify versions
./version-bump.sh minor "New feature" # Bump version
npm run build:all                     # Build for all browsers
# Follow RELEASE-CHECKLIST.md
```

## 📖 Documentation Standards

### File Naming
- Use `UPPERCASE-WITH-HYPHENS.md` for major documentation
- Use descriptive filenames that clearly indicate content
- Keep filenames concise but informative

### Content Structure
- Start with clear overview and table of contents
- Use proper markdown formatting with headers
- Include code examples where applicable
- Add emoji for visual organization (📚 🚀 🛠️ etc.)

### Maintenance
- Update documentation with every feature change
- Keep examples current with latest code
- Review and update links regularly
- Ensure cross-references remain valid

## 🔗 External Resources

- [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions/)
- [Firefox Extension Documentation](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions)
- [Safari Extension Documentation](https://developer.apple.com/documentation/safariservices/safari_web_extensions)
- [Semantic Versioning](https://semver.org/)
- [Keep a Changelog](https://keepachangelog.com/)

## 🤝 Contributing

When contributing to documentation:

1. **Read existing docs** to understand the style and structure
2. **Follow markdown best practices** for consistency
3. **Test all code examples** to ensure they work
4. **Update the index** if adding new documentation files
5. **Keep it concise** but comprehensive

## 📞 Support

For questions about the documentation or project:

- **Issues**: [GitHub Issues](https://github.com/rjanain/url-gathering-chrome-extension/issues)
- **Discussions**: [GitHub Discussions](https://github.com/rjanain/url-gathering-chrome-extension/discussions)
- **Email**: Contact project maintainer

---

> **Note**: This documentation is kept up-to-date with each release. Last updated: v1.0.0 (2025-08-02)
