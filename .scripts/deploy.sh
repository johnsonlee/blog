#!/bin/bash

set -x

cd public \
    && echo "johnsonlee.io" > CNAME \
    && git add . \
    && git status -s \
    && git commit -m "Travis build: $TRAVIS_BUILD_NUMBER" -a \
    && git push -u origin HEAD:master --force
