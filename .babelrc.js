module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          browsers: ['last 2 versions', 'Chrome >= 88', 'Firefox >= 85']
        },
        modules: false,
        useBuiltIns: 'usage',
        corejs: 3
      }
    ],
    [
      '@babel/preset-react',
      {
        runtime: 'automatic'
      }
    ]
  ],
  plugins: [
    // Add any additional Babel plugins here if needed
  ],
  env: {
    development: {
      compact: false,
      plugins: [
        // Development-only plugins
      ]
    },
    production: {
      compact: true,
      plugins: [
        // Production-only plugins
      ]
    }
  }
};
