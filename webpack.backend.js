/* eslint-disable import/no-commonjs */
const slsw = require('serverless-webpack')
const babelConfig = require('./babel.backend')

require('dotenv').config({ silent: true, path: '.env.backend' })

module.exports = {
  entry: slsw.lib.entries,
  mode: 'production',
  target: 'node',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: babelConfig,
        },
      },
      {
        test: /\.ejs$/,
        use: {
          loader: 'ejs-loader',
        },
      },
    ],
  },
  externals: 'aws-sdk',
}
