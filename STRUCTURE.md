# Project Structure

This extension follows a modular folder structure for better maintainability and scalability:

```
src/
├── background/           # Background scripts (service workers)
│   └── serviceWorker.js
├── popup/               # Popup-related files
│   ├── index.js         # Popup entry point
│   └── App.js           # Main popup React component
├── content/             # Content scripts
│   └── contentScript.js
├── shared/              # Shared components and utilities
│   ├── components/      # React components used across the app
│   │   ├── Home.js
│   │   ├── home/
│   │   ├── options/
│   │   └── index.js     # Component exports
│   └── index.js         # Shared exports
├── utils/               # Utility functions
│   ├── chromeAPI.js     # Chrome extension API utilities
│   ├── copyAPI.js       # Copy functionality
│   ├── handlerStorage.js # Storage utilities
│   └── index.js         # Utility exports
└── assets/              # Static assets (if needed in src)

public/                  # Static public files
├── assets/              # Static assets (images, fonts, CSS, etc.)
│   ├── css/
│   ├── font/
│   ├── img/
│   └── js/
├── manifest.json        # Extension manifest
└── popup.html           # Popup HTML template

build/                   # Build output (generated)
dist/                    # Distribution files (generated)
```

## Benefits of this structure:

1. **Separation of Concerns**: Each folder has a specific purpose
2. **Scalability**: Easy to add new features without cluttering
3. **Maintainability**: Clear organization makes finding and updating code easier
4. **Reusability**: Shared components and utilities can be easily imported
5. **Cross-browser compatibility**: Structure supports multiple browser extension formats

## Import Conventions:

- Use index.js files for cleaner imports
- Relative imports for local dependencies
- Shared components accessible from `../shared/components`
- Utilities accessible from `../utils`
