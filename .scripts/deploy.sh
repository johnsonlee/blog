#!/bin/bash

set -x

pwd

find . \( -path ./.git -o -path ./node_modules \) -prune -o -print

echo "johnsonlee.io" > public/CNAME \
    && git -C public add . \
    && git -C public commit -m "Travis build: $TRAVIS_BUILD_NUMBER" -a \
    && git -C public push -u origin HEAD:master --force
