#!/bin/bash

set -ev

RELEASE_BRANCH="build-${COMMIT_HASH}"
PACKAGE_VERSION=$(node -p -e "require('./package.json').version")

fail() {
  echo "FAIL: $*"
  exit 1
}

init() {
    USER_NAME="$(git log -1 --pretty=format:'%an')"
    USER_EMAIL="$(git log -1 --pretty=format:'%ae')"
    git config --global user.email "${USER_EMAIL}"
    git config --global user.name "${USER_NAME}"
}

publish_docs() {
    git checkout gh-pages
    git add docs
    git commit -am "build ${COMMIT_HASH} release ${PACKAGE_VERSION}" docs
    git push https://${GIT_USERNAME}:${GIT_PASSWORD}@github.com/Scout24/showcar-ui.git origin gh-pages
}

prepare_code() {
    git checkout -b $RELEASE_BRANCH
    git rm Jenkinsfile
    git add dist
    git add docs
    git commit -am "build ${COMMIT_HASH} release ${PACKAGE_VERSION}"
    TAG="v${PACKAGE_VERSION}"
    git tag -a $TAG -m "build ${COMMIT_HASH} release ${PACKAGE_VERSION}"
    git push https://${GIT_USERNAME}:${GIT_PASSWORD}@github.com/Scout24/showcar-ui.git origin $TAG
}

npm_publish() {
    npm publish
}

clean () {
    git checkout master
    git branch -D origin $RELEASE_BRANCH
}

init
prepare_code
#publish
#publish_docs
clean
