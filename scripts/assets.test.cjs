const assert = require('node:assert/strict')
const { test } = require('node:test')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const crypto = require('node:crypto')
const http = require('node:http')
const { downloadAssets, uploadAssets, checkAssets } = require('./assets')
const { inspectAssets } = require('./lib/local-assets')

function fixture(t) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'maus-assets-'))
  const bundledDirectory = path.join(directory, 'bundled')
  fs.mkdirSync(bundledDirectory)
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }))
  return { directory, bundledDirectory }
}

function media(body = '<svg xmlns="http://www.w3.org/2000/svg"/>') {
  return {
    name: `${crypto.createHash('md5').update(body).digest('hex')}.svg`,
    body: Buffer.from(body),
  }
}

async function server(t, handler) {
  const instance = http.createServer(handler)
  await new Promise((resolve) => instance.listen(0, '127.0.0.1', resolve))
  t.after(() => new Promise((resolve) => instance.close(resolve)))
  return `http://127.0.0.1:${instance.address().port}`
}

function storage(objects = {}) {
  const writes = []
  return {
    writes,
    getObject({ Key }) {
      return {
        promise: async () => {
          if (!(Key in objects))
            throw Object.assign(new Error('Missing'), { code: 'NoSuchKey' })
          return { Body: objects[Key] }
        },
      }
    },
    putObject(params) {
      return {
        promise: async () => {
          writes.push(params)
        },
      }
    },
  }
}

test('anonymous download uses source references and bundled defaults, preserves existing files', async (t) => {
  const options = fixture(t)
  const asset = media()
  const bundled = media('<svg>bundled</svg>')
  fs.writeFileSync(
    path.join(options.bundledDirectory, bundled.name),
    bundled.body
  )
  const requests = []
  options.source = await server(t, (req, res) => {
    requests.push(req.url)
    assert.equal(req.headers.authorization, undefined)
    res.setHeader('Content-Type', 'image/svg+xml')
    res.end(asset.body)
  })
  assert.equal(await downloadAssets([asset.name, bundled.name], options), 1)
  assert.deepEqual(requests, [`/data/assets/${asset.name}`])
  assert.deepEqual(
    fs.readFileSync(path.join(options.directory, asset.name)),
    asset.body
  )
  assert.equal(fs.existsSync(path.join(options.directory, bundled.name)), false)
  assert.equal(await downloadAssets([asset.name, bundled.name], options), 0)
  assert.equal(requests.length, 1)
})

test('HTML fallback, HTTP errors and empty downloads leave no asset or partial file', async (t) => {
  const options = fixture(t)
  const asset = media()
  for (const [status, type, body] of [
    [200, 'text/html', '<!doctype html><html>app</html>'],
    [200, 'image/svg+xml', '<html>app</html>'],
    [404, 'text/plain', 'missing'],
    [200, 'image/svg+xml', ''],
  ]) {
    options.source = await server(t, (_req, res) => {
      res.writeHead(status, { 'Content-Type': type })
      res.end(body)
    })
    await assert.rejects(
      downloadAssets([asset.name], options),
      /expected|received/
    )
    assert.deepEqual(fs.readdirSync(options.directory), ['bundled'])
  }
})

test('legacy filename hashes are reported without discarding bucket content', async (t) => {
  const options = fixture(t)
  const asset = media()
  const legacyBody = Buffer.from('<svg>changed</svg>')
  options.source = await server(t, (_req, res) => res.end(legacyBody))
  assert.equal(await downloadAssets([asset.name], options), 1)
  const report = checkAssets([asset.name], options)
  assert.equal(report.missing.length, 0)
  assert.equal(report.invalid.length, 0)
  assert.equal(report.mismatched[0].name, asset.name)
  assert.deepEqual(
    fs.readFileSync(path.join(options.directory, asset.name)),
    legacyBody
  )
})

