import initS3 from './lib/s3';
import nanoid from 'nanoid';

const s3 = initS3();

const injectReplyJson = (handler) => (event, context, callback) => handler(event, context, (code, body) => callback(null, {
    statusCode: code,
    headers: {
        'content-type': 'application/json',
    },
    body: JSON.stringify(body),
}));

export const handler = injectReplyJson(async (event, context, reply) => {
    const id = nanoid();

    const contentTypeHeaderName = Object.keys(event.headers).find((headerName) => headerName.toLowerCase() === 'content-type');
    const contentType = event.headers[contentTypeHeaderName];

    if (contentType !== 'image/gif' && contentType !== 'image/png') {
        return reply(400, {
            error: 'Invalid image type',
        });
    }

    if (!event.body || event.body.length === 0) {
        return reply(400, {
            error: 'Empty request',
        });
    }

    try {
        await s3.putObject({
            Bucket: 'code4maus-sharing',
            Key: 'data/sharing/' + id,
            Body: event.body,
            CacheControl: 'max-age=0',
            ContentType: contentType,
        }).promise();
    } catch (e) {
        console.error(e); // eslint-disable-line no-console
        return reply(500, {
            error: 'Saving failed.',
        });
    }

    reply(200, {
        id,
    });
});
