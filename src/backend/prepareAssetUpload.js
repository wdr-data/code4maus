import initS3 from './lib/s3'
import * as respond from './lib/respond'

const customEndpoint =
  'STORAGE_ENDPOINT_FRONTEND' in process.env
    ? process.env.STORAGE_ENDPOINT_FRONTEND
    : null
const s3 = initS3(customEndpoint)

export const handler = async (event) => {
  const { filename } = JSON.parse(event.body)

  console.log("filename for handler", filename)

  if (!filename) {
    return respond.error(400, "Missing request body key 'filename'.")
  }

  const params = {
    Bucket: process.env.STORAGE_BUCKET || process.env.S3_BUCKET_PROJECTS,
    Key: `data/assets/${filename}`,
  }

  console.log("params", params)

  try {
    await s3.headObject(params).promise()
    return respond.error(409, 'Asset already exists.', { exists: true })
  } catch (_error) {
    // Asset does not exist, which is good. Just continue.
  }

  const uploadUrl = s3.getSignedUrl('putObject', params)
  return respond.json(200, { uploadUrl })
}
