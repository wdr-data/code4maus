import initS3 from './lib/s3';
import nanoid from 'nanoid';

const s3 = initS3();

export const handler = async (event, context, callback) => {
    const id = nanoid();

    const bucket = process.env.STORAGE_BUCKET || process.env.S3_BUCKET_PROJECTS;
    const key = `data/sharing/${id}`;
    const params = {
        Bucket: bucket,
        Key: key,
        ACL: 'public-read',
    };

    const presignedUrl = s3.getSignedUrl('putObject', params);
    callback(null, {
        statusCode: 200,
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify({
            uploadUrl: presignedUrl,
            publicUrl: `https://s3.eu-central-1.amazonaws.com/${bucket}/${key}`,
        }),
    });
};
