/* eslint-disable no-console */
// Builds build/maintenance.html from maintenance/index.html as one
// self-contained file: stylesheets become <style> blocks, every image, icon
// and font becomes a data URI. Links (<a href>) stay as they are.
const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..')
const SOURCE = path.join(ROOT, 'maintenance', 'index.html')
const TARGET = path.join(ROOT, 'build', 'maintenance.html')

const MIME_TYPES = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
}

// Characters in the font subsets under maintenance/fonts, see README.md there
const FONT_CHARSET =
  /[\x20-\x7E\u00A0\u00A9\u00C4\u00D6\u00DC\u00DF\u00E4\u00F6\u00FC\u2013\u2014\u2018-\u201E\u2026\s]/u

function dataUri(ref, baseDir) {
  if (/^[a-z]+:|^\/\//i.test(ref)) {
    throw new Error(`External asset not allowed: ${ref}`)
  }
  const file = path.resolve(baseDir, ref)
  const type = MIME_TYPES[path.extname(file).toLowerCase()]
  if (!type) {
    throw new Error(`Unsupported asset type: ${ref}`)
  }
  if (type === 'image/svg+xml') {
    // URL-encoded instead of base64, about a quarter smaller
    const svg = encodeURIComponent(fs.readFileSync(file, 'utf8'))
      .replace(/'/g, '%27')
      .replace(/%(20|2C|2F|3A|3B|3D)/g, (match) => decodeURIComponent(match))
    return `data:${type},${svg}`
  }
  return `data:${type};base64,${fs.readFileSync(file).toString('base64')}`
}

function warnMissingGlyphs(html) {
  const text = html.replace(/<[^>]*>/g, '')
  const missing = new Set([...text].filter((char) => !FONT_CHARSET.test(char)))
  if (missing.size > 0) {
    console.warn(
      `Not in the font subset, rendered in a fallback font: ${[...missing].join(
        ' '
      )}`
    )
  }
}

function inlineUrls(css, baseDir) {
  return css.replace(/url\(\s*(['"]?)(.+?)\1\s*\)/g, (match, _quote, ref) =>
    ref.startsWith('data:') ? match : `url('${dataUri(ref, baseDir)}')`
  )
}

function inlineStylesheet(ref, baseDir) {
  const file = path.resolve(baseDir, ref)
  return inlineUrls(fs.readFileSync(file, 'utf8'), path.dirname(file))
}

function build() {
  const baseDir = path.dirname(SOURCE)
  let html = fs.readFileSync(SOURCE, 'utf8')

  if (/\bsrcset=/.test(html)) {
    throw new Error('srcset is not supported, use a single src')
  }
  warnMissingGlyphs(html)

  // Before inlining anything, so inlined SVGs and stylesheets aren't rescanned
  html = inlineUrls(html, baseDir)
  html = html.replace(/<link\b[^>]*>/g, (tag) => {
    const href = tag.match(/\bhref=(['"])(.+?)\1/)
    if (!href) {
      return tag
    }
    if (/\brel=(['"])stylesheet\1/.test(tag)) {
      return `<style>\n${inlineStylesheet(href[2], baseDir)}</style>`
    }
    return tag.replace(href[0], `href="${dataUri(href[2], baseDir)}"`)
  })
  html = html.replace(/\bsrc=(['"])(.+?)\1/g, (match, _quote, ref) =>
    ref.startsWith('data:') ? match : `src="${dataUri(ref, baseDir)}"`
  )

  fs.mkdirSync(path.dirname(TARGET), { recursive: true })
  fs.writeFileSync(TARGET, html)
  const kb = (Buffer.byteLength(html) / 1024).toFixed(1)
  console.log(`Wrote ${path.relative(ROOT, TARGET)} (${kb} KB)`)
}

build()
