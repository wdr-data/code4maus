
const fs = require('fs').promises;
const path = require('path');

const type = process.argv[2];
const filename = process.argv[3];

const importMain = async function() {
    const projectFile = await fs.readFile(filename);
    const project = JSON.parse(projectFile);

    switch (type) {
    case 'costumes':
        await importCostumes(project);
        break;
    case 'backdrop':
        await importBackdrops(project);
        break;
    case 'sounds':
        await importSounds(project);
        break;
    default:
        console.error("invalid type. Use 'costumes', 'backdrop', 'sounds'");
        process.exit(1);
    }
};

const importCostumes = async function(project) {
    const costumeInserts = {};

    const insertedSprites = project.targets
        .filter((t) => !t.isStage)
        .map((sprite) => {
            const costumes = sprite.costumes
                .map((c) => ({
                    costumeName: c.name,
                    baseLayerID: -1,
                    baseLayerMD5: c.md5ext,
                    bitmapResolution: c.bitmapResolution,
                    rotationCenterX: c.rotationCenterX,
                    rotationCenterY: c.rotationCenterY,
                }));
            if (costumes.length < 1) {
                return null;
            }

            costumes.map((c, key) => ({
                name: c.costumeName,
                md5: c.baseLayerMD5,
                type: 'costume',
                tags: [],
                info: [
                    c.rotationCenterX,
                    c.rotationCenterY,
                    c.bitmapResolution,
                ],
            })).forEach((c) => {
                costumeInserts[c.name] = c;
            });

            return {
                name: sprite.name,
                baseLayerID: -1,
                md5: costumes[0].baseLayerMD5,
                type: 'sprite',
                tags: [],
                info: [ 0, 2 ],
                json: {
                    objName: sprite.name,
                    sounds,
                    costumes,
                    currentCostumeIndex: sprite.currentCostume,
                    scratchX: sprite.x,
                    scratchY: sprite.y,
                    scale: 1,
                    direction: sprite.direction,
                    rotationStyle: 'normal',
                    isDraggable: sprite.draggable,
                    visible: true,
                    spriteInfo: {},
                },
            };
        })
        .filter((s) => !!s)
        .reduce((acc, s) => {
            acc[s.name] = s;
            return acc;
        }, {});

    const spritesPath = path.resolve(__dirname, '../src/lib/libraries/sprites.json');
    const spritesFile = await fs.readFile(spritesPath);
    const sprites = JSON.parse(spritesFile);

    const spritesResult = sprites.map((s) => {
        if (!(s.name in insertedSprites)) {
            return s;
        }
        const insert = insertedSprites[s.name];
        insert.tags = s.tags;
        insertedSprites[s.name] = null;
        return insert;
    }).concat(Object.values(insertedSprites).filter((s) => !!s));

    await fs.writeFile(spritesPath, JSON.stringify(spritesResult, null, 4));

    const costumesPath = path.resolve(__dirname, '../src/lib/libraries/costumes.json');
    const costumesFile = await fs.readFile(costumesPath);
    const costumes = JSON.parse(costumesFile);

    const costumesResult = costumes.map((c) => {
        if (!(c.name in costumeInserts)) {
            return c;
        }
        const insert = costumeInserts[c.name];
        costumeInserts[c.name] = null;
        console.log('overwriting costume', insert);
        return insert;
    }).concat(Object.values(costumeInserts).filter((c) => !!c));

    await fs.writeFile(costumesPath, JSON.stringify(costumesResult, null, 4));
};

const importBackdrops = async function(project) {
    const backdropInserts = {};

    project.targets
        .filter((t) => t.isStage)
        .map((backdrop) => {
            backdrop.costumes.map((c, key) => ({
                name: c.name,
                md5: c.md5ext,
                type: 'backdrop',
                tags: [],
                info: [
                    c.rotationCenterX,
                    c.rotationCenterY,
                    c.bitmapResolution,
                ],
            })).forEach((c) => {
                backdropInserts[c.name] = c;
            });
        })
    
    const backdropsPath = path.resolve(__dirname, '../src/lib/libraries/backdrops.json');
    const backdropsFile = await fs.readFile(backdropsPath);
    const backdrops = JSON.parse(backdropsFile);

    const backdropResult = backdrops.map((s) => {
        if (!(s.name in backdropInserts)) {
            return s;
        }
        const insert = backdropInserts[s.name];
        insert.tags = s.tags;
        backdropInserts[s.name] = null;
        return insert;
    }).concat(Object.values(backdropInserts).filter((s) => !!s));

    await fs.writeFile(backdropsPath, JSON.stringify(backdropResult, null, 4));
};

const importSounds = async function(project) {
    const soundsInserts = {};

    project.targets
        .map((target) => {
            target.sounds.map((s, key) => ({
                name: s.name,
                md5: s.md5ext,
                sampleCount: s.sampleCount,
                rate: s.rate,
                format: 'mp3',
                tags: []
            })).forEach((c) => {
                soundsInserts[c.name] = c;
            });
        })
    
    const soundsPath = path.resolve(__dirname, '../src/lib/libraries/sounds.json');
    const soundsFile = await fs.readFile(soundsPath);
    const sounds = JSON.parse(soundsFile);

    const soundsResult = sounds.map((s) => {
        if (!(s.name in soundsInserts)) {
            return s;
        }
        const insert = soundsInserts[s.name];
        insert.tags = s.tags;
        soundsInserts[s.name] = null;
        return insert;
    }).concat(Object.values(soundsInserts).filter((s) => !!s));

    await fs.writeFile(soundsPath, JSON.stringify(soundsResult, null, 4));
};


importMain().then(() => console.log('Done')).catch((e) => {
    console.log('Failed:', e); process.exit(2);
});
