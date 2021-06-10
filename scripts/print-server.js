/* eslint-disable no-console */
const path = require('path')
const child_process = require('child_process')
const fs = require('fs')
const express = require('express')
const multer = require('multer')
const cors = require('cors')

const app = express()

const upload = multer({ dest: 'code4maus-uploads/' })

app.use(cors())

const printDefault = (buffer, format = 'PDF') => {
  const printer = require('printer')
  return new Promise((res, rej) =>
    printer.printDirect({
      data: buffer,
      type: format,
      success: res,
      error: rej,
    })
  )
}

let binPath = path.join(
  'C:',
  'Program Files (x86)',
  'Adobe',
  'Adobe Reader DC',
  'Reader',
  'AcroRd32.exe'
)
if (process.argv.length > 2 && process.argv[2] !== '') {
  binPath = process.argv[2]
}

if (process.platform === 'win32') {
  try {
    const binStat = fs.statSync(binPath)
    if (!binStat.isFile) {
      throw new Error('Acrobat Reader executable is not a file!')
    }
  } catch (err) {
    console.error(
      `Acrobat Reader is required at ${binPath}!`,
      'Failed with:',
      err
    )
  }
}

const printWin = (filepath) =>
  new Promise((res, rej) => {
    const args = ['/t', path.join(process.cwd(), filepath)]
    console.log('Executing binary:', binPath, args)
    const child = child_process.spawn(binPath, args)
    const childTimeout = setTimeout(() => {
      console.log('Killing with timeout')
      child.killed || child.kill()
    }, 2000)
    child.on('exit', () => {
      console.log('Exited.')
      clearTimeout(childTimeout)
      res()
    })
    child.on('error', (err) => {
      console.error('Errored:', err)
      rej(err)
    })
  })

app.post('/', upload.single('button'), async (req, res) => {
  try {
    console.log('Got print job:', req.file.path)
    if (process.platform !== 'win32') {
      const printId = await printDefault(req.file.buffer)
      console.log('Printed with ID:', printId)
    } else {
      await printWin(req.file.path)
    }
    res.send('Printed.')
  } catch (err) {
    res.status(500).send(`error on printing: ${err}`)
  }
})

app.listen(8602, () => {
  console.log('Example app listening on port 8602!')
})
