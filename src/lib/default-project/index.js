import {TextEncoder} from 'text-encoding';
import projectJson from './project.json';

/* eslint-disable import/no-unresolved */
import popWav from '!arraybuffer-loader!./83a9787d4cb6f3b7632b4ddfebf74367.wav';
import backdrop from '!raw-loader!./cd21514d0531fdffb22204e0ec5ed84a.svg';
import costume1 from '!raw-loader!./83ba8783100ee3c109dad5aac8a71f1d.svg';
/* eslint-enable import/no-unresolved */

const encoder = new TextEncoder();
export default [{
    id: 0,
    assetType: 'Project',
    dataFormat: 'JSON',
    data: JSON.stringify(projectJson)
}, {
    id: '83a9787d4cb6f3b7632b4ddfebf74367',
    assetType: 'Sound',
    dataFormat: 'WAV',
    data: new Uint8Array(popWav)
}, {
    id: 'cd21514d0531fdffb22204e0ec5ed84a',
    assetType: 'ImageVector',
    dataFormat: 'SVG',
    data: encoder.encode(backdrop)
}, {
    id: '83ba8783100ee3c109dad5aac8a71f1d',
    assetType: 'ImageVector',
    dataFormat: 'SVG',
    data: encoder.encode(costume1)
}];
