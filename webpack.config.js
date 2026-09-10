require('dotenv').config()

const path = require('path')
const webpack = require('webpack')
const envsub = require('envsubstr')

// Plugins
const CopyWebpackPlugin = require('copy-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const { GenerateSW } = require('workbox-webpack-plugin')

// Custom Plugins
const customHtmlPlugin = require('./scripts/custom-html-plugin')
// const { getAssetsList } = require('./scripts/generate-s3-sw-precache-plugin')

const branch = process.env.BRANCH || process.env.TRAVIS_BRANCH

// Dev server proxies /data and /api to a deployed stage (see .env.example).
// API_PROXY_TARGET overrides /api to use the local backend.
const proxyTarget = process.env.PROXY_TARGET
const apiProxyTarget = process.env.API_PROXY_TARGET || proxyTarget

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
    static: {
      directory: path.join(__dirname, 'build'),
      watch:
        process.env.DOCKER_WATCH === 1
          ? {
              aggregateTimeout: 300,
              poll: 1000,
            }
          : {},
    },
    host: '0.0.0.0',
    port: process.env.PORT || 8601,
    proxy: {
      '/api': {
        target: apiProxyTarget,
        changeOrigin: true,
        secure: false,
      },
      '/data': {
        target: proxyTarget,
        changeOrigin: true,
      },
    },
    historyApiFallback: true,
    client: {
      overlay: {
        // Benign browser notice (triggered e.g. by react-tooltip), not an app error.
        runtimeErrors: (error) =>
          !/ResizeObserver loop/.test(error?.message ?? ''),
      },
    },
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
  target: 'web',
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
        type: 'asset/resource',
        exclude: [path.resolve(__dirname, 'assets/project-assets')],
        generator: {
          filename: (pathData) => {
            const matches = pathData.filename.match(
              /\/src\/lib\/edu\/([a-zA-Z0-9]+)\//
            )
            if (matches !== null) {
              return `static/assets/edu/${matches[1]}/[hash][ext]`
            }
            return 'static/assets/[hash][ext]'
          },
        },
      },
      {
        test: /\.svg$/,
        issuer: /\.[jt]sx?$/,
        resourceQuery: /component/, // *.svg?component
        use: [
          {
            loader: '@svgr/webpack',
            options: {
              outDir: 'static/assets',
              icon: true,
              dimensions: false,
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        type: 'asset/source',
        include: [path.resolve(__dirname, 'assets/project-assets')],
        resourceQuery: /raw/, // *.svg?raw
        generator: {
          filename: 'static/assets/[hash][ext]',
        },
      },
      {
        test: /\.svg$/i,
        type: 'asset/resource',
        resourceQuery: { not: [/component/, /raw/] },
        generator: {
          filename: 'static/assets/[hash][ext]',
        },
      },
      {
        test: /\.md$/,
        use: ['babel-loader', 'react-markdown-loader'],
      },
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
      },
      {
        // Prebuilt emscripten worker, shipped as-is and excluded from minification.
        test: /ffmpeg\.js[\\/]ffmpeg-worker-mp4\.js$/,
        type: 'asset/resource',
        generator: {
          filename: 'static/ffmpeg-worker-mp4.[contenthash][ext]',
        },
      },
      {
        test: require.resolve('zepto'),
        use: [
          {
            loader: 'imports-loader',
            options: 'this=>window',
          },
        ],
      },
    ],
  },
  optimization: {
    runtimeChunk: 'single',
    minimizer: [
      new TerserPlugin({
        exclude: /ffmpeg-worker-mp4/,
      }),
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.DEBUG': 'process.env.DEBUG',
      'process.env.ENABLE_TRACKING': JSON.stringify(
        Boolean(branch === 'production')
      ),
      'process.env.BRANCH': JSON.stringify(branch),
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
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'assets/img/favicon.png',
          to: '',
        },
        {
          from: 'node_modules/scratch-blocks/media',
          to: 'static/blocks-media',
          globOptions: {
            ignore: ['icons/set-*', 'icons/wedo_*', 'extensions/*'],
          },
        },
        {
          from: 'assets/blocks-media',
          to: 'static/blocks-media',
        },
        {
          from: 'static',
          to: 'static',
        },
      ],
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: '_redirects',
          transform: (content) => envsub(content.toString()),
        },
      ],
    }),
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
  ].concat(
    enableServiceWorker
      ? [
          new GenerateSW({
            navigateFallback: '/index.html',
            navigateFallbackDenylist: [/^\/data\//],
            exclude: [
              /\.map$/,
              /^manifest.*\.js$/,
              /_redirects$/,
              /\/1x1\.gif$/,
              /^static\/assets\/edu\/beispiel/,
            ],
            runtimeCaching: [
              {
                urlPattern: ({ url }) => {
                  return (
                    url.pathname.startsWith('/data/assets/') ||
                    url.pathname.startsWith('/static/assets')
                  )
                },
                handler: 'CacheFirst',
                options: {
                  cacheName: 'assets',
                  cacheableResponse: {
                    statuses: [0, 200],
                  },
                },
              },
              {
                urlPattern: new RegExp(/data\/projects\/[^/]+\/index\.json$/),
                handler: 'NetworkFirst',
                options: {
                  cacheName: 'projects',
                },
              },
            ],
            clientsClaim: true,
            skipWaiting: true,
            importScripts: ['/static/sw-helper.js'],
            cleanupOutdatedCaches: true,
            excludeChunks: ['settings', 'sharingpage', 'mobile-screen'],
            maximumFileSizeToCacheInBytes: 19 * 1024 * 1024,
          }),
        ]
      : []
  ),
  resolve: {
    fallback: {
      path: false,
      crypto: false,
      stream: false,
      buffer: false,
      fs: false,
      tls: false,
      net: false,
      zlib: false,
      http: false,
      https: false,
    },
  },
}
