/**
 * Ugly hack which solves an issue with not loading images with generated urls in css files.
 * This file loads up before entry point and dynamically sets public path to, for example, "http://localhost:4444/".
 * Depends on current phost and port. And also it works well with ngrok exposed servers.
 *
 * Related issues: https://github.com/webpack/style-loader/pull/96
 */
__webpack_public_path__ = window.location.protocol + '//' + window.location.host + '/'; // eslint-disable-line
