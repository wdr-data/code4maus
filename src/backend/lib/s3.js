import AWS from 'aws-sdk'

export default function (endpoint = null) {
  let options = {
    params: {
      Bucket: process.env.STORAGE_BUCKET || process.env.S3_BUCKET_PROJECTS,
    },
  }

  if (
    'FUNCTIONS_AWS_ACCESS_KEY_ID' in process.env &&
    'FUNCTIONS_AWS_SECRET_ACCESS_KEY' in process.env
  ) {
    options = {
      ...options,
      accessKeyId: process.env.FUNCTIONS_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.FUNCTIONS_AWS_SECRET_ACCESS_KEY,
    }
  }

  if ('FUNCTIONS_AWS_REGION' in process.env) {
    options = {
      ...options,
      region: process.env.FUNCTIONS_AWS_REGION,
    }
  }

  const storageEndpoint = endpoint || process.env.STORAGE_ENDPOINT
  if (storageEndpoint) {
    options = {
      ...options,
      endpoint: storageEndpoint,
      s3ForcePathStyle: true,
      signatureVersion: 'v4',
    }
  }

  return new AWS.S3(options)
}
