#!/bin/bash

# todo: make dynamic via serverless
BUCKET="hackingstudio-code4maus-app"

if [ "$TRAVIS_BRANCH" == "production" ]; then
    BUCKET="${BUCKET}-prod"
else
    BUCKET="${BUCKET}-staging"
fi

aws s3 sync build s3://${BUCKET} --delete --acl public-read
aws s3 cp s3://${BUCKET}/index.html s3://${BUCKET}/index.html --metadata-directive REPLACE --cache-control max-age=0,no-cache,no-store,must-revalidate --content-type text/html --acl public-read
