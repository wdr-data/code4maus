/* eslint-disable no-console */
const fs = require('fs')
const path = require('path')
const { parseArgs } = require('util')
const {
  assetDirectory,
  requiredAssets,
  contentTypes,
  validateContent,
  readAsset,
  inspectAssets,
  assertComplete,
  parallel,
} = require('./lib/local-assets')

async function downloadAssets(assets, options = {}) {
  const {
    directory = assetDirectory,
    source = 'https://dev.maus.metahost.org',
  } = options
  const base = new URL(source)
  if (!['https:', 'http:'].includes(base.protocol)) {
    throw new Error('--source must be an HTTP(S) URL')
  }
  const { missing } = inspectAssets(assets, options)
  fs.mkdirSync(directory, { recursive: true })
  const errors = []
  await parallel(missing, async (name) => {
    const target = path.join(directory, name)
    const temporary = `${target}.partial-${process.pid}`
    try {
      const response = await fetch(new URL(`/data/assets/${name}`, base), {
        signal: AbortSignal.timeout(30000),
      })
      if (
        !response.ok ||
        (response.headers.get('content-type') || '').includes('text/html')
      ) {
        throw new Error(
          `${name}: expected media, received HTTP ${
            response.status
          } (${response.headers.get('content-type')})`
        )
      }
      const body = Buffer.from(await response.arrayBuffer())
      validateContent(name, body)
      fs.writeFileSync(temporary, body, { flag: 'wx' })
      // Never replace an existing file, including one supplied during the download.
      fs.copyFileSync(temporary, target, fs.constants.COPYFILE_EXCL)
    } catch (error) {
      errors.push(error.message)
    } finally {
      fs.rmSync(temporary, { force: true })
    }
  })
  if (errors.length) throw new Error(errors.sort().join('\n'))
  assertComplete(assets, options)
  return missing.length
}

async function uploadAssets(s3, bucket, assets, options = {}) {
  assertComplete(assets, options)
  const missing = []
  const conflicts = []
  // Inspect every referenced object before writing. Never prune this shared prefix:
  // saved user projects can reference assets that are absent from the source tree.
  await parallel(assets, async (name) => {
    try {
      const object = await s3
        .getObject({ Bucket: bucket, Key: `data/assets/${name}` })
        .promise()
      if (!Buffer.from(object.Body).equals(readAsset(name, options))) {
        conflicts.push(name)
      }
    } catch (error) {
      if (error.code !== 'NoSuchKey') throw error
      missing.push(name)
    }
  })
  if (conflicts.length) {
    throw new Error(
      `Existing bucket assets differ; nothing uploaded:\n${conflicts
        .sort()
        .join('\n')}`
    )
  }
  if (!options.dryRun) {
    await parallel(missing, async (name) => {
      await s3
        .putObject({
          Bucket: bucket,
          Key: `data/assets/${name}`,
          Body: readAsset(name, options),
          ContentType: contentTypes[path.extname(name).slice(1)],
          // A concurrent upload must not be overwritten after the check above.
          IfNoneMatch: '*',
        })
        .promise()
    })
  }
  return missing.sort()
}

function checkAssets(assets, { prune = false, ...options } = {}) {
  const { directory = assetDirectory } = options
  const report = inspectAssets(assets, options)
  if (prune) {
    for (const name of report.unreferenced) {
      fs.unlinkSync(path.join(directory, name))
    }
  }
  return report
}

async function main() {
  const [command, ...args] = process.argv.slice(2)
  const commands = {
    download: { source: { type: 'string' } },
    check: { prune: { type: 'boolean', default: false } },
    upload: {
      bucket: { type: 'string' },
      'dry-run': { type: 'boolean', default: false },
    },
  }
  if (!Object.hasOwn(commands, command || '')) {
    throw new Error(
      'Usage: yarn assets:download [--source <site-url>] | assets:check [--prune] | assets:upload --bucket <bucket-name> [--dry-run]'
    )
  }
  const { values } = parseArgs({ args, options: commands[command] })
  const assets = await requiredAssets()
  if (command === 'download') {
    const count = await downloadAssets(assets, values)
    console.log(
      `${count} assets downloaded; all ${assets.length} required assets available.`
    )
  } else if (command === 'check') {
    const { missing, invalid, unreferenced } = checkAssets(assets, values)
    console.log(
      `${assets.length - missing.length - invalid.length}/${
        assets.length
      } required assets available (including bundled default media).`
    )
    for (const name of missing) console.error(`Missing: ${name}`)
    for (const { message } of invalid) console.error(message)
    for (const name of unreferenced) {
      console.log(
        `${
          values.prune ? 'Removed' : 'Not referenced by this checkout'
        }: ${name}`
      )
    }
    if (missing.length || invalid.length) process.exitCode = 1
  } else {
    if (!values.bucket)
      throw new Error('Specify the destination with --bucket <bucket-name>.')
    process.env.AWS_SDK_LOAD_CONFIG = '1'
    const AWS = require('aws-sdk')
    const s3 = new AWS.S3({ region: process.env.AWS_REGION || 'eu-central-1' })
    const missing = await uploadAssets(s3, values.bucket, assets, {
      dryRun: values['dry-run'],
    })
    console.log(
      `${values.bucket}: ${missing.length} assets ${
        values['dry-run'] ? 'to upload' : 'uploaded'
      }, ${assets.length - missing.length} already present.`
    )
    if (values['dry-run'])
      missing.forEach((name) => console.log(`data/assets/${name}`))
  }
  for (const { name, actual } of inspectAssets(assets).mismatched) {
    console.warn(
      `Warning: ${name} has MD5 ${actual}; its filename hash differs.`
    )
  }
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error.message)
    process.exitCode = 1
  })
}

module.exports = { downloadAssets, uploadAssets, checkAssets }
