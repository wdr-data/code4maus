import shortid from 'shortid'
import initS3 from './lib/s3'
import * as respond from './lib/respond'

const s3 = initS3()

export const handler = async (_event) => {
  const bucket = process.env.STORAGE_BUCKET || process.env.S3_BUCKET_PROJECTS

  let unique = false
  let params
  let sharingKey
  for (let i = 0; i < 3; i++) {
    try {
      sharingKey = shortid.generate().substr(0, 5).toLowerCase()
      params = {
        Bucket: bucket,
        Key: `data/sharing/${sharingKey}`,
      }

      // If this throws, the file does not exists, which means we've found a unique id
      await s3.headObject(params).promise()
    } catch (err) {
      unique = true
    }

    if (unique) {
      break
    }
  }

  if (!unique) {
    return respond.error(500, 'Unable to create a unique sharing id.')
  }

  const uploadUrl = s3.getSignedUrl('putObject', params)

  return respond.json(200, { uploadUrl, sharingKey })
}
