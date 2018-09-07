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

const main = async () => {
    const defaultPath = path.resolve(__dirname, '../src/lib/default-project/project.json');
    const eduProjects = await globby(
        'src/lib/edu/*/project.json',
        { cwd: path.resolve(__dirname, '..') }
    );
    const projectPaths = [ defaultPath ].concat(eduProjects);
    const assets = await projectPaths.reduce((prom, projectPath) => prom.then(
        async (out) => out.concat(await extractAssetsFromProject(projectPath))
    ), Promise.resolve([]));
    const uniqueAssets = [ ...new Set(assets) ];
    const outPath = path.resolve(__dirname, '../.cache/assets');
    await Promise.all(uniqueAssets.map(async (asset) => new Promise((resolve, reject) =>
        request(`${bucketUrl}/assets/${asset}`)
            .pipe(fsL.createWriteStream(path.join(outPath, asset)))
            .on('error', reject)
            .on('finish', resolve)
    )));
    console.log(`Done. Written ${uniqueAssets.length} files.`);
};

main().catch(console.error);
