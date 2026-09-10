/* eslint-disable no-console */
const fs = require('fs')
const path = require('path')
const AWS = require('aws-sdk')
const {
  assetDirectory,
  requiredAssets,
  parallel,
} = require('./lib/local-assets')

const contentTypes = {
  svg: 'image/svg+xml',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  wav: 'audio/wav',
  mp3: 'audio/mpeg',
}

async function main() {
  const endpoint = process.env.STORAGE_ENDPOINT
  if (
    !endpoint ||
    !['storage', 'localhost', '127.0.0.1'].includes(new URL(endpoint).hostname)
  ) {
    throw new Error(
      'Seeding requires a local STORAGE_ENDPOINT (storage, localhost, or 127.0.0.1).'
    )
  }
  const bucket = process.env.STORAGE_BUCKET
  if (!bucket) throw new Error('Set STORAGE_BUCKET for the local seed bucket.')
  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    throw new Error(
      'Set the local storage credentials, or run docker compose run --rm storage-seed.'
    )
  }
  const assets = await requiredAssets()
  const missing = assets.filter((name) => {
    try {
      const stat = fs.statSync(path.join(assetDirectory, name))
      return !stat.isFile() || stat.size === 0
    } catch (_error) {
      return true
    }
  })
  if (missing.length)
    throw new Error(
      `${missing.length} required assets missing. Run yarn assets:prepare --from <asset-directory> (or --download) on the host first.`
    )

  const s3 = new AWS.S3({
    endpoint,
    region: process.env.AWS_REGION || 'eu-central-1',
    s3ForcePathStyle: true,
    signatureVersion: 'v4',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    httpOptions: { connectTimeout: 1000, timeout: 2000 },
    maxRetries: 0,
  })
  for (let attempt = 0; ; attempt++) {
    try {
      await s3.listBuckets().promise()
      break
    } catch (error) {
      if (attempt >= 29) throw error
      if (attempt % 5 === 0) console.log('Waiting for local S3 storage...')
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
  }
  try {
    await s3.headBucket({ Bucket: bucket }).promise()
  } catch (error) {
    if (error.statusCode !== 404) throw error
    await s3.createBucket({ Bucket: bucket }).promise()
  }
  await s3
    .putBucketCors({
      Bucket: bucket,
      CORSConfiguration: {
        CORSRules: [
          {
            AllowedOrigins: ['http://localhost:8601'],
            AllowedMethods: ['GET', 'HEAD', 'PUT'],
            AllowedHeaders: ['content-type'],
            MaxAgeSeconds: 1800,
          },
        ],
      },
    })
    .promise()
  await s3
    .putBucketPolicy({
      Bucket: bucket,
      Policy: JSON.stringify({
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: '*',
            Action: 's3:GetObject',
            Resource: `arn:aws:s3:::${bucket}/data/*`,
          },
        ],
      }),
    })
    .promise()
  let uploaded = 0
  await parallel(assets, async (name) => {
    const params = { Bucket: bucket, Key: `data/assets/${name}` }
    try {
      await s3.headObject(params).promise()
      return
    } catch (error) {
      if (error.statusCode !== 404) throw error
    }
    await s3
      .putObject({
        ...params,
        Body: fs.readFileSync(path.join(assetDirectory, name)),
        ContentType: contentTypes[path.extname(name).slice(1).toLowerCase()],
      })
      .promise()
    uploaded++
  })
  console.log(
    `Local bucket ${bucket} ready: ${uploaded} assets uploaded, ${
      assets.length - uploaded
    } already present.`
  )
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
