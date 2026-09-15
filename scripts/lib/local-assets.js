const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const { getAllAssets } = require('./assets')

const root = path.resolve(__dirname, '../..')
const assetDirectory = path.join(root, 'assets/runtime')
const defaultDirectory = path.join(root, 'assets/project-assets')
const contentTypes = {
  svg: 'image/svg+xml',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  wav: 'audio/wav',
  mp3: 'audio/mpeg',
}

function validateName(name) {
  if (!/^[a-f0-9]{32}\.(svg|png|jpg|jpeg|gif|wav|mp3)$/.test(name)) {
    throw new Error(`Invalid asset filename in source: ${name}`)
  }
}

async function requiredAssets() {
  const assets = await getAllAssets()
  assets.forEach(validateName)
  return assets.sort()
}

function validateContent(name, body) {
  validateName(name)
  if (
    !body.length ||
    /^\s*(?:<!doctype html|<html[\s>])/i.test(body.toString('utf8', 0, 512))
  ) {
    throw new Error(
      `${name}: expected nonempty media, received empty content or HTML`
    )
  }
}

function readAsset(
  name,
  { directory = assetDirectory, bundledDirectory = defaultDirectory } = {}
) {
  validateName(name)
  const local = path.join(directory, name)
  const file = fs.existsSync(local) ? local : path.join(bundledDirectory, name)
  const body = fs.readFileSync(file)
  validateContent(name, body)
  return body
}

function inspectAssets(assets, options = {}) {
  const { directory = assetDirectory } = options
  const missing = []
  const invalid = []
  const mismatched = []
  for (const name of assets) {
    try {
      const body = readAsset(name, options)
      const actual = crypto.createHash('md5').update(body).digest('hex')
      if (actual !== path.parse(name).name) mismatched.push({ name, actual })
    } catch (error) {
      if (error.code === 'ENOENT') missing.push(name)
      else invalid.push({ name, message: error.message })
    }
  }
  const required = new Set(assets)
  const unreferenced = fs.existsSync(directory)
    ? fs
        .readdirSync(directory, { withFileTypes: true })
        .filter(
          (entry) =>
            entry.isFile() &&
            entry.name !== '.gitkeep' &&
            !required.has(entry.name)
        )
        .map((entry) => entry.name)
        .sort()
    : []
  return { missing, invalid, mismatched, unreferenced }
}

function assertComplete(assets, options) {
  const { missing, invalid } = inspectAssets(assets, options)
  if (missing.length || invalid.length) {
    throw new Error(
      [
        ...missing.map((name) => `Missing: ${name}`),
        ...invalid.map(({ message }) => message),
        'Run yarn assets:download for missing files; resolve invalid files before continuing.',
      ].join('\n')
    )
  }
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

module.exports = {
  assetDirectory,
  requiredAssets,
  contentTypes,
  validateContent,
  readAsset,
  inspectAssets,
  assertComplete,
  parallel,
}
