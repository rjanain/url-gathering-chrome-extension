# Modern Build System Documentation

This document explains the modern bundling setup implemented for the URL Gathering Chrome Extension.

## Overview

The project now uses a modern Webpack 5-based build system with support for:
- Environment-specific builds
- Modern JavaScript/JSX compilation
- SCSS/CSS preprocessing
- Asset optimization
- Code splitting
- Source maps
- Bundle analysis

## Build Commands

### Development
```bash
npm run dev         # Start development build with watch mode
```

### Production
```bash
npm run build       # Full production build with version check
npm run build:quick # Quick production build without version check
npm run build:analyze # Production build with bundle analysis
```

### Browser-Specific Builds
```bash
npm run build:chrome  # Build for Chrome
npm run build:firefox # Build for Firefox
npm run build:safari  # Build for Safari
npm run build:all     # Build for all browsers
```

## Configuration Files

### Main Configuration
- `webpack.config.js` - Base webpack configuration
- `webpack.dev.js` - Development-specific settings
- `webpack.prod.js` - Production-specific settings

### Environment Configuration
- `config/env.js` - Environment variables for different stages
- `config/webpack.utils.js` - Shared webpack utilities
- `.babelrc.js` - Babel configuration for JavaScript transpilation

## Features

### Environment-Specific Builds
The build system supports multiple environments:
- **Development**: Debug enabled, unminified code, source maps
- **Production**: Optimized, minified, console logs removed
- **Staging**: Testing environment with debug capabilities

### Asset Processing
- **JavaScript/JSX**: Transpiled with Babel for browser compatibility
- **CSS/SCSS**: Compiled with Sass, autoprefixed, and optimized
- **Images/Fonts**: Optimized and copied with cache-busting hashes

### Code Splitting
- Vendor libraries are split into separate chunks
- React/React-DOM get their own chunk for better caching
- Automatic chunk optimization based on usage

### Path Aliases
Convenient import aliases are configured:
```javascript
import Component from '@components/Component'; // src/shared/components/
import utils from '@utils/helper';             // src/utils/
import '@assets/css/main.scss';               // src/assets/
```

### Bundle Analysis
Use `npm run build:analyze` to generate a visual analysis of your bundle:
- Identifies large dependencies
- Shows code splitting effectiveness
- Helps optimize bundle size

## File Structure

```
src/
├── assets/
│   ├── css/
│   │   └── main.scss          # Main stylesheet
│   └── ...
├── background/
├── content/
├── popup/
│   └── index.js               # Now imports CSS
├── shared/
└── utils/

config/
├── env.js                     # Environment variables
└── webpack.utils.js           # Webpack utilities

dist/                          # Built extension files
├── assets/                    # Processed assets
├── vendor/                    # JavaScript bundles
├── popup.html                 # Generated HTML
└── manifest.json             # Extension manifest
```

## Performance Optimizations

### Development
- Fast incremental builds with caching
- Eval source maps for debugging
- No minification for faster builds
- Hot module replacement ready

### Production
- Tree shaking to remove unused code
- Minification with Terser
- CSS extraction and optimization
- Asset compression and cache-busting
- Dead code elimination

## Migration from Old System

### What Changed
1. **CSS/SCSS Support**: Can now import stylesheets directly in JavaScript
2. **Path Aliases**: Use `@` shortcuts for cleaner imports
3. **Environment Variables**: Access via `process.env.*`
4. **Modern Babel**: Latest presets with automatic JSX runtime
5. **Better Source Maps**: More accurate debugging information

### Breaking Changes
- CSS files are now processed through webpack instead of being copied directly
- Some paths may need updating to use new aliases
- Environment variables are now injected at build time

## Troubleshooting

### Common Issues

1. **CSS not loading**: Make sure to import CSS files in your JavaScript entry points
2. **Module not found**: Check if you're using the correct path aliases
3. **Build too slow**: Enable caching in development mode (already configured)
4. **Bundle too large**: Use `npm run build:analyze` to identify large dependencies

### Debug Tips
- Use `npm run build:analyze` to visualize bundle composition
- Check the console output for webpack warnings
- Source maps are enabled for debugging in both dev and prod

## Future Enhancements

Potential improvements to consider:
- PostCSS for advanced CSS processing
- TypeScript support
- ESLint/Prettier integration
- Unit test integration with Jest
- Progressive Web App features
- Hot module replacement for development
