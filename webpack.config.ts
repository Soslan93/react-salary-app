const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebPackPlugin = require("html-webpack-plugin");

const EVENT = process.env.npm_lifecycle_event;

module.exports = {
    entry: './src/index.tsx',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test : /\.scss$/,
                exclude: /node_modules/,
                use: [
                    process.env.NODE_ENV !== 'production'
                        ? 'style-loader'
                        : MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader"
                    },
                    {
                        loader: "sass-loader"
                    },
                ]
            },
            {
                test: /\.svg$/,
                loader: 'file-loader'
            }
        ],
    },
    plugins: [
        new HtmlWebPackPlugin({
            inject: false,
            hash: true,
            template: './public/index.html',
            filename: 'index.html'
        }),
        new MiniCssExtractPlugin({
            filename: "styles.css",
        })
    ],
    resolve: {
        extensions: [ '.tsx', '.ts', '.js', '.scss' ],
    },
    devServer: {
        historyApiFallback: true,
        contentBase: './'
    }
};
