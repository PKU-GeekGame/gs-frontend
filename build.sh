#!/bin/bash

VITE_APP_BUILD_INFO=$(date +"%y%m%d%H%M") GENERATE_SOURCEMAP=false VITE_APP_ANTICHEAT_ENABLED=true npm run build

rm -rf build-finished
mv build build-finished
