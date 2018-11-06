#!/bin/bash

set -e

ASSET_PATH="/assets/external/${SERVICE_NAME}/${BRANCH}/${COMMIT_HASH}"

fail() {
  echo "FAIL: $*"
  exit 1
}

prepare_assets() {
    echo "Preparing assets with ${ASSET_PATH}"

    sed -i -e "s=@@ASSET_PATH=${ASSET_PATH}=" dist/index.html
    sed -i -e "s=@@ASSET_PATH=${ASSET_PATH}=" dist/index-standalone.html
    sed -i -e "s=showcar-icons.js.map=${ASSET_PATH}/showcar-icons.js.map=" dist/showcar-icons.js
    sed -i -e "s=showcar-tracking.js.map=${ASSET_PATH}/showcar-tracking.js.map=" dist/showcar-tracking.js
    sed -i -e "s=showcar-ui.js.map=${ASSET_PATH}/showcar-ui.js.map=" dist/showcar-ui.js
    sed -i -e "s=showcar-ui.css.map=${ASSET_PATH}/showcar-ui.css.map=" dist/showcar-ui.css
}

upload_to_s3() {
    echo "Uploading assets to s3://as24-assets-eu-west-1/${SERVICE_NAME}/${BRANCH}/${GIT_COMMIT}/"

    aws --region "eu-west-1" s3 cp dist "s3://as24-assets-eu-west-1/${SERVICE_NAME}/${BRANCH}/${GIT_COMMIT}/" --recursive --exclude "*.html" --cache-control "max-age=2592000" --acl public-read
    aws --region "eu-west-1" s3 cp dist "s3://as24-assets-eu-west-1/${SERVICE_NAME}/${BRANCH}/${GIT_COMMIT}/" --recursive --exclude "*" --include "*.html" --cache-control "max-age=300" --acl public-read

    aws --region "eu-west-1" s3 cp dist "s3://as24-assets-eu-west-1/${SERVICE_NAME}/${BRANCH}/latest/" --recursive --exclude "*.html" --cache-control "max-age=2592000" --acl public-read
    aws --region "eu-west-1" s3 cp dist "s3://as24-assets-eu-west-1/${SERVICE_NAME}/${BRANCH}/latest/" --recursive --exclude "*" --include "*.html" --cache-control "max-age=300" --acl public-read

    aws --region "eu-west-1" s3 cp dist "s3://as24-assets-eu-west-1/${SERVICE_NAME}/" --recursive --exclude "*" --include "*-fragment.html" --cache-control "max-age=300" --acl public-read
}

prepare_assets
upload_to_s3
