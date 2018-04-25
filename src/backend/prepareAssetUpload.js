import initS3 from './lib/s3';

const s3 = initS3();
const Bucket = process.env.S3_BUCKET_PROJECTS;

export const handler = async (event, context, callback) => {
    const {filename} = JSON.parse(event.body);
    if (!filename) {
        callback(null, {
            statusCode: 400,
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                error: "Request parameter 'Key' missing."
            })
        });
    }

    const presignedUrl = s3.getSignedUrl('putObject', {
        Bucket,
        Key: `assets/${filename}`
    });
    callback(null, {
        statusCode: 200,
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            uploadUrl: presignedUrl
        })
    });
};
