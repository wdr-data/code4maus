/* eslint-disable no-console */
const fsL = require('fs')
const path = require('path')
const request = require('request')
const { getAllAssets } = require('./lib/assets')

const fs = fsL.promises

const bucketUrl =
  `https://${process.env.ASSET_BUCKET}` +
  `.s3.dualstack.${
    process.env.FUNCTIONS_AWS_REGION || process.env.AWS_REGION
  }.amazonaws.com`

const main = async () => {
  const assets = await getAllAssets()

  const outPath = path.resolve(__dirname, '../.cache/data/assets')
  let writtenFileCount = 0
  let existingFileCount = 0
  await Promise.all(
    assets.map(async (asset) => {
      const writePath = path.join(outPath, asset)
      try {
        const exists = (await fs.stat(writePath)).isFile()
        if (exists) {
          existingFileCount++
          return
        }
      } catch (e) {} // eslint-disable-line no-empty

      return new Promise((resolve, reject) => {
        const req = request(`${bucketUrl}/data/assets/${asset}`)
        const write = fsL.createWriteStream(writePath)
        let aborted = false
        const stopStream = (e) => {
          aborted = true
          req.abort()
          write.end(() => {
            fs.unlink(writePath).then(() => reject(e))
          })
        }
        req
          .on('error', stopStream)
          .on('response', (response) => {
            if (response.statusCode !== 200) {
              stopStream(new Error('Response status code indicates failure.'))
            }
          })
          .pipe(write)
          .on('error', stopStream)
          .on('finish', () => !aborted && resolve())
      })
        .then(() => writtenFileCount++)
        .catch(() => console.warn('Asset not found:', asset))
    })
  )
  console.log(
    `Done. ${existingFileCount} existed. Written ${writtenFileCount} new files.`
  )
}

main().catch(console.error)
