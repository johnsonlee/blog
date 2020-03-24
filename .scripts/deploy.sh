#!/bin/bash

set -x

echo "johnsonlee.io" > public/CNAME \
    && git -C public add . \
    && git -C public commit -m "Travis build: $TRAVIS_BUILD_NUMBER" -a \
    && git -C public push -u origin HEAD:master --force
