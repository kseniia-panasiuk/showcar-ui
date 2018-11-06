#!/bin/bash

set -ev

RELEASE_BRANCH="build-${COMMIT_HASH}"

fail() {
  echo "FAIL: $*"
  exit 1
}

prepare() {
    git checkout -b $RELEASE_BRANCH
    PACKAGE_VERSION=$(node -p -e "require('./package.json').version")
    git rm Jenkinsfile
    git add dist
    git add docs
    git commit -am "build ${COMMIT_HASH} release ${PACKAGE_VERSION}"
    TAG="v${PACKAGE_VERSION}"
    git tag -a $TAG -m "build ${COMMIT_HASH} release ${PACKAGE_VERSION}"
    git push origin $TAG
}


publish() {
    npm publish
}

clean () {
    git checkout master
    git branch -D origin $RELEASE_BRANCH
}

prepare
#publish
clean
