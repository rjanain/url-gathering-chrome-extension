const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { getDefinePlugin, getOptimization } = require('./config/webpack.utils');

module.exports = (env = {}) => {
    const isProduction = env.NODE_ENV === 'production';
    const isDevelopment = !isProduction;
    const currentEnv = env.NODE_ENV || 'development';

    return {
        mode: isDevelopment ? 'development' : 'production',

        entry: {
            serviceWorker: './src/background/serviceWorker.js',
            contentScript: './src/content/contentScript.js',
            popup: './src/popup/index.js'
        },

        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'vendor/[name].js',
            clean: true,
            publicPath: '/',
            // Prevent webpack from using document.baseURI in service workers
            globalObject: 'this'
        },

        module: {
            rules: [
                // JavaScript and JSX
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true,
                            cacheCompression: false,
                            envName: currentEnv
                        }
                    }
                },

                // CSS, SASS, SCSS
                {
                    test: /\.(css|sass|scss)$/,
                    use: [
                        isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: isDevelopment,
                                importLoaders: 2,
                                modules: {
                                    mode: 'icss'
                                }
                            }
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: isDevelopment,
                                api: 'modern-compiler',
                                sassOptions: {
                                    includePaths: [
                                        path.resolve(__dirname, 'node_modules'),
                                        path.resolve(__dirname, 'src/assets/css')
                                    ]
                                }
                            }
                        }
                    ]
                },

                // Images and fonts
                {
                    test: /\.(png|jpe?g|gif|svg|woff|woff2|eot|ttf|otf)$/i,
                    type: 'asset/resource',
                    generator: {
                        filename: 'assets/[hash][ext][query]'
                    }
                }
            ]
        },

        plugins: [
            // Environment variables
            getDefinePlugin(currentEnv),

            // Copy public assets
            new CopyPlugin({
                patterns: [
                    {
                        from: 'public',
                        to: '.',
                        globOptions: {
                            ignore: ['**/popup.html', '**/options.html']
                        }
                    }
                ]
            }),

            // Generate HTML files
            new HtmlWebpackPlugin({
                template: './public/popup.html',
                filename: 'popup.html',
                chunks: ['popup'],
                inject: 'body',
                minify: isProduction ? {
                    removeComments: true,
                    collapseWhitespace: true,
                    removeAttributeQuotes: true
                } : false
            }),

            new HtmlWebpackPlugin({
                template: './public/options.html',
                filename: 'options.html',
                chunks: [],
                inject: false,
                minify: isProduction ? {
                    removeComments: true,
                    collapseWhitespace: true,
                    removeAttributeQuotes: true
                } : false
            }),

            // Extract CSS in production
            ...(isProduction ? [
                new MiniCssExtractPlugin({
                    filename: 'assets/css/[name].[contenthash].css',
                    chunkFilename: 'assets/css/[id].[contenthash].css'
                })
            ] : [])
        ],

        resolve: {
            extensions: ['.js', '.jsx', '.json'],
            alias: {
                '@': path.resolve(__dirname, 'src'),
                '@components': path.resolve(__dirname, 'src/shared/components'),
                '@utils': path.resolve(__dirname, 'src/utils'),
                '@assets': path.resolve(__dirname, 'src/assets')
            }
        },

        optimization: getOptimization(isProduction),

        devtool: isDevelopment ? 'cheap-module-source-map' : 'source-map',

        // Configure different source map settings for content scripts
        plugins: [
            getDefinePlugin(currentEnv),

            new HtmlWebpackPlugin({
                template: './public/popup.html',
                filename: 'popup.html',
                chunks: ['popup']
            }),

            new HtmlWebpackPlugin({
                template: './public/options.html',
                filename: 'options.html',
                chunks: []
            }),

            new CopyPlugin({
                patterns: [
                    { from: 'public/manifest-active.json', to: 'manifest-active.json' },
                    { from: 'public/manifest-firefox.json', to: 'manifest-firefox.json' },
                    { from: 'public/manifest-safari.json', to: 'manifest-safari.json' },
                    { from: 'public/assets', to: 'assets' }
                ]
            }),

            new MiniCssExtractPlugin({
                filename: 'assets/css/[name].css'
            }),

            // Custom plugin to disable source maps for content scripts in development
            ...(isDevelopment ? [{
                apply: (compiler) => {
                    compiler.hooks.afterEmit.tap('DisableContentScriptSourceMaps', (compilation) => {
                        const fs = require('fs');
                        const contentScriptPath = path.join(compiler.options.output.path, 'vendor/contentScript.js');
                        const contentScriptMapPath = contentScriptPath + '.map';

                        // Remove source map reference from content script
                        if (fs.existsSync(contentScriptPath)) {
                            let content = fs.readFileSync(contentScriptPath, 'utf8');
                            content = content.replace(/\/\/# sourceMappingURL=.*$/m, '');
                            fs.writeFileSync(contentScriptPath, content);
                        }

                        // Remove the source map file for content script
                        if (fs.existsSync(contentScriptMapPath)) {
                            fs.unlinkSync(contentScriptMapPath);
                        }

                        // Fix service worker document.baseURI issue
                        const serviceWorkerPath = path.join(compiler.options.output.path, 'vendor/serviceWorker.js');
                        if (fs.existsSync(serviceWorkerPath)) {
                            let content = fs.readFileSync(serviceWorkerPath, 'utf8');
                            // Replace document.baseURI with self.location.href for service worker compatibility
                            content = content.replace(
                                /document\.baseURI \|\| self\.location\.href/g,
                                'self.location.href'
                            );
                            fs.writeFileSync(serviceWorkerPath, content);
                        }
                    });
                }
            }] : [])
        ],

        stats: {
            colors: true,
            modules: false,
            children: false,
            chunks: false,
            chunkModules: false
        },

        performance: {
            hints: isProduction ? 'warning' : false,
            maxEntrypointSize: 512000,
            maxAssetSize: 512000
        }
    };
};
