# Scripts Directory

This directory co# Bump minor version (new features)
./scripts/version-bump.sh minor "Add new export format"

# Bump major version (breaking changes)
./scripts/version-bump.sh major "Migrate to Manifest V3"

# Verify extension build
./scripts/verify-extension.sh
``` utility scripts for building, versioning, and managing the URL Gathering Tool extension.

## 📋 Script Index

| Script | Purpose | Usage |
|--------|---------|-------|
| **build-manifest.sh** | Build browser-specific manifests | `./scripts/build-manifest.sh [chrome\|firefox\|safari\|all]` |
| **version-bump.sh** | Automated version management | `./scripts/version-bump.sh [major\|minor\|patch] "message"` |
| **check-version.sh** | Version consistency validation | `./scripts/check-version.sh` |
| **verify-extension.sh** | Verify extension build completeness | `./scripts/verify-extension.sh` |

## 🚀 Quick Start

### Building for Different Browsers
```bash
# Chrome/Edge (Manifest V3)
./scripts/build-manifest.sh chrome

# Firefox (Manifest V2)
./scripts/build-manifest.sh firefox

# Safari (Manifest V2)
./scripts/build-manifest.sh safari

# All browsers
./scripts/build-manifest.sh all
```

### Version Management
```bash
# Check version consistency
./scripts/check-version.sh

# Bump patch version (bug fixes)
./scripts/version-bump.sh patch "Fix clipboard issue"

# Bump minor version (new features)
./scripts/version-bump.sh minor "Add dark mode support"

# Bump major version (breaking changes)
./scripts/version-bump.sh major "Migrate to Manifest V3"
```

## 📝 Script Details

### build-manifest.sh
**Purpose**: Creates browser-specific builds with appropriate manifest files.

**Features**:
- ✅ Copies appropriate manifest file for target browser
- ✅ Creates separate build directories for each browser
- ✅ Handles cross-browser compatibility differences
- ✅ Validates target browser parameter

**Output**: Creates `dist/` directory with browser-specific builds.

### version-bump.sh
**Purpose**: Automated semantic versioning across all project files.

**Features**:
- ✅ Updates all manifest files consistently
- ✅ Updates package.json and version.json
- ✅ Generates CHANGELOG.md entries
- ✅ Creates git commits and tags
- ✅ Follows semantic versioning standards

**Requirements**: `jq` (JSON processor)

### check-version.sh
**Purpose**: Validates version consistency across all configuration files.

**Features**:
- ✅ Compares versions in all manifest files
- ✅ Validates semantic versioning format
- ✅ Displays comprehensive version information
- ✅ Detects inconsistencies and provides fix suggestions

### verify-extension.sh
**Purpose**: Validates that Chrome extension build is complete and ready to load.

**Features**:
- ✅ Checks all required manifest and script files
- ✅ Validates asset directory and icons
- ✅ Provides loading instructions for Chrome
- ✅ Clear success/failure reporting

**Exit Codes**:
- `0`: Extension build is complete
- `1`: Missing required files

## 🔧 Dependencies

### Required Tools
- **bash**: Shell script execution
- **jq**: JSON processing (install with `brew install jq` on macOS)
- **git**: Version control operations
- **npm**: Package management

### Installation Check
```bash
# Check if all dependencies are available
which bash jq git npm
```

## 🛠️ Development

### Adding New Scripts
1. Create script in `scripts/` directory
2. Make executable: `chmod +x scripts/new-script.sh`
3. Update this README with script documentation
4. Add to package.json if applicable

### Script Conventions
- Use `#!/bin/bash` shebang
- Include `set -e` for error handling
- Use colored output for better UX:
  - 🔵 Info: `log_info()`
  - ✅ Success: `log_success()`
  - ⚠️ Warning: `log_warning()`
  - ❌ Error: `log_error()`

### Testing Scripts
```bash
# Test build script
./scripts/build-manifest.sh chrome
ls -la dist/chrome/

# Test version checking
./scripts/check-version.sh

# Test version bump (dry run)
./scripts/version-bump.sh patch "Test change" --dry-run
```

## 🔗 Integration

### NPM Scripts
All scripts are integrated with npm for convenient usage:

```json
{
  "scripts": {
    "build:chrome": "./scripts/build-manifest.sh chrome && npm run build",
    "build:firefox": "./scripts/build-manifest.sh firefox && npm run build",
    "build:safari": "./scripts/build-manifest.sh safari && npm run build",
    "build:all": "./scripts/build-manifest.sh all && npm run build",
    "version:patch": "./scripts/version-bump.sh patch",
    "version:minor": "./scripts/version-bump.sh minor",
    "version:major": "./scripts/version-bump.sh major",
    "version:check": "./scripts/check-version.sh",
    "verify": "./scripts/verify-extension.sh"
  }
}
```

### CI/CD Integration
Scripts are designed for CI/CD pipeline integration:

```yaml
# GitHub Actions example
- name: Check Version Consistency
  run: ./scripts/check-version.sh

- name: Build All Browsers
  run: npm run build:all

- name: Validate Builds
  run: |
    test -f dist/chrome/manifest.json
    test -f dist/firefox/manifest.json
    test -f dist/safari/manifest.json
```

## 🐛 Troubleshooting

### Common Issues

**Permission Denied**
```bash
chmod +x scripts/*.sh
```

**jq Not Found**
```bash
# macOS
brew install jq

# Ubuntu/Debian
sudo apt-get install jq
```

**Version Mismatch Errors**
```bash
./scripts/version-bump.sh patch "Fix version consistency"
```

**Build Directory Conflicts**
```bash
rm -rf dist/
./scripts/build-manifest.sh all
```

### Debug Mode
Enable verbose output by setting debug flag:
```bash
DEBUG=1 ./scripts/build-manifest.sh chrome
```

## 📞 Support

For script-related issues:
1. Check this README for common solutions
2. Verify dependencies are installed
3. Check script permissions (`ls -la scripts/`)
4. Open issue with error output and environment details

---

> **Note**: All scripts are designed to be run from the project root directory.
