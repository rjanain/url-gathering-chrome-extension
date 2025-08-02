# Firefox Add-ons (AMO) Assets

This directory contains all assets needed for Firefox Add-ons submission.

## Contents
- `metadata.md` - Complete AMO listing information
- `submission-checklist.md` - Pre-submission checklist
- `screenshots/` - AMO screenshots (1280x800 recommended)

## Submission Process
1. Run `npx web-ext lint --source-dir=build/firefox` and fix all issues
2. Complete all items in `submission-checklist.md`
3. Use metadata from `metadata.md` for AMO listing
4. Test extension package: `npm run package:firefox`

## Firefox-Specific Requirements
- Add-on ID: url-gathering-tool@rjana.in
- Minimum Firefox version: 109.0
- Must pass web-ext lint without errors
- Source code may be required for review

## Required Screenshots
1. Firefox popup interface
2. Tab collection demo
3. Format options
4. Firefox integration features
5. Privacy focus demonstration
