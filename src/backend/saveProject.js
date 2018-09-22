import initS3 from './lib/s3';
import nanoid from 'nanoid';

const s3 = initS3();

const getKey = (user, path = 'index.json') => `data/projects/${user}/${path}`;

const injectReplyJson = (handler) => (event, context, callback) => handler(event, context, (code, body) => callback(null, {
    statusCode: code,
    headers: {
        'content-type': 'application/json',
    },
    body: JSON.stringify(body),
}));

export const handler = injectReplyJson(async (event, context, reply) => {
    const { data, id, name, userId } = JSON.parse(event.body);
    if (!data || !name || !userId) {
        return reply(400, {
            error: 'Parameters missing in request.',
        });
    }

    const projectId = id || nanoid();

    // remove user agent from project
    const cleanedData = JSON.parse(data);
    cleanedData.meta.agent = '';
    cleanedData.custom = { name };

    try {
        await s3.putObject({
            Key: getKey(userId, `${projectId}.json`),
            Body: JSON.stringify(cleanedData),
            CacheControl: 'max-age=0',
            ContentType: 'application/json',
        }).promise();
    } catch (e) {
        console.error(e); // eslint-disable-line no-console
        return reply(500, {
            error: 'Saving failed.',
        });
    }

    if (name) {
        const putIndex = async (base = {}) => {
            const indexData = {
                name,
                updated_at: Date.now(),
            };
            if (!id) {
                indexData.created_at = Date.now();
            }

            base[projectId] = projectId in base ?
                {
                    ...base[projectId],
                    ...indexData,
                } : indexData;

            try {
                await s3.putObject({
                    Key: getKey(userId),
                    Body: JSON.stringify(base),
                    CacheControl: 'max-age=0',
                    ContentType: 'application/json',
                }).promise();
            } catch (e) {
                console.error(e);
            }
        };

        try {
            const indexFile = await s3.getObject({
                Key: getKey(userId),
            }).promise();
            const index = JSON.parse(indexFile.Body.toString());
            await putIndex(index);
        } catch (e) {
            if (e.code === 'NoSuchKey') {
                await putIndex();
            } else {
                console.error(e);
            }
        }
    }

    reply(200, {
        id: projectId,
    });
});
