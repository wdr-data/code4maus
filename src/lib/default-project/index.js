import { TextEncoder } from 'text-encoding'
import projectJson from './project.json'

/* eslint-disable import/no-unresolved */
import sound1 from '!arraybuffer-loader!../../../assets/project-assets/282fb24fedf9ed8f6b7dd08366a0f83c.mp3'
import sound2 from '!arraybuffer-loader!../../../assets/project-assets/b38904cb3103c903cd6be4b569b8db5c.mp3'
import costume1 from '!raw-loader!../../../assets/project-assets/c6824e69f8d1c3c8859666fcbe3e547c.svg'
import backdrop1 from '!arraybuffer-loader!../../../assets/project-assets/3a343d19f40be5196f5b1cad1c7d1e39.jpg'
import backdrop2 from '!arraybuffer-loader!../../../assets/project-assets/7a0b6208f0ac9b50189eaa3a2fa68590.jpg'
import backdrop3 from '!arraybuffer-loader!../../../assets/project-assets/a35419bc3c9a8888430c157960ef28b4.jpg'
import backdrop4 from '!arraybuffer-loader!../../../assets/project-assets/b533867ddb6e18b4d508f11be3b46095.jpg'
import backdrop5 from '!arraybuffer-loader!../../../assets/project-assets/bea568d0b736f0a365cb41e7d05f8100.jpg'
/* eslint-enable import/no-unresolved */

export const emptyItem = {
  name: 'Selber malen',
  md5: 'cd21514d0531fdffb22204e0ec5ed84a.svg',
  type: 'costume',
  tags: [],
  info: [0, 0, 1],
}

const encoder = new TextEncoder()
export default [
  {
    id: 0,
    assetType: 'Project',
    dataFormat: 'JSON',
    data: JSON.stringify(projectJson),
  },
  {
    id: '282fb24fedf9ed8f6b7dd08366a0f83c',
    assetType: 'Sound',
    dataFormat: 'MP3',
    data: new Uint8Array(sound1),
  },
  {
    id: 'b38904cb3103c903cd6be4b569b8db5c',
    assetType: 'Sound',
    dataFormat: 'MP3',
    data: new Uint8Array(sound2),
  },
  {
    id: 'c6824e69f8d1c3c8859666fcbe3e547c',
    assetType: 'ImageVector',
    dataFormat: 'SVG',
    data: encoder.encode(costume1),
  },
  {
    id: '3a343d19f40be5196f5b1cad1c7d1e39',
    assetType: 'ImageBitmap',
    dataFormat: 'JPG',
    data: new Uint8Array(backdrop1),
  },
  {
    id: '7a0b6208f0ac9b50189eaa3a2fa68590',
    assetType: 'ImageBitmap',
    dataFormat: 'JPG',
    data: new Uint8Array(backdrop2),
  },
  {
    id: 'a35419bc3c9a8888430c157960ef28b4',
    assetType: 'ImageBitmap',
    dataFormat: 'JPG',
    data: new Uint8Array(backdrop3),
  },
  {
    id: 'b533867ddb6e18b4d508f11be3b46095',
    assetType: 'ImageBitmap',
    dataFormat: 'JPG',
    data: new Uint8Array(backdrop4),
  },
  {
    id: 'bea568d0b736f0a365cb41e7d05f8100',
    assetType: 'ImageBitmap',
    dataFormat: 'JPG',
    data: new Uint8Array(backdrop5),
  },
]
