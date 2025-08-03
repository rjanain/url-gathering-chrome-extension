# URL Gathering Tool - Chrome Extension (<img src="./public/assets/img/180.png" height=16 alt="Chrome Extension " />)

[![Keep a Changelog v1.1.0 badge][changelog-badge]][changelog]
[![Version 1.1.0 Badge][version-badge]][changelog]
[![License Badge][license-badge]][license]
[![GitHub issues][github-issue]][issue]
![GitHub commit activity][commit-activity]

By using this chrome extension we can  gather all url that are open on the current browser window and directly copy those information into your clipboard in different format likes, Markdown, CSV, html, and plain text.


# Chrome Web Store Description


By using this chrome extension we can gather all url that are open on the current browser window and directly copy those information into your clipboard in different format likes, `Markdown`, `CSV`, `html`, `JSON` and `plain text`.


- Display all icons corresponding to each page that is currently open on the active browser window. It will not takes `chrome` pages likes `chrome://` or `chrome-extension://` into the consideration. The icons appeared on the app as per the corresponding pages open on the browser.

- Upon clicking an icon, the url corresponds to the page will be copied to your clipboard automatically. The icon corresponds to active page appears on the popup larger than other.

- Also you will find a `Copy To All` button to copy all urls that are currently open on your active browser window  into your clipboard. Currently we are using a empty line space in between two consecutive url while coping. In the next version we will add an feature so that user can change it as per their requirement.




## Development

### Quick Start
1. Clone this repository
2. Run `npm install` to install dependencies
3. Use `npm run dev` for development with live reload
4. Use `npm run build` for production builds

### Available Scripts
```json
{
  "scripts": {
    "dev": "webpack --watch --config webpack.dev.js",
    "build": "webpack --config webpack.prod.js",
    "build:chrome": "Build for Chrome/Edge (Manifest V3)",
    "build:firefox": "Build for Firefox (Manifest V2)",
    "build:safari": "Build for Safari (Manifest V2)",
    "build:all": "Build for all browsers",
    "zip": "Create distribution zips for all browsers",
    "zip:chrome": "Create Chrome extension zip",
    "zip:firefox": "Create Firefox extension zip",
    "zip:safari": "Create Safari extension zip",
    "package": "Complete build and zip workflow for all browsers",
    "package:chrome": "Build and zip Chrome extension",
    "package:firefox": "Build and zip Firefox extension",
    "package:safari": "Build and zip Safari extension",
    "version:check": "Check version consistency",
    "version:patch": "Bump patch version",
    "version:minor": "Bump minor version",
    "version:major": "Bump major version"
  }
}
```

### Distribution & Publishing
After building, create store-ready zip files:
```bash
# Create zips for all browsers
npm run package

# Or create for specific browser
npm run package:chrome
npm run package:firefox
npm run package:safari
```

Zip files are created in the `build/` directory with versioned names (e.g., `chrome-v1.0.0.zip`) ready for upload to browser extension stores.

### Cross-Browser Development
This extension supports multiple browsers with optimized manifests:
- **Chrome/Edge**: Manifest V3 with service workers
- **Firefox**: Manifest V2 with background scripts
- **Safari**: Manifest V2 with simplified features

See [Cross-Browser Documentation](./docs/CROSS-BROWSER-MANIFEST.md) for details.

## Documentation

Comprehensive documentation is available in the [`docs/`](./docs/) directory:

- **[📚 Documentation Hub](./docs/README.md)** - Complete documentation index and navigation
- **[🔧 Version Management](./docs/VERSION-MANAGEMENT.md)** - Complete versioning guide
- **[🌐 Cross-Browser Support](./docs/CROSS-BROWSER-MANIFEST.md)** - Browser compatibility details
- **[🏗️ Project Structure](./docs/STRUCTURE.md)** - Project organization and architecture
- **[⚙️ Git Setup](./docs/SETUP-GIT.md)** - Cross-platform development setup
- **[✅ Release Process](./docs/RELEASE-CHECKLIST.md)** - Step-by-step release guide
- **[🛠️ Build Scripts](./scripts/README.md)** - Build and utility scripts documentation

### Quick Reference
- **[📝 Changelog](./CHANGELOG.md)** - Version history and changes
- **[📋 TODO](./TODO.md)** - Planned features and roadmap

## Project Structure

```
URL-Gathering-Tool/
├── docs/           # 📚 Complete documentation
├── scripts/        # 🔧 Build and utility scripts
├── src/            # 💻 Source code
├── public/         # 🌐 Static assets and manifests
└── dist/           # 📦 Built extension files
```

For detailed project structure, see [Project Structure Documentation](./docs/STRUCTURE.md).

## Boilerplate Usage
You can use this as a boilerplate for other cross-browser extensions. The project includes:
- ✅ Cross-browser manifest management
- ✅ Automated version management
- ✅ Webpack build system
- ✅ Distribution zip creation for browser stores
- ✅ Comprehensive documentation
- ✅ Release automation scripts





<!-- Links -->

[changelog]: ./CHANGELOG.md
[changelog-badge]: https://img.shields.io/badge/changelog-Keep%20a%20Changelog%20v1.1.0-%23E05735
[license]: ./LICENSE
[source]: src/
[pull-request]: https://help.github.com/articles/creating-a-pull-request/
[fork]: https://help.github.com/articles/fork-a-repo/
[version-badge]: https://img.shields.io/badge/version-0.0.2-blue.svg
[license-badge]: https://img.shields.io/github/license/rjanain/url-gathering-chrome-extension
[github-issue]: https://img.shields.io/github/issues/rjanain/url-gathering-chrome-extension
[issue]: https://github.com/rjanain/url-gathering-chrome-extension/issues
[commit-activity]: https://img.shields.io/github/commit-activity/m/rjanain/url-gathering-chrome-extension
