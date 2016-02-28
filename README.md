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

  <a href="https://coveralls.io/github/d4rkr00t/aik">
    <img src="https://img.shields.io/coveralls/d4rkr00t/aik.svg" alt="Coveralls">
  </a>

  <a href="http://commitizen.github.io/cz-cli/">
    <img src="https://img.shields.io/badge/commitizen-friendly-brightgreen.svg" alt="Commitizen Friendly">
  </a>

</p>


## Features
* Runs web server with given javascript file.
* [Automaticaly installs npm modules](https://github.com/ericclemmons/npm-install-webpack-plugin).
* [Hot reload react components](https://github.com/gaearon/react-hot-loader).
* Hot reload css.
* Transpile javascript with [babel](https://babeljs.io/) using [es2015](http://babeljs.io/docs/plugins/preset-es2015/) and [react](http://babeljs.io/docs/plugins/preset-react/) presets.
* [PostCSS](https://github.com/postcss/postcss) with [autoprefixer](https://github.com/postcss/autoprefixer) and [precss](https://github.com/jonathantneal/precss).
* Optional enables [css-modules](https://github.com/css-modules/css-modules).
* Optional exposes web server to real world by [ngrok](https://github.com/bubenshchykov/ngrok).

## Install

```sh
npm install -g aik
```

## Usage

```sh
Usage
  $ aik filename.js

Options
  -p, --port        Web server port. [Default: 8080]
  -h, --host        Web server host. [Default: localhost]
  -n, --ngrok       Exposes server to real world by ngrok.
  -c, --cssmodules  Enables css modules.
  --help            Shows help.

Examples
  $ aik filename.js --port 3000 -n -c
  Runs aik web server on 3000 port with ngrok and css modules support
```

## Author

Stanislav Sysoev d4rkr00t@gmail.com https://github.com/d4rkr00t/aik

## License

- **MIT** : http://opensource.org/licenses/MIT

## Contributing

Contributions are highly welcome! This repo is commitizen friendly — please read about it [here](http://commitizen.github.io/cz-cli/).
