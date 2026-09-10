const originalEnv = process.env
afterEach(() => {
  process.env = originalEnv
  jest.resetModules()
})

test.each(['prepareAssetUpload', 'prepareShareResult'])(
  '%s checks internal storage but signs for the browser endpoint',
  async (name) => {
    process.env = {
      ...originalEnv,
      STORAGE_ENDPOINT_FRONTEND: 'http://localhost:8333',
    }
    const initS3 = jest.fn(() => ({
      headObject: jest.fn(() => ({
        promise: () => Promise.reject({ code: 'NotFound' }),
      })),
      getSignedUrlPromise: jest
        .fn()
        .mockResolvedValue('http://localhost:8333/signed-upload'),
    }))
    jest.doMock('../lib/s3', () => ({ __esModule: true, default: initS3 }))
    const { handler } = require(`../${name}`)
    const response = await handler({ body: '{"filename":"test.svg"}' })
    expect(response.statusCode).toBe(200)
    expect(initS3).toHaveBeenNthCalledWith(1)
    expect(initS3).toHaveBeenNthCalledWith(2, 'http://localhost:8333')
    const [internal, browser] = initS3.mock.results.map(
      (result) => result.value
    )
    expect(internal.headObject).toHaveBeenCalledTimes(1)
    expect(internal.getSignedUrlPromise).not.toHaveBeenCalled()
    expect(browser.headObject).not.toHaveBeenCalled()
    expect(browser.getSignedUrlPromise).toHaveBeenCalledTimes(1)
  }
)
