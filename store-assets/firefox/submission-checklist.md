# 🦊 Firefox Add-ons (AMO) Submission Checklist

## Pre-Submission Requirements

### ✅ Developer Account Setup
- [ ] Firefox Add-ons Developer Hub account created
- [ ] Mozilla account verified
- [ ] Developer profile completed
- [ ] Two-factor authentication enabled

### ✅ Extension Package Preparation
- [ ] Run `npm run package:firefox` successfully
- [ ] Verify `build/firefox-v1.0.0.zip` exists
- [ ] Test extension locally in Firefox
- [ ] Load temporary add-on works correctly
- [ ] All functionality verified

### ✅ Firefox-Specific Testing
- [ ] Install web-ext tool: `npm install -g web-ext`
- [ ] Run linting: `npx web-ext lint --source-dir=build/firefox`
- [ ] Fix all lint errors and warnings
- [ ] Test in Firefox Developer Edition
- [ ] Test in Firefox Nightly (if available)

## Manifest Validation

### ✅ Firefox Manifest Requirements
- [ ] Manifest V3 format used
- [ ] Firefox-specific fields included:
  - [ ] `applications.gecko.id`: "url-gathering-tool@rjana.in"
  - [ ] `applications.gecko.strict_min_version`: "109.0"
- [ ] All permissions necessary and minimal
- [ ] No Chrome-specific APIs used
- [ ] Content Security Policy compliant

### ✅ Cross-Browser Compatibility
- [ ] Uses webextension-polyfill for API calls
- [ ] No browser-specific code without polyfills
- [ ] Tested with Firefox's debugging tools
- [ ] No deprecated APIs used

## Technical Validation

### ✅ Code Quality Check
- [ ] No eval() usage
- [ ] No unsafe-inline in CSP
- [ ] All external libraries bundled
- [ ] Source maps removed from production build
- [ ] No development console.log statements
- [ ] Proper error handling implemented

### ✅ Web-ext Lint Results
```bash
# Run this command and fix all issues:
npx web-ext lint --source-dir=build/firefox
```
- [ ] 0 errors reported
- [ ] All warnings addressed or justified
- [ ] Performance recommendations implemented

## Store Listing Content

### ✅ Basic Information (use `/store-assets/firefox/metadata.md`)
- [ ] **Name**: URL Gathering Tool
- [ ] **Summary**: Under 250 characters ✓
- [ ] **Categories**: Other (Primary), Productivity (Secondary)
- [ ] **License**: ISC
- [ ] **Homepage**: https://rjana.in
- [ ] **Add-on ID**: url-gathering-tool@rjana.in

### ✅ Detailed Description
- [ ] Highlights Firefox compatibility
- [ ] Explains all features clearly
- [ ] Includes privacy statement
- [ ] Mentions webextension-polyfill usage
- [ ] Lists Firefox-specific optimizations

### ✅ Support Information
- [ ] Support website URL provided
- [ ] Source code availability mentioned
- [ ] Bug reporting process explained
- [ ] Contact information included

## Privacy & Security

### ✅ Privacy Compliance
- [ ] Privacy policy created and hosted
- [ ] Data collection practices documented
- [ ] Local processing emphasized
- [ ] No external API calls made
- [ ] Permission usage justified

### ✅ Security Review
- [ ] No malicious code patterns
- [ ] Secure coding practices followed
- [ ] Input validation implemented
- [ ] XSS prevention measures in place

## Visual Assets

### ✅ Screenshots for AMO
- [ ] **Firefox popup interface** - Extension in Firefox context
- [ ] **Tab collection demo** - Show Firefox tab integration
- [ ] **Format options** - Export format selection
- [ ] **Firefox features** - Integration with Firefox Collections
- [ ] **Privacy focus** - Highlight local processing
- [ ] All screenshots high quality (recommended 1280x800)
- [ ] Firefox UI elements visible for context

### ✅ Extension Icons
- [ ] 16x16 icon optimized
- [ ] 32x32 icon optimized
- [ ] 48x48 icon optimized
- [ ] 128x128 icon optimized
- [ ] Icons follow Firefox design guidelines
- [ ] SVG icon provided if available

