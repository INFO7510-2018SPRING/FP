#!/usr/bin/env sh
rm -rf build
mkdir -p build
../../node_modules/.bin/solcjs --bin --abi *.sol -o ./build
