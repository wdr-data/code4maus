import AWS from 'aws-sdk';

let options = {
    params: {
        Bucket: process.env.S3_BUCKET_PROJECTS,
    },
};

if ('FUNCTIONS_AWS_ACCESS_KEY_ID' in process.env &&
   'FUNCTIONS_AWS_SECRET_ACCESS_KEY' in process.env) {
    options = {
        ...options,
        accessKeyId: process.env.FUNCTIONS_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.FUNCTIONS_AWS_SECRET_ACCESS_KEY,
    };
}

if ('FUNCTIONS_AWS_REGION' in process.env) {
    options = {
        ...options,
        region: process.env.FUNCTIONS_AWS_REGION,
    };
}

if ('USE_MINIO'in process.env && process.env.USE_MINIO === '1') {
    options = {
        ...options,
        endpoint: 'http://localhost:9000',
        s3ForcePathStyle: true,
        signatureVersion: 'v4',
        params: {
            Bucket: 'data',
        },
    };
}

export default function() {
    return new AWS.S3(options);
}
