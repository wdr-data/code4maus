require('@babel/polyfill')
require('@babel/register')({
  configFile: false,
  babelrc: false,
  presets: [['@babel/env', { targets: { node: 8 } }]],
  plugins: [['import-noop', { extensions: ['mp3', 'svg', 'jpg'] }]],
})

const crypto = require('crypto')
const { getAllAssets } = require('../lib/assets')
const defaultAssets = require('../../src/lib/default-project/').default

const defaultAssetIDs = defaultAssets.map(
  (asset) => `${asset.id}.${asset.dataFormat.toLowerCase()}`
)

function GenerateS3SWPrecachePlugin(options) {
  this.filename = options.filename || 's3-manifest.[hash].js'
}

GenerateS3SWPrecachePlugin.prototype.apply = function (compiler) {
  let filenameTemplate = this.filename
  compiler.plugin('emit', function (compilation, callback) {
    getAllAssets()
      .then((files) => files.filter((file) => !defaultAssetIDs.includes(file)))
      .then((files) => {
        const list = JSON.stringify(files.map((file) => '/data/assets/' + file))
        const hash = crypto.createHash('md5').update(list, 'utf8').digest('hex')
        const filename = filenameTemplate.replace('[hash]', hash)
        const absUrl = '/' + filename

        compilation.assets[filename] = {
          source: function () {
            return `self.__precacheManifest = (self.__precacheManifest || []).concat(${list});`
          },
          size: function () {
            return this.source().length
          },
        }

        const swSource = compilation.assets['service-worker.js'].source
        compilation.assets['service-worker.js'].source = function () {
          return swSource().replace(filenameTemplate, absUrl)
        }
        callback()
      })
      .catch((e) => callback(e))
  })
}

module.exports = GenerateS3SWPrecachePlugin
