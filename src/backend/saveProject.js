import AWS from 'aws-sdk';
import nanoid from 'nanoid';
const s3 = new AWS.S3();

const Bucket = `${process.env.S3_BUCKET_PREFIX}-staging`;
const user = 'testuser';
const getKey = (user, path = 'index.json') => `projects/${user}/${path}`;

const injectReplyJson = handler => (event, context, callback) => handler(event, context, (code, body) => callback(null, {
    statusCode: code,
    headers: {
        'content-type': 'application/json'
    },
    body: JSON.stringify(body)
}));

export const handler = injectReplyJson(async (event, context, reply) => {
    const {data, id, name} = JSON.parse(event.body);
    if (!data) {
        return reply(400, {
            error: 'Data missing in request.'
        });
    }

    const projectId = id || nanoid();

    // remove user agent from project
    const cleanedData = JSON.parse(data);
    cleanedData.meta.agent = '';
    cleanedData.custom = {name};

    try {
        await s3.putObject({
            Bucket,
            Key: getKey(user, `${projectId}.json`),
            Body: JSON.stringify(cleanedData)
        }).promise();
    } catch (e) {
        console.error(e); // eslint-disable-line no-console
        return reply(500, {
            error: 'Saving failed.'
        });
    }

    if (name) {
        const putIndex = async (base = {}) => {
            const indexData = {
                name,
                updated_at: Date.now()
            };
            if (!id) {
                indexData.created_at = Date.now();
            }

            base[projectId] = projectId in base ?
                {
                    ...base[projectId],
                    ...indexData
                } : indexData;

            try {
                await s3.putObject({
                    Bucket,
                    Key: getKey(user),
                    Body: JSON.stringify(base)
                }).promise();
            } catch (e) {
                console.error(e);
            }
        };

        try {
            const indexFile = await s3.getObject({
                Bucket,
                Key: getKey(user)
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
        id: projectId
    });
});
