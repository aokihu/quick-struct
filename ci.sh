#!/bin/sh

yarn test

if test 0 = $?; then
    echo "Test pass!"
    yarn pack
fi