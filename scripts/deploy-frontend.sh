#!/bin/bash

# todo: make dynamic via serverless
BUCKET="hackingstudio-code4maus-app"

if [ "$TRAVIS_BRANCH" == "production" ]; then
    BUCKET="${BUCKET}-prod"
elif [ "$TRAVIS_BRANCH" == "develop" ]; then
    BUCKET="${BUCKET}-staging"
else
    BUCKET="${BUCKET}-dev"
fi

aws s3 sync build s3://${BUCKET} --delete --acl public-read
aws s3 cp build/index.html s3://${BUCKET}/index.html --metadata-directive REPLACE --cache-control max-age=0,no-cache,no-store,must-revalidate --content-type text/html --acl public-read
aws s3 cp build/service-worker.js s3://${BUCKET}/service-worker.js --metadata-directive REPLACE --cache-control max-age=0,no-cache,no-store,must-revalidate --content-type application/javascript --acl public-read
