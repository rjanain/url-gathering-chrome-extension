const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");


module.exports = {
    entry: {
        serviceWorker: './src/background/serviceWorker.js',
        contentScript: './src/content/contentScript.js',
        popup: './src/popup/index.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist/vendor'),
        filename: '[name].js',
		clean: true,
    },
    module: {
        rules: [{
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: [
                        '@babel/preset-env',
                        '@babel/preset-react'
                    ],
                }
            }
        }

    ],
    },
    plugins: [
    new CopyPlugin({
        patterns: [
            {
                from: "public",
                to: path.resolve(__dirname, 'dist')
            },
        ],
    }),

    ],

};
