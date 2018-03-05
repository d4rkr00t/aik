const path = require("path");

module.exports = {
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        enforce: "pre",
        loader: require.resolve("eslint-loader"),
        options: {
          configFile: path.join(__dirname, ".", ".eslintrc"),
          useEslintrc: false
        }
      }
    ]
  }
};
