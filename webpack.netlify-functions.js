/* eslint-disable import/no-commonjs */
const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
require('dotenv').config({ silent: true, path: '.env.backend' })

const bucketSuffix = process.env.BRANCH === 'production' ? 'prod' : 'staging'
const bucket = `${process.env.S3_BUCKET_PREFIX}-${bucketSuffix}`

const backendWebpack = require('./webpack.backend.js')

const entries = fs
  .readdirSync(path.join(__dirname, 'src/backend'))
  .filter((file) => !file.match(/^\./) && file.match(/\.js$/))
  .reduce((entries, file) => {
    const name = file.replace(/\.js$/, '')
    entries[name] = `/src/backend/${file}`
    return entries
  }, {})

module.exports = {
  mode: 'production',
  entry: entries,
  module: backendWebpack.module,
  plugins: [
    new webpack.DefinePlugin({
      'process.env.S3_BUCKET_PROJECTS': JSON.stringify(bucket),
      'process.env.ASSET_BASEURL': JSON.stringify(process.env.DEPLOY_PRIME_URL),
      'process.env.API_HOST': JSON.stringify(process.env.DEPLOY_PRIME_URL),
    }),
  ],
  externals: 'aws-sdk',
}
