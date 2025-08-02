# Release Checklist

Use this checklist before releasing a new version of the URL Gathering Tool extension.

## Pre-Release (Development)

- [ ] All features implemented and tested locally
- [ ] Code reviewed and approved
- [ ] No console errors or warnings
- [ ] Extension works on all target browsers:
  - [ ] Chrome (latest stable)
  - [ ] Firefox (latest stable)
  - [ ] Safari (if applicable)
  - [ ] Edge (latest stable)

## Version Management

- [ ] Run `./scripts/check-version.sh` to ensure version consistency
- [ ] Determine version bump type (patch/minor/major)
- [ ] Run version bump script: `./scripts/version-bump.sh [type] "Description"`
- [ ] Verify CHANGELOG.md updated correctly
- [ ] Verify all manifest files updated

## Testing

- [ ] Load extension in development mode on each browser
- [ ] Test core functionality:
  - [ ] Extension popup opens
  - [ ] URLs are gathered correctly
  - [ ] Copy functionality works
  - [ ] Different output formats work
  - [ ] Settings persist correctly
- [ ] Test keyboard shortcuts
- [ ] Test on different websites
- [ ] Test with various numbers of tabs (1, 5, 20+)

## Build Process

- [ ] Run `npm run build:all` successfully
- [ ] Verify build outputs in dist/ directories
- [ ] Check manifest files in each build
- [ ] Test built extension (not dev mode) on each browser

## Documentation

- [ ] Update README.md if needed
- [ ] Update CHANGELOG.md with all changes
- [ ] Update version documentation
- [ ] Check all links in documentation work

## Git & GitHub

- [ ] All changes committed
- [ ] Git tag created (should be automatic from version-bump.sh)
- [ ] Push to remote: `git push origin [branch-name]`
- [ ] Push tags: `git push origin v[version]`
- [ ] Create GitHub release with:
  - [ ] Release notes from CHANGELOG
  - [ ] Attach browser-specific zip files
  - [ ] Mark as pre-release if applicable

## Store Submissions

### Chrome Web Store
- [ ] Upload chrome build zip
- [ ] Update store description if needed
- [ ] Add screenshots if UI changed
- [ ] Submit for review

### Firefox Add-ons (AMO)
- [ ] Upload firefox build zip
- [ ] Update listing description
- [ ] Add release notes
- [ ] Submit for review

### Microsoft Edge Add-ons
- [ ] Upload chrome build zip (same as Chrome)
- [ ] Update store listing
- [ ] Submit for review

### Safari App Store (if applicable)
- [ ] Update native app wrapper
- [ ] Submit through Xcode
- [ ] Follow Apple review process

## Post-Release

- [ ] Monitor extension stores for approval status
- [ ] Watch for user feedback and bug reports
- [ ] Update project status (close related issues/PRs)
- [ ] Announce release (if applicable):
  - [ ] Social media
  - [ ] Blog post
  - [ ] Email newsletter

## Rollback Plan

If issues are discovered after release:

- [ ] Document the issue
- [ ] Determine if hotfix or rollback needed
- [ ] If hotfix: create patch version
- [ ] If rollback: contact store support
- [ ] Notify users through available channels

## Version: ________
## Release Date: ________
## Release Type: [ ] Patch [ ] Minor [ ] Major
## Completed by: ________
