#!/bin/bash

set -x

cd public \
    && echo "johnsonlee.io" > CNAME \
    && git init \
    && git remote add origin https://${GH_TOKEN}@github.com/johnsonlee/johnsonlee.github.io.git \
    && git add . \
    && git status -s \
    && git commit -m "Travis build: $TRAVIS_BUILD_NUMBER" -a \
    && git push -u origin HEAD:master --force
