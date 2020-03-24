const mainConfig = require('../webpack.config')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  module: mainConfig.module,
  plugins: [
    new CopyWebpackPlugin([
      {
        from: 'static',
        to: 'static'
      }
    ])
  ]
}
