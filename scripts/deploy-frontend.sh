#!/bin/bash

aws sts get-caller-identity

# todo: make dynamic via serverless
BUCKET="hackingstudio-code4maus-app"

if [ "$BRANCH" == "production" ]; then
    BUCKET="${BUCKET}-prod"
elif [ "$BRANCH" == "develop" ]; then
    BUCKET="${BUCKET}-staging"
else
    BUCKET="${BUCKET}-dev"
fi

echo "Deploying to bucket: ${BUCKET}"
aws s3 sync build s3://${BUCKET} --delete --acl public-read
for FILE in $(find build -name index.html -printf '%P\n'); do
    aws s3 cp build/${FILE} s3://${BUCKET}/${FILE} --metadata-directive REPLACE --cache-control max-age=0,no-cache,no-store,must-revalidate --content-type text/html --acl public-read
done

aws s3 cp build/service-worker.js s3://${BUCKET}/service-worker.js --metadata-directive REPLACE --cache-control max-age=0,no-cache,no-store,must-revalidate --content-type application/javascript --acl public-read
