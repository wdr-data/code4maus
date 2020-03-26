// This seems very hacky at first glance, but it's actually the way that ScratchBlocks itself assembles their dist files with Webpack. With this import, we get the ScratchBlocks BEFORE any locales are added.
const ScratchBlocks = require('imports-loader?goog=scratch-blocks/shim/blockly_compressed_vertical.goog,Blockly=scratch-blocks/shim/blockly_compressed_vertical-blocks_compressed!exports-loader?Blockly!scratch-blocks/shim/blocks_compressed_vertical')

// Generate this file by running `node scripts/extract-german-translations.js`
const germanLocale = require('./german.json')

// At this point, `locales` is an empty object, so we add our german locale:
ScratchBlocks.ScratchMsgs.locales.de = germanLocale

module.exports = ScratchBlocks
