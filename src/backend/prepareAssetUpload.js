import initS3 from './lib/s3';

const customEndpoint = 'STORAGE_ENDPOINT_FRONTEND' in process.env ? process.env.STORAGE_ENDPOINT_FRONTEND : null;
const s3 = initS3(customEndpoint);

export const handler = async (event, context, callback) => {
    const { filename } = JSON.parse(event.body);
    if (!filename) {
        callback(null, {
            statusCode: 400,
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                error: "Request parameter 'Key' missing.",
            }),
        });
        return;
    }

    const params = {
        Bucket: process.env.STORAGE_BUCKET || process.env.S3_BUCKET_PROJECTS,
        Key: `assets/${filename}`,
    };

    // check for existence of asset
    try {
        await s3.headObject(params).promise();
        callback(null, {
            statusCode: 409,
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                exists: true,
            }),
        });
        return;
    } catch (e) {}

    const presignedUrl = s3.getSignedUrl('putObject', params);
    callback(null, {
        statusCode: 200,
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify({
            uploadUrl: presignedUrl,
        }),
    });
};
