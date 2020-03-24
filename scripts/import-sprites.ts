import * as fsOld from 'fs'
import * as path from 'path'

const fs = fsOld.promises

type CostumeFormat = 'jpg' | 'svg'
type SoundFormat = 'mp3' | 'wav'

interface SB3Project {
  targets: SB3Target[]
  monitors: any[]
  extensions: any[]
  meta: {
    semver: '3.0.0'
    vm: '0.2.0-minimal-3'
    agent: string
  }
}

interface SB3Target {
  isStage: boolean
  name: string
  variables: {
    [k: string]: [string, number]
  }
  lists: any
  broadcasts: any
  blocks: any
  comments: any
  currentCostume: number
  costumes: SB3Costume[]
  sounds: SB3Sound[]
  volume: number
  layerOrder: number
}

interface SB3TargetStage extends SB3Target {
  isStage: true
  tempo: number
  videoTransparency: number
  videoState: 'off' | 'on'
  textToSpeechLanguage: string | null
}
interface SB3TargetSprite extends SB3Target {
  isStage: false
  visible: boolean
  x: number
  y: number
  size: number
  direction: number
  draggable: false
  rotationStyle: 'all around' | 'normal'
}

interface SB3BaseAsset {
  assetId: string // md5 excluding extension
  name: string
  md5ext: string // including extension
}

interface SB3Costume extends SB3BaseAsset {
  dataFormat: CostumeFormat
  bitmapResolution: number
  rotationCenterX: number
  rotationCenterY: number
}

interface SB3Sound extends SB3BaseAsset {
  dataFormat: SoundFormat
  rate: number
  sampleCount: number
}

interface LibrarySprite {
  name: string
  md5: string
  type: 'sprite'
  tags: string[]
  info: [
    0,
    number, // number of costumes?!
    number // number of sounds?!
  ]
  json: VMSprite
}

interface VMSprite {
  objName: string
  sounds: VMSound[]
  costumes: VMCostume[]
  currentCostumeIndex: 0
  scratchX: number
  scratchY: number
  scale: number // scaling factor, 1 = original
  direction: number
  rotationStyle: 'normal'
  isDraggable: false
  visible: true
  spriteInfo: {}
}

interface VMSound {
  soundName: string
  soundID: -1
  md5: string // including extension
  sampleCount: number
  rate: number
  format: '' | 'adpcm' // @todo: supports mp3? needs anything at all?
}

interface VMCostume {
  costumeName: string
  baseLayerID: -1
  baseLayerMD5: string // including extension
  bitmapResolution: number
  rotationCenterX: number
  rotationCenterY: number
}

type LibraryImageAssetType = 'costume' | 'backdrop'
interface LibraryImageAsset<T extends LibraryImageAssetType> {
  name: string
  md5: string // including extension
  type: T
  tags: string[]
  info: [
    number, // rotationCenterX
    number, // rotationCenterY
    number // bitmapResolution
  ]
}
type LibraryCostumeType = 'costume'
type LibraryCostume = LibraryImageAsset<LibraryCostumeType>
type LibraryBackdropType = 'backdrop'
type LibraryBackdrop = LibraryImageAsset<LibraryBackdropType>

interface LibrarySound {
  name: string
  md5: string // including extension
  sampleCount: number
  rate: number
  format: SoundFormat
  tags: string[]
}

type LibraryItem =
  | LibrarySprite
  | LibraryCostume
  | LibraryBackdrop
  | LibrarySound
type AssetTypeMap = {
  name: LibraryItem
  costumeName: VMCostume
  soundName: VMSound
}

const makeVMSound = (sound: SB3Sound): VMSound => ({
  soundName: sound.name,
  soundID: -1,
  md5: sound.md5ext,
  sampleCount: sound.sampleCount,
  rate: sound.rate,
  format: ''
})

const makeVMCostume = (costume: SB3Costume): VMCostume => ({
  costumeName: costume.name,
  baseLayerID: -1,
  baseLayerMD5: costume.md5ext,
  bitmapResolution: costume.bitmapResolution,
  rotationCenterX: costume.rotationCenterX,
  rotationCenterY: costume.rotationCenterY
})

const dedupe = <T extends LibraryItem>(
  former: T[],
  inserts: Map<string, T>
): T[] => {
  const library = former.filter(a => !inserts.has(a.name))
  const order = former.reduce((map, item, i) => {
    map.set(item.name, i)
    return map
  }, new Map<string, number>())
  return [...library, ...Array.from(inserts.values())].sort(
    (a, b) =>
      (order.has(a.name) ? order.get(a.name) : Number.MAX_SAFE_INTEGER) -
      (order.has(b.name) ? order.get(b.name) : Number.MAX_SAFE_INTEGER)
  )
}

