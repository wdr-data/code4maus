/* eslint-disable import/no-commonjs */
const babelConfig = require('./babel.backend')

require('dotenv').config({ silent: true, path: '.env.backend' })

module.exports = {
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
