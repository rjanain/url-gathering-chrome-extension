const { merge } = require('webpack-merge');
const config = require('./webpack.config.js');
const TerserPlugin = require('terser-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = (env = {}) => {
    const baseConfig = config({ NODE_ENV: 'production' });

    return merge(baseConfig, {
        mode: 'production',
        devtool: 'source-map',

        optimization: {
            minimize: true,
            minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        compress: {
                            drop_console: true,
                            drop_debugger: true,
                            pure_funcs: ['console.log']
                        },
                        format: {
                            comments: false
                        }
                    },
                    extractComments: false
                })
            ],

            splitChunks: {
                chunks: 'all',
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendors',
                        chunks: 'all',
                        enforce: true,
                        priority: 10
                    },
                    react: {
                        test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
                        name: 'react',
                        chunks: 'all',
                        enforce: true,
                        priority: 20
                    }
                }
            }
        },

        plugins: [
            // Add bundle analyzer if --analyze flag is passed
            ...(env.analyze ? [new BundleAnalyzerPlugin({
                analyzerMode: 'static',
                openAnalyzer: true,
                reportFilename: 'bundle-report.html'
            })] : [])
        ],

        performance: {
            hints: 'warning',
            maxEntrypointSize: 512000,
            maxAssetSize: 512000
        }
    });
};
