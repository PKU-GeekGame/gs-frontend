#!/bin/bash

VITE_APP_BUILD_INFO=$(date +"%y%m%d%H%M") GENERATE_SOURCEMAP=false npm run build

rm -rf build-finished
mv build build-finished
