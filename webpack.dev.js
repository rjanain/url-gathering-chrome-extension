const { merge } = require('webpack-merge');
const config = require('./webpack.config.js');

module.exports = (env = {}) => {
    const baseConfig = config({ NODE_ENV: 'development', ...env });

    return merge(baseConfig, {
    mode: 'development',
    devtool: 'cheap-module-source-map',

    // Watch options for development
    watchOptions: {
        aggregateTimeout: 300,
        poll: 1000,
        ignored: /node_modules/
    },

    // Enhanced stats for development
    stats: {
        colors: true,
        errors: true,
        warnings: true,
        modules: false,
        children: false
    },

    // Disable performance hints in development
    performance: {
        hints: false
    },

    // Optimization disabled for faster builds
    optimization: {
        minimize: false,
        splitChunks: false
    }
    });
};
