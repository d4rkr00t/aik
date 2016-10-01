<div align="center">
  <img src="/assets/aik.png" alt="aik" width="250" align="center">
</div>
<big><h1 align="center">Aik</h1></big>
<p align="center"><big>
Frontend Playground
</big></p>
<p align="center">
  <a href="https://npmjs.org/package/aik">
    <img src="https://img.shields.io/npm/v/aik.svg" alt="NPM Version">
  </a>

  <a href="http://opensource.org/licenses/MIT">
    <img src="https://img.shields.io/npm/l/aik.svg" alt="License">
  </a>

  <a href="https://github.com/d4rkr00t/aik/issues">
    <img src="https://img.shields.io/github/issues/d4rkr00t/aik.svg" alt="Github Issues">
  </a>

  <a href="https://travis-ci.org/d4rkr00t/aik">
    <img src="https://img.shields.io/travis/d4rkr00t/aik.svg" alt="Travis Status">
  </a>

  <a href="http://commitizen.github.io/cz-cli/">
    <img src="https://img.shields.io/badge/commitizen-friendly-brightgreen.svg" alt="Commitizen Friendly">
  </a>
</p>

## Objectives

This project aims to help to prototype fast and not supposed to be a part of any production-ready system.
If you want solutions which are better for production usage you can take a look at the [alternatives](#alternatives) list down below.

Aiks main goal is to be open for any JavaScript framework or library, even though it has extra features for React.

## Quick Start

```sh
npm i -g aik
aik index.js -o
```

![aik quick start](/assets/dev.png)

## Table of Content

* [Objectives](#objectives)
* [Quick Start](#quick-start)
* [Usage](#usage)
* [Features](#features)
  * [Run web server with JavaScript file](#run-web-server-with-javascript-file)
  * [Automatically install npm modules](#automatically-install-npm-modules)
  * [Custom templates](#custom-templates)
  * [Hot reload](#hot-reload)
  * [Latest and greatest technologies for frontend development](#latest-and-greatest-technologies-for-frontend-development)
  * [Linting](#linting)
  * [Production ready build](#production-ready-build)
  * [Expose web server to the real world](#expose-web-server-to-the-real-world)
  * [Great Messages](#great-messages)
* [Alternatives](#alternatives)
* [License](#license)
* [Contributing](#contributing)

## Usage

```sh
Usage
  $ aik filename.js

Options
  -b  --build       Build production version for given entry point. [Default output: dist]
  -u, --base        Base path from witch urls in build begins
  -p, --port        Web server port. [Default: 8080]
  -h, --host        Web server host. [Default: localhost]
  -r, --react       Enables react hot loader.
  -n, --ngrok       Exposes server to real world by ngrok.
  -o, --open        Opens web server url in default browser.
  -c, --cssmodules  Enables css modules.
  -v, --version     Shows version.
  --help            Shows help.

Examples
  $ aik filename.js --port 3000 -n -c -r
  Runs aik web server on 3000 port with ngrok, css modules support and react hot loader

  $ aik filename.js --build
  Builds filename.js for production use and saves output to dist folder.
```

## Features

### Run web server with JavaScript file

Start playing around with new ideas is as simple as running a single command in your terminal:

```sh
aik index.js
```

### Automatically install npm modules

Aik takes care of installing npm modules for you automatically using "[npm install webpack plugin](https://github.com/ericclemmons/npm-install-webpack-plugin)".
Just add require or import statement in the JavaScript file and you are ready to go.

```js
import react from 'react';
import ReactDOM from 'react-dom';
```

### Custom templates

By default, Aik uses built-in into the "[html-webpack-plugin](https://github.com/ampedandwired/html-webpack-plugin)" template,
but it's easy to create your own. Just add an HTML file with the same name as the JavaScript file.

```
aik-test/
├── index.js
└── index.html
```

**Important:** Do not add script tag with src to the JavaScript file (in the example above to index.js) Aik will do it automatically.

### Hot reload

Aik sets up hot reloading for CSS and with an extra option '-r' for React components using @gaeron's [react-hot-loader](https://github.com/gaearon/react-hot-loader).

```sh
aik index.js -r # option for enabling react hot loading
```

### Latest and greatest technologies for frontend development

There are (an opinionated) set of technologies that will help you prototype faster. Aik uses [preset-latest](http://babeljs.io/docs/plugins/preset-latest/) for babel which contains all yearly presets.
And also you don't have to worry about all these messy prefixes in CSS because there is an autoprefixer which will do it for you.
Moreover, there is a little bit of syntactic sugar over CSS provided by PostCSS and PreCSS.

* Modern javascript with [Babel](https://babeljs.io/) using [Latest](http://babeljs.io/docs/plugins/preset-latest/) and [React](http://babeljs.io/docs/plugins/preset-react/) presets
* [PostCSS](https://github.com/postcss/postcss) with [Autoprefixer](https://github.com/postcss/autoprefixer) and [PreCSS](https://github.com/jonathantneal/precss)
* [Optional] — [css-modules](https://github.com/css-modules/css-modules)

### Linting

Aik comes with set up linters. Nothing annoying about code style, only rules which help you find potential errors.

* [ESLint](http://eslint.org/)
* [ESLint React Plugin](https://github.com/yannickcr/eslint-plugin-react) for linting React specific things

### Production ready build

```sh
aik index.js --build
```

Produces minimized build for production usage. It's easy to publish prototype to GitHub pages, Surge, or wherever you want.
Important that assets urls are relative to the root:

```html
<script type="text/javascript" src="/index.c699c867.js"></script></body>
```

If you want to host build in sub directory (e.g. https://my-web-site.com/sub-dir/) you should run Aik with the '--base' flag:

```sh
aik index.js --build --base "/my-sub-folder"
```

Now assets urls are relative to specified base path:

```html
<script type="text/javascript" src="/my-sub-folder/index.c699c867.js"></script></body>
```

### Expose web server to the real world

Optionally, by providing '-n' flag you can expose web server to the real world using "[Ngrok](https://github.com/bubenshchykov/ngrok)".

```sh
aik index.js -n # option for enabling ngrok
```

### Great Messages

Highly inspired by create-react-app and some other places.

#### Dev Server Error

![aik dev server error](/assets/dev-error.png)

#### Build Successfully Finished

![aik build success](/assets/build-success.png)

More examples [here](/docs/messages.md).

## Alternatives

* [create-react-app](https://github.com/facebookincubator/create-react-app)
* [enclave](https://github.com/eanplatter/enclave)
* [nwb](https://github.com/insin/nwb)
* [motion](https://github.com/motion/motion)
* [rackt-cli](https://github.com/mzabriskie/rackt-cli)
* [budō](https://github.com/mattdesl/budo)
* [rwb](https://github.com/petehunt/rwb)
* [quik](https://github.com/satya164/quik)
* [sagui](https://github.com/saguijs/sagui)
* [roc](https://github.com/rocjs/roc)
* [react-app](https://github.com/kriasoft/react-app)
* [dev-toolkit](https://github.com/stoikerty/dev-toolkit)
* [mozilla-neo](https://github.com/mozilla/neo)
* [tarec](https://github.com/geowarin/tarec)

## Author

Stanislav Sysoev d4rkr00t@gmail.com https://github.com/d4rkr00t/aik

## License

- **MIT** : http://opensource.org/licenses/MIT

## Contributing

Contributions are highly welcome! This repo is commitizen friendly — please read about it [here](http://commitizen.github.io/cz-cli/).

**I'll appreciate any grammatical or spelling corrections as I'm not a native speaker.**
