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
  load(assetType, assetId, dataFormat) {
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

    return Promise.resolve(this.get(assetType, assetId, dataFormat, spec))
  }

  async get(assetType, assetId, dataFormat, spec) {
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

class S3Helper {
  load(assetType, assetId, dataFormat) {
    if (
      assetType !== storage.AssetType.ImageVector &&
      assetType !== storage.AssetType.ImageBitmap &&
      assetType !== storage.AssetType.Sound
    ) {
      return null
    }

    return Promise.resolve(this.get(assetType, assetId, dataFormat))
  }

  async get(assetType, assetId, dataFormat) {
    const url = s3assets(`${assetId}.${dataFormat}`)

    console.info('Fetching from s3helper: assetId', assetId) // eslint-disable-line

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}`)
    }

    const data = await response.arrayBuffer()
    const assetFormatData = new Uint8Array(data)
    return new storage.Asset(assetType, assetId, dataFormat, assetFormatData)
  }
}

const eduHelper = new EduHelper()
const s3Helper = new S3Helper()

storage.addHelper(eduHelper)
storage.addHelper(s3Helper)

export default storage
