const fs = require('fs');
const path = require('path');

const bucketSuffix = process.env.BRANCH === 'production' ? 'prod' : 'staging';
const bucketUrl = `https://${process.env.S3_BUCKET_PREFIX}-${bucketSuffix}` +
    `.s3.dualstack.${process.env.FUNCTIONS_AWS_REGION || process.env.AWS_REGION}.amazonaws.com`;

const templ = `
/api/*   /.netlify/functions/:splat    200!
/data/*  ${bucketUrl}/:splat           200!
/*       /index.html                   200
`;

fs.writeFileSync(path.resolve(__dirname, '../build/_redirects'), templ);