test('check reports missing and invalid assets; pruning affects only unreferenced local files', (t) => {
  const options = fixture(t)
  const asset = media()
  const missing = media('<svg>missing</svg>')
  fs.writeFileSync(path.join(options.directory, asset.name), '')
  fs.writeFileSync(path.join(options.directory, 'unused.svg'), '<svg/>')
  fs.writeFileSync(path.join(options.directory, '.gitkeep'), '')
  fs.writeFileSync(
    path.join(options.bundledDirectory, 'preserve.svg'),
    '<svg/>'
  )
  const report = checkAssets([asset.name, missing.name], options)
  assert.deepEqual(report.missing, [missing.name])
  assert.equal(report.invalid[0].name, asset.name)
  assert.deepEqual(report.unreferenced, ['unused.svg'])
  assert.equal(fs.existsSync(path.join(options.directory, 'unused.svg')), true)
  checkAssets([asset.name, missing.name], { ...options, prune: true })
  assert.deepEqual(
    fs.readdirSync(options.directory).sort(),
    ['.gitkeep', asset.name, 'bundled'].sort()
  )
  assert.equal(
    fs.existsSync(path.join(options.bundledDirectory, 'preserve.svg')),
    true
  )
})

test('source filenames cannot escape the asset directory', (t) => {
  const report = inspectAssets(['../outside.svg'], fixture(t))
  assert.match(report.invalid[0].message, /Invalid asset filename/)
})

test('publishing targets only referenced media, previews writes, and preserves existing objects', async (t) => {
  const options = fixture(t)
  const asset = media()
  const bundled = media('<svg>bundled</svg>')
  const existing = media('<svg>existing</svg>')
  fs.writeFileSync(path.join(options.directory, asset.name), asset.body)
  fs.writeFileSync(path.join(options.directory, existing.name), existing.body)
  fs.writeFileSync(
    path.join(options.bundledDirectory, bundled.name),
    bundled.body
  )
  fs.writeFileSync(path.join(options.directory, 'unused.svg'), 'not published')
  const s3 = storage({ [`data/assets/${existing.name}`]: existing.body })
  const names = [asset.name, existing.name, bundled.name]
  assert.deepEqual(
    await uploadAssets(s3, 'chosen-bucket', names, {
      ...options,
      dryRun: true,
    }),
    [asset.name, bundled.name].sort()
  )
  assert.equal(s3.writes.length, 0)
  await uploadAssets(s3, 'chosen-bucket', names, options)
  assert.equal(s3.writes.length, 2)
  assert.deepEqual(
    s3.writes.map((p) => p.Key).sort(),
    [asset.name, bundled.name].map((n) => `data/assets/${n}`).sort()
  )
  for (const write of s3.writes) {
    assert.equal(write.Bucket, 'chosen-bucket')
    assert.equal(write.ContentType, 'image/svg+xml')
    assert.equal(write.IfNoneMatch, '*')
  }
})

test('remote conflicts and access errors stop publishing before any writes', async (t) => {
  const options = fixture(t)
  const asset = media()
  const missing = media('<svg>missing remotely</svg>')
  for (const item of [asset, missing])
    fs.writeFileSync(path.join(options.directory, item.name), item.body)
  const s3 = storage({
    [`data/assets/${asset.name}`]: Buffer.from('different'),
  })
  await assert.rejects(
    uploadAssets(s3, 'chosen-bucket', [missing.name, asset.name], options),
    /differ; nothing uploaded/
  )
  assert.equal(s3.writes.length, 0)
  s3.getObject = () => ({
    promise: async () => {
      throw Object.assign(new Error('Access denied'), { code: 'AccessDenied' })
    },
  })
  await assert.rejects(
    uploadAssets(s3, 'chosen-bucket', [missing.name], options),
    /Access denied/
  )
  assert.equal(s3.writes.length, 0)
})

test('incomplete or invalid local media prevents even inspecting the destination', async (t) => {
  const options = fixture(t)
  const asset = media()
  const s3 = { getObject: () => assert.fail('must validate local files first') }
  await assert.rejects(
    uploadAssets(s3, 'chosen-bucket', [asset.name], options),
    /Missing:/
  )
  fs.writeFileSync(path.join(options.directory, asset.name), '<html>bad</html>')
  await assert.rejects(
    uploadAssets(s3, 'chosen-bucket', [asset.name], options),
    /received empty content or HTML/
  )
})
