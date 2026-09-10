import AWS from 'aws-sdk'
import initS3 from './s3'

jest.mock('aws-sdk', () => ({ S3: jest.fn((options) => ({ options })) }))

const originalEnv = process.env
beforeEach(() => {
  process.env = {
    ...originalEnv,
    STORAGE_BUCKET: 'local-test',
    STORAGE_ENDPOINT: 'http://storage:8333',
  }
  delete process.env.FUNCTIONS_AWS_ACCESS_KEY_ID
  delete process.env.FUNCTIONS_AWS_SECRET_ACCESS_KEY
  delete process.env.FUNCTIONS_AWS_REGION
  AWS.S3.mockClear()
})
afterEach(() => {
  process.env = originalEnv
})

test('browser signing endpoint does not change later internal clients', () => {
  const internal = initS3()
  const browser = initS3('http://localhost:8333')
  const later = initS3()
  expect(internal.options.endpoint).toBe('http://storage:8333')
  expect(browser.options.endpoint).toBe('http://localhost:8333')
  expect(later.options.endpoint).toBe('http://storage:8333')
  expect(browser.options).toMatchObject({
    s3ForcePathStyle: true,
    signatureVersion: 'v4',
    params: { Bucket: 'local-test' },
  })
})

test('deployed clients retain the AWS endpoint and bucket fallback', () => {
  delete process.env.STORAGE_ENDPOINT
  delete process.env.STORAGE_BUCKET
  process.env.S3_BUCKET_PROJECTS = 'deployed-bucket'
  expect(initS3().options).toEqual({ params: { Bucket: 'deployed-bucket' } })
})
