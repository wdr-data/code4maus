import initS3 from './lib/s3';
import nanoid from 'nanoid';

const s3 = initS3();

export const handler = async (event, context, callback) => {
    const { type } = JSON.parse(event.body);

    if (!type) {
        return {
            statusCode: 400,
            body: 'Parameter missing',
        };
    }
    const id = nanoid();
    const sharingKey = `${id}.${encodeURIComponent(type)}`;

    const bucket = process.env.STORAGE_BUCKET || process.env.S3_BUCKET_PROJECTS;
    const key = `data/sharing/${sharingKey}`;
    const params = {
        Bucket: bucket,
        Key: key,
    };

    const presignedUrl = s3.getSignedUrl('putObject', params);
    return {
        statusCode: 200,
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify({
            uploadUrl: presignedUrl,
            sharingKey,
        }),
    };
};
