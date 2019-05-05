#!/bin/sh

SRC_DIR=$1
DEST_DIR=$2
FLAGS=$3

export AUTHOR_EMAIL="$(git log -1 $TRAVIS_COMMIT --pretty="%aE")"
export AUTHOR_NAME="$(git log -1 $TRAVIS_COMMIT --pretty="%aN")"

echo "${GITHUB_DEPLOY_KEY}" | base64 --decode > /tmp/deploy_key
chmod 600 /tmp/deploy_key
eval "$(ssh-agent -s)"
ssh-add /tmp/deploy_key

yarn gh-pages -d ${SRC_DIR} -e ${DEST_DIR} \
              -m "Upload ${SRC_DIR} from ${TRAVIS_BRANCH}" \
              -r git@github.com:${TRAVIS_REPO_SLUG}.git \
              -u "${AUTHOR_NAME} <${AUTHOR_EMAIL}>" \
              ${FLAGS}
