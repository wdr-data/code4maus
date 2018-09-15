#!/bin/bash

# todo: make dynamic via serverless
BUCKET="hackingstudio-code4maus-app"

if [ "$TRAVIS_BRANCH" == "production" ]; then
    BUCKET="${BUCKET}-prod"
else
    BUCKET="${BUCKET}-staging"
fi

aws s3 sync build s3://${BUCKET} --delete --acl public-read
