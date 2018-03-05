const presets = [
  [
    require.resolve("babel-preset-env"),
    {
      targets: { ie: 11 },
      modules: false
    }
  ],
  require.resolve("babel-preset-react")
];

module.exports = {
  module: {
    rules: [
      {
        loader: require.resolve("babel-loader"),
        query: { presets, plugins: [], babelrc: false }
      }
    ]
  }
};
