/* eslint-disable import/no-commonjs */
const webpack = require('webpack');
const fs = require('fs');
const path = require('path');
const babelConfig = require('./babel.backend');
require('dotenv').config({ silent: true, path: '.env.backend' });

const bucketSuffix = process.env.BRANCH === 'production' ? 'prod' : 'staging';
const bucket = `${process.env.S3_BUCKET_PREFIX}-${bucketSuffix}`;

module.exports = {
    entry: () =>
        fs.readdirSync(path.join(__dirname, 'src/backend'))
            .filter((file) => !file.match(/^\./) && file.match(/\.js$/))
            .reduce((entries, file) => {
                const name = file.replace(/\.js$/, '');
                entries[name] = `./${name}`;
                return entries;
            }, {}),
    module: {
        rules: [
            {
                test: /\.js?$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: babelConfig,
                },
            },
        ],
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.S3_BUCKET_PROJECTS': JSON.stringify(bucket),
        }),
    ],
    externals: 'aws-sdk',
};
