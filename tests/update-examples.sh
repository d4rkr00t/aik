#!/bin/bash

cd tests/heavy

if [ -d "examples" ]; then
  cd examples
  git pull
else
  git clone https://github.com/d4rkr00t/aik-examples.git examples
fi
