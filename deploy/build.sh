#!/bin/bash

set -e

fail() {
  echo "FAIL: $*"
  exit 1
}

build_code() {
    sed -i -e "s=@@COMMIT_HASH@@=${GIT_COMMIT}=" ./package.json
    npm install -f
    npm run build
    npm run docs
}

build_code
