#!/bin/bash

VERSION="1.0.0"
APPNAME="amazone-ses"

rsync -av -r -c --progress ./src ./docker --exclude node_modules --exclude npm_debug.log --delete-excluded

docker build --tag "${APPNAME}:${VERSION}" --rm=true --force-rm=true --no-cache=true ./docker/

rm -Rf ./docker/src
