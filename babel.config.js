/* eslint-disable array-bracket-newline */
/* eslint-disable array-bracket-spacing */
module.exports = {
  plugins: [
    '@babel/syntax-dynamic-import',
    '@babel/transform-async-to-generator',
    [
      'react-intl',
      {
        messagesDir: './translations/messages/'
      }
    ]
  ],
  presets: [
    [
      '@babel/env',
      { targets: { browsers: ['last 3 versions', 'Safari >= 8', 'iOS >= 8'] } }
    ],
    '@babel/react'
  ]
}
