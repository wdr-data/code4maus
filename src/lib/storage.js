import ScratchStorage from '@wdr-data/scratch-storage';

import defaultProjectAssets from './default-project';

const PROJECT_SERVER = 'https://projects.scratch.mit.edu';
const ASSET_SERVER = 'https://cdn.assets.scratch.mit.edu';


const bucketUrl = process.env.S3_BUCKET_URL_PROJECT;
export const s3assets = filename => `${bucketUrl}/assets/${filename}`;


/**
 * Wrapper for ScratchStorage which adds default web sources.
 * @todo make this more configurable
 */
class Storage extends ScratchStorage {
    constructor () {
        super();
        this.userId = null;

        this.setupEduSource();
        this.setupS3Source();
        this.setupScratchLegacySources();

        defaultProjectAssets.forEach(asset => this.cache(
            this.AssetType[asset.assetType],
            this.DataFormat[asset.dataFormat],
            asset.data,
            asset.id
        ));
    }

    setupEduSource () {
        this.addWebSource(
            [this.AssetType.Project],
            project => {
                const [cat, projectName] = String(project.assetId).split("/")
                if (cat !== 'edu' ) {
                    console.log('Not edu project');
                    return false;
                }
                return `/edu-games/projects/${projectName}.${project.dataFormat}`;
            }
        )
    }

    setupS3Source () {
        this.addWebSource(
            [this.AssetType.Project],
            project => {
                if (!this.userId) {
                    throw new Error('No user id set');
                }
                return `${bucketUrl}/projects/${this.userId}/${project.assetId}.${project.dataFormat}`;
            }
        );
        this.addWebSource(
            [this.AssetType.ImageVector, this.AssetType.ImageBitmap, this.AssetType.Sound],
            asset => s3assets(`${asset.assetId}.${asset.dataFormat}`)
        );
    }

    setupScratchLegacySources () {
        this.addWebSource(
            [this.AssetType.Project],
            projectAsset => {
                const [projectId, revision] = projectAsset.assetId.split('.');
                return revision ?
                    `${PROJECT_SERVER}/internalapi/project/${projectId}/get/${revision}` :
                    `${PROJECT_SERVER}/internalapi/project/${projectId}/get/`;
            }
        );
        this.addWebSource(
            [this.AssetType.ImageVector, this.AssetType.ImageBitmap, this.AssetType.Sound],
            asset => `${ASSET_SERVER}/internalapi/asset/${asset.assetId}.${asset.dataFormat}/get/`
        );
        this.addWebSource(
            [this.AssetType.Sound],
            asset => `static/extension-assets/scratch3_music/${asset.assetId}.${asset.dataFormat}`
        );
    }
}

const storage = new Storage();

export default storage;
