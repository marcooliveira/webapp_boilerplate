#!/bin/bash

OLD_DIR=$(pwd)
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd "$SCRIPT_DIR/../src"
compass watch . sass/main.scss

cd "$OLD_DIR"