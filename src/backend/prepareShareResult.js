import initS3 from './lib/s3'
import shortid from 'shortid'

const s3 = initS3()

export const handler = async (event, context, callback) => {
  const bucket = process.env.STORAGE_BUCKET || process.env.S3_BUCKET_PROJECTS

  let unique = false
  let params
  let sharingKey
  for (let i = 0; i < 3; i++) {
    try {
      sharingKey = shortid
        .generate()
        .substr(0, 5)
        .toLowerCase()
      params = {
        Bucket: bucket,
        Key: `data/sharing/${sharingKey}`
      }
      await s3.headObject(params).promise()
    } catch (err) {
      unique = true
    }
    if (unique) {
      break
    }
  }
  if (!unique) {
    return {
      statusCode: 500,
      body: 'unable to find unique id for shared object'
    }
  }

  const presignedUrl = s3.getSignedUrl('putObject', params)
  return {
    statusCode: 200,
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      uploadUrl: presignedUrl,
      sharingKey
    })
  }
}
