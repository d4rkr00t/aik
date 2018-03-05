<br/>
<br/>
<br/>
<div align="center">
  <img src="/assets/aik.png" alt="aik" width="350" align="center">
</div>
<br/>
<br/>
<br/>
<br/>
<div align="center">
  <img src="/assets/hero-image.png" alt="aik hero image" align="center">
</div>
<br/>
<br/>
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
<br/>
<br/>

This project aims to help to prototype faster and not supposed to be a part of any production-ready system. If you want
solutions that are better for production use case you can take a look at the [alternatives](#alternatives) section down
below.

## Quick Start

```sh
npm i -g aik # install using npm cli
yarn global add aik # or install using yarn

aik index.js -o

# or using npm's npx

npx aik index.js
```

![aik quick start](/assets/dev.png)

## Table of Content

* [Quick Start](#quick-start)
* [Usage](#usage)
* [Examples](#examples)
* [Features](#features)
  * [Run web server with JavaScript file](#run-web-server-with-javascript-file)
  * [NPM Modules](#npm-modules)
  * [Custom templates](#custom-templates)
  * [Frameworks Support](#frameworks-support)
    * [Framework Autodetection](#framework-autodetection)
    * [React](#react)
  * [Latest and greatest technologies for frontend development](#latest-and-greatest-technologies-for-frontend-development)
  * [Linting](#linting)
  * [Production ready build](#production-ready-build)
  * [Expose web server to the real world](#expose-web-server-to-the-real-world)
  * [Great Messages](#great-messages)
* [Other resources](#other-resources)
* [Alternatives](#alternatives)
* [Contributors](#contributors)
* [Contributing](#contributing)
* [License](#license)

## Usage

```sh
Usage
  $ aik filename.js

Options
  -b  --build       Build production version for given entry point. [Default output: dist]
  -u, --base        Base path with which URLs in build begins
  -p, --port        Web server port. [Default: 8080]
  -h, --host        Web server host. [Default: localhost]
  -n, --ngrok       Exposes server to the real world by ngrok.
  -o, --open        Opens web server URL in the default browser.
  -v, --version     Shows version.
  --help            Shows help.

Examples
  $ aik filename.js --port 3000 -n
  Runs aik web server on 3000 port with ngrok and react hot loader

  $ aik filename.js --build
  Builds filename.js for production use and saves the output to dist folder.
```

## Examples

* Repository with example usage of Aik — [aik-examples](https://github.com/d4rkr00t/aik-examples).
* [English Cards](https://github.com/d4rkr00t/english-cards)

## Features

### Run web server with a JavaScript file

To start experimenting with new ideas is as simple as running a single command in your terminal:

```sh
aik index.js
```

Moreover, Aik:

* Creates an entry point if it doesn't exist.
* Chooses server port automatically if default one is in use.
* Shows an error overlay, so you don't have to look at your terminal at all.

### NPM Modules

For simplifying work with npm modules Aik takes care of:

#### Automatic installation of npm modules

Just add a require or an import statement in a JavaScript file and you are ready to go.

```js
import react from "react";
import ReactDOM from "react-dom";
```

#### Pre-installing NPM Modules

If there is a `package.json` file, Aik will automatically pre-install npm modules defined in it, before trying to
compile an entry point.

### Custom templates

By default, Aik uses built-in into the "[html-webpack-plugin](https://github.com/ampedandwired/html-webpack-plugin)"
template, but it's easy to create your own. Just add an HTML file with the same name as the JavaScript file.

```
aik-test/
├── index.js
└── index.html
```

**Important:** Do not add script tag with src to the JavaScript file (in the example above to index.js) Aik will do it
automatically.

### Frameworks Support

#### Framework Autodetection

Aik parses an entry point in order to figure out framework that is being used in an application.
It's done by analyzing imports e.g. `import React from 'react';` will trigger react support.
Also it's possible to manually specify framework if an entry point doesn't provide any clues
by just adding a comment on top of the file:

```js
// aik-mode: react
```

#### React

In order to enable hot loading and hot module replacement – an entry point of an application should export default a react component:

```js
import React from "react";

export default function App() {
  return <div>My React App.</div>;
}
```

This will wrap react component in an RHL compatible wrapper enabling hot reloading for react components and also mounts
component to an element with id = `app`.

Also, you can manually wrap your component in react-hot-loader wrapper as described in
[RHL's readme](https://github.com/gaearon/react-hot-loader/#migrating-from-create-react-app).

### Latest and greatest technologies for frontend development

There are (an opinionated) set of technologies that will help you prototype faster. Aik uses
[preset-env](http://babeljs.io/docs/plugins/preset-env/) for babel which contains all yearly presets. And also you don't
have to worry about all these messy prefixes in CSS because there is an autoprefixer which will do it for you. Moreover,
there is a little bit of syntactic sugar over CSS provided by PostCSS and PreCSS.

* Modern javascript with [Babel](https://babeljs.io/) using [Env](http://babeljs.io/docs/plugins/preset-env/) and
  [React](http://babeljs.io/docs/plugins/preset-react/) presets
* [PostCSS](https://github.com/postcss/postcss) with [Autoprefixer](https://github.com/postcss/autoprefixer) and
  [PreCSS](https://github.com/jonathantneal/precss)

#### Cutom .babelrc files

If there is a .babelrc file in a project Aik will use it automatically.
That allows for better customization of a build as well as adds an ability to experiment with latest, experimental, features
that are not yet enabled in Aik by default.

### Linting

Aik comes with set up linters. Nothing annoying about code style, only rules which help you find potential errors.

* [ESLint](http://eslint.org/)
* [ESLint React Plugin](https://github.com/yannickcr/eslint-plugin-react) for linting React specific things

### Production ready build

```sh
aik index.js --build
```

Build command produces optimized for production use bundle. This makes it easy to publish prototype to GitHub pages, Surge, Now or wherever you
want. Important that assets urls are relative to the root:

```html
<script type="text/javascript" src="/index.c699c867.js"></script></body>
```

If you want to host a build in a sub directory (e.g. https://my-web-site.com/sub-dir/) you should run Aik with the '--base'
flag:

```sh
aik index.js --build --base "/my-sub-folder"
```

Now assets urls are relative to a specified base path:

```html
<script type="text/javascript" src="/my-sub-folder/index.c699c867.js"></script></body>
```

### Expose web server to the real world

Optionally, by providing '-n' flag you can expose web server to the real world using
"[Ngrok](https://github.com/bubenshchykov/ngrok)".

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

## Other resources

* Video from SydJS Talk: ["Aik - Painless Prototyping"](https://www.youtube.com/watch?v=KnaX7MXJdao)
* Slides for SydJS talk: ["Aik – Painless Prototyping"](http://sysoev.org/talks/aik/)

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

Stanislav Sysoev d4rkr00t@gmail.com https://sysoev.org

## Contributors

* [Amandeep](https://github.com/a-s-o)

## Contributing

Contributions are highly welcome! This repo is commitizen friendly — please read about it
[here](http://commitizen.github.io/cz-cli/).

**I'll appreciate any grammatical or spelling corrections as I'm not a native speaker.**

## License

* **MIT** : http://opensource.org/licenses/MIT
