# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog],
and this project adheres to [Semantic Versioning].

## [Unreleased]

## [1.1.0] - 2025-08-03

### Changed
- Version bump


## [1.0.0] - 2025-08-02

### Added
- Cross-browser compatibility (Chrome, Firefox, Safari, Edge)
- Manifest V3 implementation for Chrome/Edge with fallback V2 for Firefox/Safari
- Enhanced security with improved Content Security Policy
- Keyboard shortcuts for quick access (Ctrl+Shift+U to open, Ctrl+Shift+C to copy all)
- Automated build system for different browsers
- Comprehensive version management system
- Better icon standardization (16, 32, 48, 128px)
- Web accessible resources properly configured
- Options page support

### Changed
- Complete project restructure for better maintainability
- Updated manifest files for each browser platform
- Enhanced extension description and metadata
- Improved build scripts with browser-specific targets

### Technical
- Service worker implementation for Chrome/Edge
- Background scripts maintained for Firefox/Safari
- Host permissions separated from regular permissions (Manifest V3)
- Enhanced externally_connectable security configuration

## [0.0.4] - 2022-10-01

### Fixed
- Fixed the [bug](https://github.com/rjanain/url-gathering-chrome-extension/issues/2) that causing break after page title when the selcted format is `csv`.



### Added

- Added an option to copy only highlighted tabs that user select by using `CTRL` key.

## [0.0.3] - 2022-10-01

### Chnaged

- Changed the title of the project and page description.

### Added

- Now user can choose the output format by going `Settings` tab. Currently, there five options are avilable: `PlainText`, `CSV`, `JSON`, `Markdown`, and `HTML`. User can also give the preference whether they want to include the page title in the output.

- User settings will be store in the `chrome.storage.sync` and so it will be automatically sync with chrome browser on which user installed this extension.

- The copied badge that appear upon clicking on icon/button in the App page will disapper automatically after five seconds.

- Removed unnecessary permission like `Bookmark` has been removed from `manifest.json`.

## [0.0.2] - 2022-09-29

### Added
- This is an initial working version with the following features.

    - Display all icons corresponding to each page that is currently open on the active browser window. It will not takes `chrome` pages likes `chrome://` or `chrome-extension://` into the consideration. The icons appeared on the app as per the corresponding pages open on the browser.

    - Upon clicking an icon, the url corresponds to the page will be copied to your clipboard automatically.

    - Also you will find a `Copy To All` button to copy all urls that are currently open on your active browser window  into your clipboard. Currently we are using a empty line space in between two consecutive url while coping. In the next version we will add an feature so that user can change it as per their requirement.






## [0.0.1] - 2022-09-29

- initial release

<!-- Links -->
[keep a changelog]: https://keepachangelog.com/en/1.0.0/
[semantic versioning]: https://semver.org/spec/v2.0.0.html
[changelog]: ./CHANGELOG.md
[changelog-badge]: https://img.shields.io/badge/changelog-Keep%20a%20Changelog%20v1.1.0-%23E05735
[license]: ./LICENSE
[rbenv]: https://github.com/rbenv/rbenv
[ruby-version]: .ruby-version
[source]: source/
[pull-request]: https://help.github.com/articles/creating-a-pull-request/
[fork]: https://help.github.com/articles/fork-a-repo/
[version-badge]: https://img.shields.io/badge/version-1.1.0-blue.svg
[license-badge]: https://img.shields.io/badge/license-MIT-blue.svg


<!-- Versions -->
[unreleased]: https://github.com/rjanain/url-gathering-chrome-extension/compare/v0.0.2...HEAD
[0.0.2]: https://github.com/rjanain/url-gathering-chrome-extension/compare/v0.0.1...v0.0.2
[0.0.1]: https://github.com/rjanain/url-gathering-chrome-extension/releases/tag/v0.0.1
