#!/bin/bash

REACT_APP_BUILD_INFO=$(date +"%y%m%d%H%M") npm run build

rm -rf build-finished
mv build build-finished