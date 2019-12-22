#!/bin/bash

git -C public commit -m "Travis build: $TRAVIS_BUILD_NUMBER" -a \
    && git -C public push -u origin HEAD:master
