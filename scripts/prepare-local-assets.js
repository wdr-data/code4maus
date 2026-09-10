/* eslint-disable no-console */
const fs = require('fs')
const path = require('path')
const { parseArgs } = require('util')
const {
  root,
  assetDirectory,
  requiredAssets,
  parallel,
} = require('./lib/local-assets')

async function main() {
  const { values } = parseArgs({
    options: {
      from: { type: 'string', multiple: true, default: [] },
      download: { type: 'boolean', default: false },
      check: { type: 'boolean', default: false },
      bucket: {
        type: 'string',
        default: 'pmdm-projectbucket-dev-391322831368',
      },
    },
  })
  if (values.check && (values.download || values.from.length)) {
    throw new Error('--check cannot be combined with --from or --download')
  }
  const assets = await requiredAssets()
  const available = (name) => {
    try {
      const stat = fs.statSync(path.join(assetDirectory, name))
      return stat.isFile() && stat.size > 0
    } catch (_error) {
      return false
    }
  }
  let copied = 0
  let downloaded = 0
  if (!values.check) {
    fs.mkdirSync(assetDirectory, { recursive: true })
    const sources = values.from
      .map((directory) => path.resolve(directory))
      .concat(path.join(root, 'assets/project-assets'))
    for (const name of assets.filter((name) => !available(name))) {
      const source = sources
        .map((directory) => path.join(directory, name))
        .find(
          (file) =>
            fs.existsSync(file) &&
            fs.statSync(file).isFile() &&
            fs.statSync(file).size > 0
        )
      if (source) {
        fs.copyFileSync(source, path.join(assetDirectory, name))
        copied++
      }
    }
    const missing = assets.filter((name) => !available(name))
    if (values.download && missing.length) {
      // This explicit preparation step reads AWS; Compose never needs AWS access.
      process.env.AWS_SDK_LOAD_CONFIG = '1'
      const AWS = require('aws-sdk')
      const credentials =
        await new AWS.CredentialProviderChain().resolvePromise()
      const s3 = new AWS.S3({
        region: process.env.AWS_REGION || 'eu-central-1',
        credentials,
      })
      await parallel(missing, async (name) => {
        const object = await s3
          .getObject({ Bucket: values.bucket, Key: `data/assets/${name}` })
          .promise()
        if (
          !object.Body.length ||
          (object.ContentType || '').startsWith('text/html')
        ) {
          throw new Error(`Unexpected asset content for ${name}`)
        }
        const target = path.join(assetDirectory, name)
        const temporary = `${target}.partial-${process.pid}`
        fs.writeFileSync(temporary, object.Body)
        fs.renameSync(temporary, target)
        downloaded++
      })
    }
  }
  const missing = assets.filter((name) => !available(name))
  console.log(
    `${assets.length - missing.length}/${
      assets.length
    } required assets available in assets/runtime (${copied} copied, ${downloaded} downloaded).`
  )
  if (missing.length) {
    console.error('Missing assets:\n' + missing.join('\n'))
    throw new Error(
      'Provide an asset copy with --from <directory>, or use AWS_PROFILE=<profile> yarn assets:prepare --download.'
    )
  }
}

main().catch((error) => {
  console.error(error.message)
  process.exitCode = 1
})
