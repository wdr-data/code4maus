module.exports = {
  plugins: [
    '@babel/syntax-dynamic-import',
    '@babel/transform-async-to-generator',
    [
      'react-intl',
      {
        messagesDir: './translations/messages/',
      },
    ],
  ],
  presets: ['@babel/env', '@babel/react'],
}
