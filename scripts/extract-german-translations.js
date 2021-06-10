/* eslint-disable no-console */

global.window = {} // scratch-blocks expects a global window, but this is enough to make it behave

const fs = require('fs')
const path = require('path')
const prettier = require('prettier')
const ScratchBlocks = require('scratch-blocks')

const german = ScratchBlocks.ScratchMsgs.locales.de
const location = path.resolve(__dirname, '../src/monkey/german.json')
const prettyOutput = prettier.format(JSON.stringify(german), { parser: 'json' })

fs.writeFileSync(location, prettyOutput)

console.log('The file has been saved at:', location)
console.log(
  'This did probably overwrite some translations that were changes on purpose. Make sure to check your `git diff` to see if you want to commit any changes.'
)
