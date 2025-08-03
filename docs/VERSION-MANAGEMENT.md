# Version Management Guide

## Overview

This project uses semantic versioning (SemVer) and maintains version consistency across all manifest files and package configurations for cross-browser compatibility.

## Version Format

We follow [Semantic Versioning 2.0.0](https://semver.org/):

```
MAJOR.MINOR.PATCH
```

- **MAJOR**: Incompatible API changes, major feature overhauls
- **MINOR**: New functionality in a backwards compatible manner
- **PATCH**: Backwards compatible bug fixes

## Current Version: 1.1.0

### Version History
- **1.1.0** (2025-08-03): UI migration to Tailwind CSS + shadcn/ui, TypeScript implementation, bug fixes
- **1.0.0** (2025-08-02): Cross-browser compatibility release
- **0.0.4** (2022-10-01): Bug fixes and highlighted tab selection
- **0.0.3** (2022-10-01): Added output format options
- **0.0.2** (2022-09-29): Initial working version
- **0.0.1** (2022-09-29): Initial release

## Files That Contain Version Information

1. **version.json** - Master version file with metadata
2. **public/manifest.json** - Chrome/Edge Manifest V3
3. **public/manifest-firefox.json** - Firefox Manifest V2
4. **public/manifest-safari.json** - Safari Manifest V2
5. **package.json** - npm package configuration
6. **CHANGELOG.md** - Human-readable change log

## Version Management Scripts

### 1. Check Version Consistency
```bash
./scripts/check-version.sh
```
Validates that all files have the same version number and displays version information.

### 2. Bump Version
```bash
# Patch version (1.0.0 → 1.0.1)
./scripts/version-bump.sh patch "Fix URL encoding issue"

# Minor version (1.0.0 → 1.1.0)
./scripts/version-bump.sh minor "Add new export format"

# Major version (1.0.0 → 2.0.0)
./scripts/version-bump.sh major "Breaking API changes"
```

### 3. NPM Scripts
```bash
# Check current version
npm run version:check

# Display full version info
npm run version:info

# Bump versions
npm run version:patch
npm run version:minor
npm run version:major
```

## Automated Version Bump Process

The `version-bump.sh` script automatically:

1. ✅ Updates version in all manifest files
2. ✅ Updates package.json version
3. ✅ Updates version.json with metadata
4. ✅ Updates CHANGELOG.md with new entry
5. ✅ Creates git commit with version bump
6. ✅ Creates git tag (e.g., v1.0.1)
7. ✅ Provides instructions for pushing changes

## Release Process

### For Patch/Minor Releases
```bash
# 1. Bump version
./scripts/version-bump.sh minor "Add bookmark integration"

# 2. Build for all browsers
npm run build:all

# 3. Test the extension on each browser

# 4. Push changes
git push origin $(git branch --show-current)
git push origin v1.1.0

# 5. Create release on GitHub
# 6. Submit to browser stores
```

### For Major Releases
```bash
# 1. Update version with breaking changes description
./scripts/version-bump.sh major "Manifest V3 migration and API changes"

# 2. Update documentation
# 3. Test thoroughly on all browsers
# 4. Follow same release process as above
```

## Browser Store Versions

### Chrome Web Store
- Use main `manifest.json` (Manifest V3)
- Version format: `MAJOR.MINOR.PATCH`
- Update store listing with changelog

### Firefox Add-ons (AMO)
- Use `manifest-firefox.json` (Manifest V2)
- Version format: `MAJOR.MINOR.PATCH`
- Include detailed review notes

### Safari App Store
- Use `manifest-safari.json` (Manifest V2)
- Requires native app wrapper
- Version must match bundle version

### Microsoft Edge Add-ons
- Use main `manifest.json` (Manifest V3)
- Same process as Chrome Web Store

## Version Metadata (version.json)

The `version.json` file contains additional metadata:

```json
{
  "version": "1.0.0",
  "name": "URL Gathering Tool",
  "description": "Cross-browser extension with enhanced features",
  "previousVersion": "0.0.4",
  "releaseDate": "2025-08-02",
  "releaseType": "major",
  "changes": {
    "major": ["Cross-browser compatibility", "Manifest V3"],
    "minor": [],
    "patch": []
  },
  "browsers": {
    "chrome": {"minVersion": "88", "manifestVersion": 3},
    "firefox": {"minVersion": "78", "manifestVersion": 2},
    "safari": {"minVersion": "14", "manifestVersion": 2},
    "edge": {"minVersion": "88", "manifestVersion": 3}
  }
}
```

## Troubleshooting

### Version Mismatch Errors
If `./scripts/check-version.sh` reports inconsistencies:
```bash
# Fix automatically
./scripts/version-bump.sh patch "Fix version consistency"
```

### Manual Version Update
If you need to manually update versions:
1. Update `version.json` first
2. Run `./scripts/check-version.sh` to see which files need updating
3. Update each file individually
4. Run `./scripts/check-version.sh` again to verify

### Git Tag Issues
If tag already exists:
```bash
# Delete local tag
git tag -d v1.0.0

# Delete remote tag
git push origin :refs/tags/v1.0.0

# Recreate tag
./scripts/version-bump.sh patch "Updated version"
```

## Best Practices

1. **Always use the scripts** - Don't manually edit version numbers
2. **Test before releasing** - Verify on all target browsers
3. **Write meaningful commit messages** - Include what changed
4. **Update CHANGELOG.md** - Keep users informed of changes
5. **Follow semantic versioning** - Be consistent with version meaning
6. **Check version consistency** - Run `./scripts/check-version.sh` before releases

## Integration with CI/CD

You can integrate version checking into your CI pipeline:

```yaml
# Example GitHub Actions step
- name: Check Version Consistency
  run: ./scripts/check-version.sh

- name: Build All Browsers
  run: npm run build:all
```

This ensures version consistency and proper builds across all browser targets.
