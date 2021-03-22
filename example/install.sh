#! /usr/bin/env bash
set -ex

yarn --force

cd ./node_modules/storybook-addon-relay
rm -rf node_modules example src tsconfig.json yarn.lock .eslintignore .eslintrc.js .prettierignore .prettierrc.js