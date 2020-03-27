require('dotenv').config()

const path = require('path')
const webpack = require('webpack')
const envsub = require('envsubstr')

// Plugins
const CopyWebpackPlugin = require('copy-webpack-plugin')
const Visualizer = require('webpack-visualizer-plugin')
const { GenerateSW } = require('workbox-webpack-plugin')

// Custom Plugins
const customHtmlPlugin = require('./scripts/custom-html-plugin')
const GenerateS3SWPrecachePlugin = require('./scripts/generate-s3-sw-precache-plugin')

const branch = process.env.BRANCH || process.env.TRAVIS_BRANCH
const bucketSuffix = branch === 'production' ? 'prod' : 'staging'
const bucketUrl = `https://${
  process.env.S3_BUCKET_PREFIX
}-${bucketSuffix}.s3.dualstack.${
  process.env.FUNCTIONS_AWS_REGION || process.env.AWS_REGION
}.amazonaws.com`

const enableServiceWorker =
  'ENABLE_SERVICE_WORKER' in process.env ||
  process.env.NODE_ENV === 'production'

// fix for Netlify, where we cannot define AWS_REGION in the environment
if ('FUNCTIONS_AWS_REGION' in process.env) {
  process.env.AWS_REGION = process.env.FUNCTIONS_AWS_REGION
}

const isEnvProduction = process.env.NODE_ENV === 'production'

module.exports = {
  mode: isEnvProduction ? 'production' : 'development',
  devtool: 'source-map',
  devServer: {
    contentBase: path.resolve(__dirname, 'build'),
    host: '0.0.0.0',
    port: process.env.PORT || 8601,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
      },
      '/data': {
        target: bucketUrl,
        changeOrigin: true,
      },
    },
    historyApiFallback: true,
    watchOptions:
      process.env.DOCKER_WATCH === 1
        ? {
            aggregateTimeout: 300,
            poll: 1000,
          }
        : {},
  },
  entry: {
    app: './src/entrypoints/index.jsx',
    sharingpage: './src/entrypoints/sharingpage.jsx',
    settings: './src/entrypoints/settings.jsx',
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].[contenthash].js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        include: [
          path.resolve(__dirname, '.storybook'),
          path.resolve(__dirname, 'src'),
          /node_modules\/scratch-[^\\/]+[\\/]src/,
        ],
        options: {
          // Explicitly disable babelrc so we don't catch various config
          // in much lower dependencies.
          babelrc: false,
        },
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[name]_[local]_[hash:base64:5]',
                mode: 'local',
              },
              importLoaders: 1,
              localsConvention: 'camelCaseOnly',
            },
          },
          'postcss-loader',
        ],
      },
      {
        test: /\.(png|wav|gif|jpg|mp4)$/,
        loader: 'file-loader',
        options: {
          name: (file) => {
            const matches = file.match(/\/src\/lib\/edu\/([a-zA-Z0-9]+)\//)
            if (matches !== null) {
              return `edu/${matches[1]}/[hash].[ext]`
            }
            return '[hash].[ext]'
          },
          outputPath: 'static/assets/',
        },
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'static/assets/',
            },
          },
          'svgo-loader',
        ],
      },
      {
        test: /\.md$/,
        use: ['babel-loader', 'react-markdown-loader'],
      },
      {
        test: require.resolve('zepto'),
        loader: 'imports-loader?this=>window',
      },
    ],
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.DEBUG': Boolean(process.env.DEBUG),
      'process.env.ENABLE_TRACKING': Boolean(branch === 'production'),
    }),
    customHtmlPlugin({
      entrypoint: 'app',
      title: 'Programmieren mit der Maus',
    }),
    customHtmlPlugin({
      entrypoint: 'sharingpage',
      filename: 'teilen/index.html',
      title: 'Programmieren mit der Maus',
    }),
    customHtmlPlugin({
      entrypoint: 'settings',
      filename: 'settings/index.html',
      title: 'Einstellungen | Programmieren mit der Maus',
    }),
    new CopyWebpackPlugin([
      {
        from: 'assets/img/favicon.png',
        to: '',
      },
      {
        from: 'node_modules/scratch-blocks/media',
        to: 'static/blocks-media',
        ignore: ['icons/set-*', 'icons/wedo_*', 'extensions/*'],
      },
      {
        from: 'assets/blocks-media',
        to: 'static/blocks-media',
      },
      {
        from: 'static',
        to: 'static',
      },
    ]),
    new CopyWebpackPlugin([
      {
        from: '_redirects',
        transform: (content) => envsub(content.toString()),
      },
    ]),
    new Visualizer({
      filename: 'statistics.html',
    }),
  ].concat(
    enableServiceWorker
      ? [
          new GenerateSW({
            importWorkboxFrom: 'local',
            navigateFallback: '/index.html',
            navigateFallbackBlacklist: [/^\/data\//],
            exclude: [
              /\.map$/,
              /^manifest.*\.js$/,
              /_redirects$/,
              /data\/projects\/[^/]+\/index\.json$/,
              /\/1x1\.gif$/,
              /^static\/assets\/edu\/beispiel/,
            ],
            clientsClaim: true,
            skipWaiting: true,
            importScripts: ['s3-manifest.[hash].js', '/static/sw-helper.js'],
            cleanupOutdatedCaches: true,
            excludeChunks: ['settings', 'sharingpage', 'mobile-screen'],
          }),
          new GenerateS3SWPrecachePlugin({
            filename: 's3-manifest.[hash].js',
          }),
        ]
      : []
  ),
}