const applyTags = <T extends LibraryItem>(
  former: T[],
  inserts: Map<string, T>
): Map<string, T> => {
  former.forEach(f => {
    if (inserts.has(f.name)) {
      inserts.get(f.name).tags = [...f.tags]
    }
  })
  return inserts
}

const makeSprite = (target: SB3TargetSprite): LibrarySprite => {
  const [firstCostume] = target.costumes

  const json: VMSprite = {
    objName: target.name,
    sounds: target.sounds.map(makeVMSound),
    costumes: target.costumes.map(makeVMCostume),
    currentCostumeIndex: 0,
    scratchX: target.x,
    scratchY: target.y,
    scale: target.size / 100,
    direction: target.direction,
    rotationStyle: 'normal',
    isDraggable: false,
    visible: true,
    spriteInfo: {}
  }

  return {
    name: target.name,
    md5: firstCostume.md5ext,
    type: 'sprite',
    tags: [],
    info: [0, target.costumes.length, target.sounds.length],
    json
  }
}

type SB3TargetMap = {
  costume: SB3TargetSprite
  backdrop: SB3TargetStage
}
const makeImageAsset = <T extends LibraryImageAssetType>(type: T) => (
  target: SB3TargetMap[typeof type]
): LibraryImageAsset<T>[] =>
  target.costumes.map(costume => ({
    name: costume.name,
    md5: costume.md5ext,
    type,
    tags: [],
    info: [
      costume.rotationCenterX,
      costume.rotationCenterY,
      costume.bitmapResolution
    ] as [number, number, number]
  }))

const makeSounds = (target: SB3Target): LibrarySound[] =>
  target.sounds.map(sound => ({
    name: sound.name,
    md5: sound.md5ext,
    sampleCount: sound.sampleCount,
    rate: sound.rate,
    format: sound.dataFormat,
    tags: []
  }))

const reduceToMap = <T extends LibraryItem>(
  acc: Map<string, T>,
  item: T
): Map<string, T> => {
  acc.set(item.name, item)
  return acc
}

type Importer<T> = (project: SB3Project) => Map<string, T>
const importers: { [k in ImportType]: Importer<LibMap[k]> } = {
  sprites: project => {
    const map = new Map<string, LibrarySprite>()
    return project.targets
      .filter((t: SB3Target): t is SB3TargetSprite => !t.isStage)
      .map(makeSprite)
      .reduce<typeof map>(reduceToMap, map)
  },
  costumes: project => {
    const map = new Map<string, LibraryCostume>()
    return project.targets
      .filter((t: SB3Target): t is SB3TargetSprite => !t.isStage)
      .flatMap(makeImageAsset('costume'))
      .reduce<typeof map>(reduceToMap, map)
  },
  backdrops: project => {
    const map = new Map<string, LibraryBackdrop>()
    return project.targets
      .filter((t: SB3Target): t is SB3TargetStage => t.isStage)
      .flatMap(makeImageAsset('backdrop'))
      .reduce<typeof map>(reduceToMap, map)
  },
  sounds: project => {
    const map = new Map<string, LibrarySound>()
    return project.targets
      .flatMap(makeSounds)
      .reduce<typeof map>(reduceToMap, map)
  }
}

type ImportType = 'sprites' | 'costumes' | 'backdrops' | 'sounds'
const types: ImportType[] = ['sprites', 'costumes', 'backdrops', 'sounds']
type LibMap = {
  sprites: LibrarySprite
  costumes: LibraryCostume
  backdrops: LibraryBackdrop
  sounds: LibrarySound
}

const pathMap: { [k in ImportType]: string } = {
  sprites: '../src/lib/libraries/sprites.json',
  costumes: '../src/lib/libraries/costumes.json',
  backdrops: '../src/lib/libraries/backdrops.json',
  sounds: '../src/lib/libraries/sounds.json'
}
const getPath = (type: ImportType): string =>
  path.resolve(__dirname, pathMap[type])

const importMain = async () => {
  const filename = process.argv[3]
  const projectFile = await fs.readFile(filename, 'utf-8')
  const project: SB3Project = JSON.parse(projectFile as string)

  const type = process.argv[2]
  const tasks: ImportType[] =
    type === 'all'
      ? types
      : (type
          .split(',')
          .filter(t => types.includes(type as any)) as ImportType[])

  console.log('Tasks to run:', tasks.join(', '))

  return Promise.all(
    tasks.map(async type => {
      const libFile = await fs.readFile(getPath(type), 'utf-8')
      const lib: LibMap[typeof type][] = JSON.parse(libFile as string)

      const rawInserts = await importers[type](project)
      const inserts = applyTags(lib, rawInserts)
      const updated = dedupe(lib, inserts)
      const content = JSON.stringify(updated, null, 4) + '\n'
      await fs.writeFile(getPath(type), content)
    })
  )
}

importMain()
  .then(() => console.log('Done'))
  .catch(e => {
    console.log('Failed:', e)
    process.exit(2)
  })