## Technical Documentation

### ✅ Developer Notes
- [ ] Technical implementation documented
- [ ] Library versions specified
- [ ] Build process explained
- [ ] Testing methodology described

### ✅ Source Code Preparation (if required)
- [ ] Clean source code ready
- [ ] Build instructions included
- [ ] Dependencies documented
- [ ] License files included

## AMO Submission Process

### ✅ Distribution Method
- [ ] **AMO Distribution** selected (recommended)
- [ ] Self-distribution considered if needed
- [ ] Unlisted vs Listed decision made

### ✅ Upload Process
- [ ] Extension ZIP uploaded successfully
- [ ] Metadata filled completely
- [ ] Screenshots uploaded
- [ ] Categories selected appropriately
- [ ] Tags added (relevant keywords)

### ✅ Review Information
- [ ] **Source code**: Provided if using minified code
- [ ] **Testing notes**: Instructions for reviewers
- [ ] **Permission justification**: Detailed explanation
- [ ] **Feature description**: What reviewers should test

## Advanced Configuration

### ✅ Add-on Flags
- [ ] **Experimental**: No (unless using experimental APIs)
- [ ] **Requires payment**: No
- [ ] **Some platforms excluded**: Review if needed

### ✅ Technical Details
- [ ] **Supported versions**: Firefox 109+
- [ ] **Supported platforms**: All supported
- [ ] **File size**: Under reasonable limits
- [ ] **Update URL**: Not needed for AMO

## Quality Assurance

### ✅ Final Testing
- [ ] Fresh Firefox profile testing
- [ ] Multiple Firefox versions tested
- [ ] All features working correctly
- [ ] No performance issues
- [ ] Clean uninstall process

### ✅ User Experience
- [ ] Intuitive interface
- [ ] Clear functionality
- [ ] Good error messages
- [ ] Accessible design
- [ ] Responsive popup

## Submission Review

### ✅ Pre-Submission Final Check
- [ ] All metadata complete
- [ ] Technical requirements met
- [ ] Visual assets ready
- [ ] Documentation complete
- [ ] Testing thoroughly done

### ✅ Reviewer Notes
Add detailed notes for Mozilla reviewers:
```
REVIEWER NOTES:
- Extension collects tab URLs locally only
- No external API calls made
- Uses webextension-polyfill for compatibility
- All processing happens within browser
- Privacy-focused design with no data collection
- Test by opening multiple tabs and using popup
```

## Post-Submission

### ✅ Review Monitoring
- [ ] AMO dashboard checked regularly
- [ ] Email notifications enabled
- [ ] Response plan for reviewer questions
- [ ] Update strategy prepared

### ✅ Community Engagement
- [ ] Mozilla community guidelines reviewed
- [ ] Support forum participation planned
- [ ] User feedback response plan
- [ ] Future update roadmap

## Common AMO Rejection Reasons to Avoid

### ✅ Policy Compliance
- [ ] **Code Quality**: Clean, well-structured code
- [ ] **Security**: No security vulnerabilities
- [ ] **Privacy**: Clear privacy practices
- [ ] **Functionality**: Works as described
- [ ] **User Experience**: Good UX design

### ✅ Technical Issues
- [ ] No broken functionality
- [ ] Proper error handling
- [ ] Good performance
- [ ] Clean code structure
- [ ] Appropriate permissions

## Final Submission Status

- [ ] All checklist items completed
- [ ] Extension ready for AMO submission
- [ ] Support infrastructure prepared
- [ ] Monitoring plan in place

**Status**: ⏳ Ready for AMO Submission

**Estimated Review Time**: 1-5 business days (varies by complexity)

**Auto-Signing**: Available for simple extensions, manual review for complex ones

**Next Steps After Approval**:
1. Monitor user reviews and ratings
2. Engage with Firefox community
3. Plan compatibility updates
4. Track usage statistics

---

*Last updated: August 3, 2025*
*Firefox Add-ons have stricter review criteria - ensure all technical requirements are met*
