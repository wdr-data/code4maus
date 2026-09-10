const path = require('path')
const { getAllAssets } = require('./assets')

const root = path.resolve(__dirname, '../..')
const assetDirectory = path.join(root, 'assets/runtime')

async function requiredAssets() {
  const assets = await getAllAssets()
  for (const asset of assets) {
    if (
      typeof asset !== 'string' ||
      !/^[a-f0-9]+\.(svg|png|jpg|jpeg|gif|wav|mp3)$/i.test(asset)
    ) {
      throw new Error(`Invalid asset filename in source: ${asset}`)
    }
  }
  return assets.sort()
}

async function parallel(items, operation) {
  let index = 0
  await Promise.all(
    Array.from({ length: Math.min(6, items.length) }, async () => {
      while (index < items.length) {
        const item = items[index++]
        await operation(item)
      }
    })
  )
}

module.exports = { root, assetDirectory, requiredAssets, parallel }
