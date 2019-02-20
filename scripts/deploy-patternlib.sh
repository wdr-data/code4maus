#!/bin/sh

# Build

yarn build-storybook -o .patternlib


# Deploy

export AUTHOR_EMAIL="$(git log -1 $TRAVIS_COMMIT --pretty="%aE")"
export AUTHOR_NAME="$(git log -1 $TRAVIS_COMMIT --pretty="%aN")"

echo "$GITHUB_DEPLOY_KEY" > /tmp/ssh-deploy-pages
chmod 600 /tmp/ssh-deploy-pages

eval "$(ssh-agent -s)"
ssh-add /tmp/ssh-deploy-pages

yarn gh-pages -d .patternlib \
              -m "Update patternlib from ${TRAVIS_BRANCH}" \
              -r git@github.com:${TRAVIS_REPO_SLUG}.git \
              -u "${AUTHOR_NAME} <${AUTHOR_EMAIL}>"
