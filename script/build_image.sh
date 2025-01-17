#!/bin/bash

IMAGE=ops-web
TAG=$1

if [ -z "$TAG" ]; then
    TAG="dev"
fi

docker build -t ${IMAGE}:${TAG} .