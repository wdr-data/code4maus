const fsL = require('fs');
const fs = fsL.promises;
const path = require('path');
const globby = require('globby');
const request = require('request-promise-native');

require('dotenv').config();
const bucketSuffix = process.env.BRANCH === 'production' ? 'prod' : 'staging';
const bucketUrl = `https://${process.env.S3_BUCKET_PREFIX}-${bucketSuffix}` +
    `.s3.dualstack.${process.env.FUNCTIONS_AWS_REGION || process.env.AWS_REGION}.amazonaws.com`;

const extractAssetsFromProject = async (path) => {
    const project = JSON.parse(await fs.readFile(path, 'utf-8'));
    return project.targets.reduce((out, target) => {
        out = out.concat(target.costumes.map((asset) => asset.md5ext));
        return out.concat(target.sounds.map((asset) => asset.md5ext));
    }, []);
};

const getLibraryContent = async () => {
    const sprites = JSON.parse(
        await fs.readFile(path.resolve(__dirname, '../src/lib/libraries/sprites.json'), 'utf-8')
    );
    const spritesAssets = sprites.reduce(
        (out, sprite) => out
            .concat(sprite.json.sounds.map((s) => s.md5))
            .concat(sprite.json.costumes.map((c) => c.baseLayerMD5)),
        [],
    );

    const singles = await Promise.all([ 'backdrops', 'costumes', 'sounds' ].map(
        async (type) => JSON.parse(
            await fs.readFile(path.resolve(__dirname, `../src/lib/libraries/${type}.json`), 'utf-8')
        ).map((a) => a.md5),
    ));
    return spritesAssets.concat(
        singles.reduce((out, assets) => out.concat(assets), [])
    );
};

const main = async () => {
    const defaultPath = path.resolve(__dirname, '../src/lib/default-project/project.json');
    const eduProjects = await globby(
        'src/lib/edu/*/project.json',
        { cwd: path.resolve(__dirname, '..') }
    );
    const projectPaths = [ defaultPath ].concat(eduProjects);
    const assets = (await projectPaths.reduce((prom, projectPath) => prom.then(
        async (out) => out.concat(await extractAssetsFromProject(projectPath))
    ), Promise.resolve([])))
        .concat(await getLibraryContent());
    const uniqueAssets = [ ...new Set(assets) ];
    const outPath = path.resolve(__dirname, '../.cache/data/assets');
    await Promise.all(uniqueAssets.map(async (asset) => new Promise((resolve, reject) =>
        request(`${bucketUrl}/assets/${asset}`)
            .pipe(fsL.createWriteStream(path.join(outPath, asset)))
            .on('error', reject)
            .on('finish', resolve)
    )));
    console.log(`Done. Written ${uniqueAssets.length} files.`);
};

main().catch(console.error);
