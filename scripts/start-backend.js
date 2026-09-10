/* eslint-disable no-console */

/**
 * Starts the backend in development mode. Uses esbuild to watch and build
 * the backend, restarting a Node.js child process after each successful build.
 */

const path = require('path')
const { spawn } = require('child_process')
const esbuild = require('esbuild')

const root = path.resolve(__dirname, '..')
require('dotenv').config({ path: path.join(root, '.env.backend') })

process.env.AWS_SDK_LOAD_CONFIG = process.env.AWS_SDK_LOAD_CONFIG || '1'

if (!process.env.STORAGE_BUCKET && !process.env.S3_BUCKET_PROJECTS) {
  console.error(
    'Set STORAGE_BUCKET in .env.backend (see .env.backend.example).'
  )
  process.exit(1)
}
if (!process.env.AWS_REGION) {
  console.error('Set AWS_REGION in .env.backend (see .env.backend.example).')
  process.exit(1)
}

const outfile = path.join(root, '.cache/backend/server.cjs')
let child
let context
let stopping = false

async function stopChild() {
  if (child && child.exitCode === null && child.signalCode === null) {
    const exited = new Promise((resolve) => child.once('exit', resolve))
    child.kill('SIGTERM')
    await exited
  }
}

async function shutdown() {
  stopping = true
  if (context) await context.dispose()
  await stopChild()
}

process.once('SIGINT', shutdown)
process.once('SIGTERM', shutdown)

async function main() {
  context = await esbuild.context({
    absWorkingDir: root,
    entryPoints: ['src/backend/local/server.js'],
    outfile,
    bundle: true,
    platform: 'node',
    target: 'node24',
    packages: 'external',
    sourcemap: true,
    logLevel: 'info',
    plugins: [
      {
        name: 'restart-backend',
        setup(build) {
          build.onEnd(async (result) => {
            if (result.errors.length || stopping) return
            await stopChild()
            if (stopping) return
            child = spawn(process.execPath, ['--enable-source-maps', outfile], {
              cwd: root,
              stdio: 'inherit',
              env: process.env,
            })
            child.on('error', (error) => console.error(error))
          })
        },
      },
    ],
  })
  if (stopping) return context.dispose()
  await context.watch()
}

main().catch(async (error) => {
  console.error(error)
  await shutdown()
  process.exitCode = 1
})
