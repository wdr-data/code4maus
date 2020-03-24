import ScratchStorage from 'scratch-storage'

import defaultProjectAssets from './default-project'
import { gamesKeyed } from './edu/'

export const s3assets = (filename) => `/data/assets/${filename}`
export const s3userFile = (userId, path) => `/data/projects/${userId}/${path}`

/**
 * Wrapper for ScratchStorage which adds default web sources.
 * @todo make this more configurable
 */
class Storage extends ScratchStorage {
  constructor() {
    super()
    this.userId = null

    this.setupS3Source()
    this.cacheDefaultProject()
  }

  setupS3Source() {
    this.addWebStore([this.AssetType.Project], (project) => {
      if (!this.userId) {
        console.warn("No user ID set. We can't upload like this!") // eslint-disable-line
        return false
      }
      return s3userFile(this.userId, `${project.assetId}.${project.dataFormat}`)
    })
    this.addWebStore(
      [
        this.AssetType.ImageVector,
        this.AssetType.ImageBitmap,
        this.AssetType.Sound,
      ],
      (asset) => s3assets(`${asset.assetId}.${asset.dataFormat}`)
    )
  }

  cacheDefaultProject() {
    defaultProjectAssets.forEach((asset) =>
      this.builtinHelper._store(
        this.AssetType[asset.assetType],
        this.DataFormat[asset.dataFormat],
        asset.data,
        asset.id
      )
    )
  }
}

const storage = new Storage()

class EduHelper {
  async load(assetType, assetId, dataFormat) {
    if (assetType !== storage.AssetType.Project) {
      return null
    }

    const [cat, gameId] = String(assetId).split('/')
    if (cat !== 'edu' || !(gameId in gamesKeyed)) {
      return null
    }

    const spec = gamesKeyed[gameId]
    if (!('fetchProject' in spec)) {
      throw new Error('No project file found!')
    }

    const project = await spec.fetchProject()
    const asset = new storage.Asset(
      assetType,
      assetId,
      dataFormat,
      JSON.stringify(project)
    )
    return asset
  }
}

const eduHelper = new EduHelper()
storage.addHelper(eduHelper)

export default storage
