import http from 'http'
import initS3 from '../lib/s3'
import { handler as prepareAssetUpload } from '../prepareAssetUpload'
import { handler as prepareShareResult } from '../prepareShareResult'
import { handler as saveProject } from '../saveProject'
import createApp from './app'

jest.mock('../lib/s3', () => {
  const s3 = {
    headObject: jest.fn(),
    getObject: jest.fn(),
    putObject: jest.fn(),
    getSignedUrlPromise: jest.fn(),
  }
  return { __esModule: true, default: () => s3 }
})

const s3 = initS3()
let server
let baseUrl
let errorLog

function post(route, body) {
  return fetch(`${baseUrl}/api/${route}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  })
}

beforeAll(async () => {
  server = http.createServer(
    createApp({ prepareAssetUpload, prepareShareResult, saveProject })
  )
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
  baseUrl = `http://127.0.0.1:${server.address().port}`
})

afterAll(async () => {
  server.closeAllConnections()
  await new Promise((resolve) => server.close(resolve))
})

beforeEach(() => {
  jest.resetAllMocks()
  s3.headObject.mockReturnValue({
    promise: () => Promise.reject({ code: 'NotFound' }),
  })
  s3.getSignedUrlPromise.mockResolvedValue('https://example.invalid/upload')
  errorLog = jest.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => errorLog.mockRestore())

test('health and unknown routes respond without accessing storage', async () => {
  expect(await (await fetch(`${baseUrl}/health`)).json()).toEqual({
    status: 'ok',
  })
  expect((await post('missing', '{}')).status).toBe(404)
  expect((await fetch(`${baseUrl}/api/saveProject`)).status).toBe(404) // GET has no matching route; this endpoint only handles POST
  expect(s3.headObject).not.toHaveBeenCalled()
})

test.each(['{', 'null', '[]', '42'])(
  'rejects invalid JSON payload %s before calling storage',
  async (body) => {
    expect((await post('prepareAssetUpload', body)).status).toBe(400)
    expect(s3.headObject).not.toHaveBeenCalled()
  }
)

test('missing fields preserve handler validation responses', async () => {
  const response = await post('prepareAssetUpload', '{}')
  expect(response.status).toBe(400)
  expect(await response.json()).toEqual({
    error: "Missing request body key 'filename'.",
  })
})

test('accepts project payloads above Express default and writes project/index', async () => {
  s3.putObject.mockReturnValue({ promise: () => Promise.resolve({}) })
  s3.getObject.mockReturnValue({
    promise: () => Promise.reject({ code: 'NoSuchKey' }),
  })
  const response = await post(
    'saveProject',
    JSON.stringify({
      data: JSON.stringify({
        meta: { agent: 'test' },
        notes: 'x'.repeat(150000),
      }),
      userId: 'local-test-user',
      name: 'Local test',
    })
  )
  expect(response.status).toBe(200)
  const { id } = await response.json()
  expect(typeof id).toBe('string')
  expect(s3.putObject).toHaveBeenCalledTimes(2)
  const project = s3.putObject.mock.calls[0][0]
  expect(project.Key).toBe(`data/projects/local-test-user/${id}.json`)
  expect(JSON.parse(project.Body).meta.agent).toBe('')
  expect(s3.putObject.mock.calls[1][0].Key).toBe(
    'data/projects/local-test-user/index.json'
  )
})

test('rejects oversized requests', async () => {
  expect(
    (await post('saveProject', 'x'.repeat(6 * 1024 * 1024 + 1))).status
  ).toBe(413)
  expect(s3.putObject).not.toHaveBeenCalled()
})

test('new assets return an asynchronously signed upload URL', async () => {
  const response = await post('prepareAssetUpload', '{"filename":"test.svg"}')
  expect(response.status).toBe(200)
  expect(response.headers.get('content-type')).toMatch(/application\/json/)
  expect(await response.json()).toEqual({
    uploadUrl: 'https://example.invalid/upload',
  })
  expect(s3.getSignedUrlPromise).toHaveBeenCalledWith(
    'putObject',
    expect.objectContaining({ Key: 'data/assets/test.svg' })
  )
})

test('existing assets retain the 409 response', async () => {
  s3.headObject.mockReturnValue({ promise: () => Promise.resolve({}) })
  const response = await post('prepareAssetUpload', '{"filename":"test.svg"}')
  expect(response.status).toBe(409)
  expect(await response.json()).toEqual({
    error: 'Asset already exists.',
    exists: true,
  })
  expect(s3.getSignedUrlPromise).not.toHaveBeenCalled()
})

test('sharing accepts an empty request body', async () => {
  const response = await post('prepareShareResult')
  expect(response.status).toBe(200)
  expect(await response.json()).toEqual({
    uploadUrl: 'https://example.invalid/upload',
    sharingKey: expect.any(String),
  })
})

test('sharing stops after three collisions', async () => {
  s3.headObject.mockReturnValue({ promise: () => Promise.resolve({}) })
  expect((await post('prepareShareResult')).status).toBe(500)
  expect(s3.headObject).toHaveBeenCalledTimes(3)
  expect(s3.getSignedUrlPromise).not.toHaveBeenCalled()
})

test.each(['prepareAssetUpload', 'prepareShareResult'])(
  '%s surfaces access errors instead of generating an upload URL',
  async (route) => {
    s3.headObject.mockReturnValue({
      promise: () => Promise.reject({ code: 'AccessDenied' }),
    })
    expect((await post(route, '{"filename":"test.svg"}')).status).toBe(500)
    expect(s3.getSignedUrlPromise).not.toHaveBeenCalled()
    expect(errorLog).toHaveBeenCalled()
  }
)

test('signing failures become JSON errors', async () => {
  s3.getSignedUrlPromise.mockRejectedValue(new Error('Expired SSO credentials'))
  const response = await post('prepareAssetUpload', '{"filename":"test.svg"}')
  expect(response.status).toBe(500)
  expect(await response.json()).toEqual({
    error: 'Backend request failed. See backend logs.',
  })
})
