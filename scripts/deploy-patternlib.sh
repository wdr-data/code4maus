#!/bin/sh

# Build

yarn build:patternlib


# Deploy

export AUTHOR_EMAIL="$(git log -1 $TRAVIS_COMMIT --pretty="%aE")"
export AUTHOR_NAME="$(git log -1 $TRAVIS_COMMIT --pretty="%aN")"

echo "${GITHUB_DEPLOY_KEY}" | base64 --decode > /tmp/deploy_key
chmod 600 /tmp/deploy_key
eval "$(ssh-agent -s)"
ssh-add /tmp/deploy_key

yarn gh-pages -d .patternlib \
              -m "Update patternlib from ${TRAVIS_BRANCH}" \
              -r git@github.com:${TRAVIS_REPO_SLUG}.git \
              -u "${AUTHOR_NAME} <${AUTHOR_EMAIL}>"
