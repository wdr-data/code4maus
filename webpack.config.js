const path = require('path');
const webpack = require('webpack');

// Plugins
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const Visualizer = require('webpack-visualizer-plugin');

// PostCss
const autoprefixer = require('autoprefixer');
const postcssVars = require('postcss-simple-vars');
const postcssImport = require('postcss-import');
const postcssMixins = require('postcss-mixins');

require('dotenv').config();
const branch = process.env.BRANCH || process.env.TRAVIS_BRANCH;
const bucketSuffix = branch === 'production' ? 'prod' : 'staging';
const bucketUrl = `https://${process.env.S3_BUCKET_PREFIX}-${bucketSuffix}.s3.dualstack.${process.env.FUNCTIONS_AWS_REGION || process.env.AWS_REGION}.amazonaws.com`;

module.exports = {
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    devtool: 'source-map',
    devServer: {
        contentBase: path.resolve(__dirname, 'build'),
        host: '0.0.0.0',
        port: process.env.PORT || 8601,
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                pathRewrite: {
                    '^/api': '',
                },
            },
            '/data': {
                target: bucketUrl,
                changeOrigin: true,
                pathRewrite: {
                    '^/data': '',
                },
            },
        },
        historyApiFallback: true,
        watchOptions: process.env.DOCKER_WATCH === 1 ? {
            aggregateTimeout: 300,
            poll: 1000,
        } : {},
    },
    entry: {
        'app': './src/playground/index.jsx',
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].[contenthash].js',
        publicPath: '/',
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                include: [ path.resolve(__dirname, 'src'), /node_modules[\\/](@wdr-data[\\/])?scratch-[^\\/]+[\\/]src/ ],
                options: {
                    // Explicitly disable babelrc so we don't catch various config
                    // in much lower dependencies.
                    babelrc: false,
                    plugins: [
                        'syntax-dynamic-import',
                        'transform-async-to-generator',
                        'transform-object-rest-spread',
                        [
                            'react-intl', {
                                messagesDir: './translations/messages/',
                            },
                        ],
                    ],
                    presets: [
                        [
                            'env', { targets: {
                                browsers: [ 'last 3 versions', 'Safari >= 8', 'iOS >= 8' ],
                            } },
                        ],
                        'react',
                    ],
                },
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'style-loader',
                    }, {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            importLoaders: 1,
                            localIdentName: '[name]_[local]_[hash:base64:5]',
                            camelCase: true,
                        },
                    }, {
                        loader: 'postcss-loader',
                        options: {
                            ident: 'postcss',
                            plugins: function() {
                                return [
                                    postcssMixins,
                                    postcssImport,
                                    postcssVars,
                                    autoprefixer({
                                        browsers: [ 'last 3 versions', 'Safari >= 8', 'iOS >= 8' ],
                                    }),
                                ];
                            },
                        },
                    },
                ],
            },
            {
                test: /\.(svg|png|wav|gif|jpg)$/,
                loader: 'file-loader',
                options: {
                    outputPath: 'static/assets/',
                },
            },
            {
                test: /\.md$/,
                use: [
                    {
                        loader: 'babel-loader',
                    },
                    {
                        loader: 'react-markdown-loader',
                    },
                ],
            },
            {
                test: require.resolve('zepto'),
                loader: 'imports-loader?this=>window',
            },
        ],
    },
    optimization: {
        minimizer: [ new UglifyJsPlugin() ],
        splitChunks: {
            chunks: 'all',
        },
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"' + process.env.NODE_ENV + '"',
            'process.env.DEBUG': Boolean(process.env.DEBUG),
            'process.env.ENABLE_TRACKING': JSON.stringify(Boolean(branch === 'production')),
        }),
        new HtmlWebpackPlugin({
            chunks: 'gui',
            template: 'src/playground/index.ejs',
            title: 'Programmieren mit der Maus',
        }),
        new CopyWebpackPlugin([
            {
                from: 'assets/img/favicon.png',
                to: '',
            },
        ]),
        new CopyWebpackPlugin([
            {
                from: 'node_modules/@wdr-data/scratch-blocks/media',
                to: 'static/blocks-media',
            }, {
                from: 'assets/blocks-media',
                to: 'static/blocks-media',
            },
        ]),
        new CopyWebpackPlugin([
            {
                from: '_redirects',
            },
        ]),
        new CopyWebpackPlugin([
            {
                from: 'edu/**/*',
                context: 'src/lib/',
            },
        ]),
        new CopyWebpackPlugin([
            {
                from: 'static',
                to: 'static',
            }, {
                from: 'assets/icons',
                to: 'static/icons',
            },
        ]),
        new Visualizer({
            filename: 'statistics.html',
        }),
    ],
};
