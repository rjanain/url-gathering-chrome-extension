const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");


module.exports = {
    entry: {
        serviceWorker: './src/background/serviceWorker.js',
        contentScript: './src/content/contentScript.js',
        popup: './src/popup/index.tsx',
        sidepanel: './src/sidepanel/index.tsx'
    },
    output: {
        path: path.resolve(__dirname, 'dist/vendor'),
        filename: '[name].js',
		clean: true,
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx|ts|tsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                            '@babel/preset-react',
                            '@babel/preset-typescript'
                        ],
                    }
                }
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader',
                ],
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
