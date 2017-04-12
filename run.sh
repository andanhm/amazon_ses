#!/bin/bash

VERSION="1.0.0"
APPNAME="amazone-ses"

SOURCE=$(pwd)/src
NODE_ENV=${1-"development"}

echo "Environment: ${NODE_ENV}"
echo "Source: ${SOURCE}"
[ $(docker ps -a | grep ${APPNAME} | wc -l) -gt 0 ] && docker ps -a | grep ${APPNAME} | awk '{print $1}' | xargs docker rm -f
if [ "${NODE_ENV}" == "development" ]; then
  docker run -it --name="${APPNAME}" -e NODE_ENV="${NODE_ENV}" -v ${SOURCE}/:/usr/src -p 6633:6633 -p 8080:8080 ${APPNAME}:${VERSION}
fi