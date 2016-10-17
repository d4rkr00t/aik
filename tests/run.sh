#!/bin/sh

cd tests

if [ ! -f "package.json" ]; then
  cp _package.json package.json
fi

if [ -d "examples" ]; then
  cd examples
  git pull
  cd -
else
  git clone https://github.com/d4rkr00t/aik-examples.git examples
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
# DEV SERVER
#

print_header "Thinkin in React -r -c"
AIK_TEST=1 ./../cli.js examples/thinking-in-react/src/index.js -r -c

print_header "Thinkin in React -r -n -o -c"
AIK_TEST=1 ./../cli.js examples/thinking-in-react/src/index.js -r -n -o -c

print_header "Simple Counter in Cycle.js"
AIK_TEST=1 ./../cli.js examples/simple-counter-cyclejs/src/index.js

print_header "Simple Counter in Cycle.js -p"
AIK_TEST=1 ./../cli.js examples/simple-counter-cyclejs/src/index.js -p 3232

print_header "TodoMVC Vue"
AIK_TEST=1 ./../cli.js examples/todomvc-vue/src/index.js

#
# BUILD
#

print_header "Thinkin in React --build -c"
AIK_TEST=1 ./../cli.js examples/thinking-in-react/src/index.js --build -c

print_header "Thinkin in React --build custom -c"
AIK_TEST=1 ./../cli.js examples/thinking-in-react/src/index.js --build custom -c

print_header "Simple Counter in Cycle.js --build custom --base \"/test/\""
AIK_TEST=1 ./../cli.js examples/simple-counter-cyclejs/src/index.js --build custom2 --base "/test/"

print_header "Simple Counter in Cycle.js --build --base \"/test/\""
AIK_TEST=1 ./../cli.js examples/simple-counter-cyclejs/src/index.js --build --base "/test/"

#
# AFTER RUN
#

cd ..
