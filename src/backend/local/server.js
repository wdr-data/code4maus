/* eslint-disable no-console */
import { handler as prepareAssetUpload } from '../prepareAssetUpload'
import { handler as saveProject } from '../saveProject'
import { handler as prepareShareResult } from '../prepareShareResult'
import createApp from './app'

const host = process.env.BACKEND_HOST || '127.0.0.1'
const port = Number(process.env.BACKEND_PORT || 3000)
const app = createApp({ prepareAssetUpload, saveProject, prepareShareResult })
const server = app.listen(port, host, () => {
  console.log(`Local backend: http://${host}:${port}`)
  console.log(
    `Storage: ${
      process.env.STORAGE_BUCKET || process.env.S3_BUCKET_PROJECTS
    } (${process.env.AWS_REGION}); AWS profile: ${
      process.env.AWS_PROFILE || 'default credential chain'
    }`
  )
})
server.on('error', (error) => {
  console.error(error)
  process.exit(1)
})

function shutdown() {
  server.close(() => process.exit(0))
  setTimeout(() => process.exit(0), 2000).unref()
}
process.once('SIGINT', shutdown)
process.once('SIGTERM', shutdown)
