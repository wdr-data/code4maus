const fs = require('fs')
const path = require('path')
const globby = require('globby')

// eslint-disable-next-line require-await
const getLibraryContent = async () => {
  const sprites = JSON.parse(
    fs.readFileSync(
      path.resolve(__dirname, '../../src/lib/libraries/sprites.json'),
      'utf-8'
    )
  )
  const spritesAssets = sprites.reduce(
    (out, sprite) =>
      out
        .concat(sprite.json.sounds.map((s) => s.md5))
        .concat(sprite.json.costumes.map((c) => c.baseLayerMD5)),
    []
  )

  const singles = ['backdrops', 'costumes', 'sounds'].map((type) =>
    JSON.parse(
      fs.readFileSync(
        path.resolve(__dirname, `../../src/lib/libraries/${type}.json`),
        'utf-8'
      )
    ).map((a) => a.md5)
  )
  return spritesAssets.concat(
    singles.reduce((out, assets) => out.concat(assets), [])
  )
}

const mapAssets = (asset) => {
  if ('md5ext' in asset) {
    return asset.md5ext
  }
  return `${asset.assetId}.${asset.dataFormat}`
}

const extractAssetsFromProject = (path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf-8', (err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
    .then((content) => JSON.parse(content))
    .then((project) => {
      return project.targets.reduce((out, target) => {
        out = out.concat(target.costumes.map(mapAssets))
        return out.concat(target.sounds.map(mapAssets))
      }, [])
    })
}

const getProjectContent = function () {
  const defaultPath = path.resolve(
    __dirname,
    '../../src/lib/default-project/project.json'
  )

  return globby('src/lib/edu/*/project.json', {
    cwd: path.resolve(__dirname, '..', '..'),
  })
    .then((eduProjects) => [defaultPath].concat(eduProjects))
    .then((projectPaths) =>
      Promise.all(
        projectPaths.map((projectPath) => extractAssetsFromProject(projectPath))
      )
    )
    .then((projectResults) =>
      projectResults.reduce((prev, current) => prev.concat(current), [])
    )
}

function getAllAssets() {
  return Promise.all([getProjectContent(), getLibraryContent()])
    .then((results) =>
      results.reduce((prev, current) => prev.concat(current), [])
    )
    .then((assets) => [...new Set(assets)])
}

module.exports = {
  getAllAssets,
}
