const HtmlWebpackPlugin = require('html-webpack-plugin')
const { baseDomain } = require('./env')

module.exports = ({ entrypoint, ...options }) =>
  new HtmlWebpackPlugin({
    inject: false,
    template: 'src/entrypoints/index.ejs',
    templateParameters: (compilation) => {
      const group = compilation.namedChunkGroups.get(entrypoint)
      const files = group.getFiles().filter((file) => !file.endsWith('.map'))

      const baseUrl = process.env.DEPLOY_PRIME_URL || `https://${baseDomain()}`
      const pathName = (options.filename || '').replace(/index\.html$/, '')
      const pageUrl = baseUrl + '/' + pathName

      return {
        files,
        options,
        baseUrl,
        pageUrl,
      }
    },
    ...options,
  })
