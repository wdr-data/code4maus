import ScratchStorage from 'scratch-storage';

import defaultProjectAssets from './default-project';

const PROJECT_SERVER = 'https://projects.scratch.mit.edu';
const ASSET_SERVER = 'https://cdn.assets.scratch.mit.edu';


export const s3assets = (filename) => `/data/assets/${filename}`;
export const s3userFile = (userId, path) => `/data/projects/${userId}/${path}`;

/**
 * Wrapper for ScratchStorage which adds default web sources.
 * @todo make this more configurable
 */
class Storage extends ScratchStorage {
    constructor() {
        super();
        this.userId = null;

        this.setupEduSource();
        this.setupS3Source();
        this.setupScratchLegacySources();

        this.cacheDefaultProject();
    }

    setupEduSource() {
        this.addWebStore(
            [ this.AssetType.Project ],
            (project) => {
                const [ cat, projectId ] = String(project.assetId).split('/');
                if (cat !== 'edu') {
                    console.log('Not edu project');
                    return false;
                }
                return `/edu/${projectId}/project.${project.dataFormat}`;
            }
        );
    }

    setupS3Source() {
        this.addWebStore(
            [ this.AssetType.Project ],
            (project) => {
                if (!this.userId) {
                    console.warn('No user id set');
                    return false;
                }
                return s3userFile(this.userId, `${project.assetId}.${project.dataFormat}`);
            }
        );
        this.addWebStore(
            [ this.AssetType.ImageVector, this.AssetType.ImageBitmap, this.AssetType.Sound ],
            (asset) => s3assets(`${asset.assetId}.${asset.dataFormat}`)
        );
    }

    setupScratchLegacySources() {
        this.addWebStore(
            [ this.AssetType.Project ],
            (projectAsset) => {
                if (projectAsset.assetId === 0) {
                    return false;
                }
                const [ projectId, revision ] = projectAsset.assetId.split('.');
                return revision ?
                    `${PROJECT_SERVER}/internalapi/project/${projectId}/get/${revision}` :
                    `${PROJECT_SERVER}/internalapi/project/${projectId}/get/`;
            }
        );
        this.addWebStore(
            [ this.AssetType.ImageVector, this.AssetType.ImageBitmap, this.AssetType.Sound ],
            (asset) => `${ASSET_SERVER}/internalapi/asset/${asset.assetId}.${asset.dataFormat}/get/`
        );
        this.addWebStore(
            [ this.AssetType.Sound ],
            (asset) => `static/extension-assets/scratch3_music/${asset.assetId}.${asset.dataFormat}`
        );
    }

    cacheDefaultProject() {
        defaultProjectAssets.forEach((asset) => this.builtinHelper._store(
            this.AssetType[asset.assetType],
            this.DataFormat[asset.dataFormat],
            asset.data,
            asset.id,
        ));
    }
}

const storage = new Storage();

export default storage;
