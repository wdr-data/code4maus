import AWS from 'aws-sdk';

const hasCustomAccessKeys = 'FUNCTIONS_AWS_ACCESS_KEY_ID' in process.env &&
                            'FUNCTIONS_AWS_SECRET_ACCESS_KEY' in process.env;

export default function () {
    return new AWS.S3(hasCustomAccessKeys ? {
        accessKeyId: process.env.FUNCTIONS_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.FUNCTIONS_AWS_SECRET_ACCESS_KEY
    } : {});
}
