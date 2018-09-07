/* eslint-disable import/no-commonjs */
const slsw = require('serverless-webpack');

require('dotenv').config({ silent: true });

module.exports = {
    entry: slsw.lib.entries,
    mode: 'production',
    target: 'node',
    module: {
        rules: [
            {
                test: /\.js?$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [ [ 'env', { targets: { node: '8.10.0' } } ] ],
                        plugins: [ 'transform-object-rest-spread' ],
                        babelrc: false,
                    },
                },
            },
        ],
    },
    externals: 'aws-sdk',
};
