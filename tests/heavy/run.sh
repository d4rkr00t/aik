#!/bin/sh

cd tests/heavy

if [ ! -f "package.json" ]; then
  cp _package.json package.json
fi

print_header() {
  local color_title="\033[0;34m"
  local color_reset="\033[0m"
  local color_info="\033[1;33m"
  echo ""
  echo "${color_info}$1${color_reset}"
  echo ""
}

#
# BUILD
#

print_header "Thinkin in React --build"
AIK_TEST=1 ./../../cli.js examples/thinking-in-react/src/index.js --build

print_header "Thinkin in React --build custom"
AIK_TEST=1 ./../../cli.js examples/thinking-in-react/src/index.js --build custom

print_header "Simple Counter in Cycle.js --build custom --base \"/test/\""
AIK_TEST=1 ./../../cli.js examples/simple-counter-cyclejs/src/index.js --build custom2 --base "/test/"

print_header "Simple Counter in Cycle.js --build --base \"/test/\""
AIK_TEST=1 ./../../cli.js examples/simple-counter-cyclejs/src/index.js --build --base "/test/"

#
# AFTER RUN
#

cd ../..
