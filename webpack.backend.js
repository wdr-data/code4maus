const webpack = require('webpack');
require('dotenv').config({silent: true});

const bucketSuffix = process.env.BRANCH === 'production' ? 'prod' : 'staging';
const bucket = `${process.env.S3_BUCKET_PREFIX}-${bucketSuffix}`;

module.exports = {
    module: {
        rules: [{
            test: /\.js?$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: [
                        ['env', {targets: {node: '8.10.0'}}]
                    ],
                    plugins: ['transform-object-rest-spread'],
                    babelrc: false
                }
            }
        }]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.S3_BUCKET_PROJECTS': JSON.stringify(bucket)
        })
    ],
    externals: 'aws-sdk'
};
