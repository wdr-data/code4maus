const webpackConfig = require('../webpack.config')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  webpackFinal: async (config, { configType }) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.

    config.module = webpackConfig.module

    config.plugins.push(
      new CopyWebpackPlugin([
        {
          from: 'static',
          to: 'static',
        },
      ])
    )

    // Return the altered config
    return config
  },
}
