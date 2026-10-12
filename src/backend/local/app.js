import express from 'express'

// Keep the Lambda handlers' string body and response contract intact.
export default function createApp(handlers) {
  const app = express()
  app.disable('x-powered-by')
  app.get('/health', (_req, res) => res.json({ status: 'ok' }))
  app.use('/api', express.text({ type: '*/*', limit: '6mb' }))

  for (const [name, handler] of Object.entries(handlers)) {
    app.post(`/api/${name}`, async (req, res, next) => {
      try {
        const body = typeof req.body === 'string' ? req.body : ''
        if (body) {
          let parsed
          try {
            parsed = JSON.parse(body)
          } catch (_error) {
            return res.status(400).json({ error: 'Invalid JSON request body.' })
          }
          if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
            return res.status(400).json({ error: 'Expected a JSON object.' })
          }
        }
        const response = await handler({
          httpMethod: req.method,
          path: req.path,
          headers: req.headers,
          queryStringParameters: Object.keys(req.query).length
            ? req.query
            : null,
          body: body || '{}',
          isBase64Encoded: false,
        })
        res.status(response.statusCode).set(response.headers || {})
        res.send(
          response.isBase64Encoded
            ? Buffer.from(response.body, 'base64')
            : response.body
        )
      } catch (error) {
        next(error)
      }
    })
  }

  app.use((_req, res) => res.status(404).json({ error: 'Route not found.' }))
  app.use((error, _req, res, _next) => {
    if (error.type === 'entity.too.large') {
      return res.status(413).json({ error: 'Request body exceeds 6 MB.' })
    }
    console.error(error) // eslint-disable-line no-console
    res.status(500).json({ error: 'Backend request failed. See backend logs.' })
  })
  return app
}
