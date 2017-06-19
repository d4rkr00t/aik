module.exports = {
  rootUrl: "http://127.0.0.1:4444",
  gridUrl: "http://127.0.0.1:5555/wd/hub",

  browsers: {
    phantomjs: {
      desiredCapabilities: {
        browserName: "phantomjs"
      },
      screenshotsDir: "./tests/visual-regression/references"
    }
  },

  sets: {
    phantomjs: {
      files: ["tests/visual-regression/tests"],
      browsers: ["phantomjs"]
    }
  },

  system: {
    plugins: {
      "html-reporter": {
        enabled: true,
        path: "tests/visual-regression/reports"
      }
    }
  }
};
