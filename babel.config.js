// module.exports = {
//   plugins: [
//     '@babel/syntax-dynamic-import',
//     '@babel/transform-async-to-generator',
//     [
//       'react-intl',
//       {
//         messagesDir: './translations/messages/',
//       },
//     ],
//   ],
//   presets: ['@babel/env', '@babel/react'],
// }

// for react-intl v3
module.exports = {
  plugins: [
    '@babel/syntax-dynamic-import',
    '@babel/transform-async-to-generator',
    [
      'formatjs',
      {
        // No `ast: true`: react-intl 2 renders defaultMessage only as a string.
        idInterpolationPattern: '[sha512:contenthash:base64:6]',
      },
    ],
  ],
  presets: ['@babel/env', '@babel/react'],
}
