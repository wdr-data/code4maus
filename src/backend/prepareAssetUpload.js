import AWS from 'aws-sdk';
import nanoid from 'nanoid';
const s3 = new AWS.S3();

const Bucket = `${process.env.S3_BUCKET_PREFIX}-staging`;

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
