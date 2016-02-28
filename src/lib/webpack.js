import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import webpackConfigBuilder from './webpack-config-builder';

/**
 * Creates webpack dev server.
 *
 * @param {String} filename
 * @param {Flags} flags
 *
 * @return {Promise}
 */
export default function createWebpackDevServer(filename, flags) {
  const config = webpackConfigBuilder(filename, flags);
  const compiler = webpack(config);
  const server = new WebpackDevServer(compiler, {
    hot: true,
    colors: true,
    noInfo: true,
    stats: { colors: true }
  });

  return new Promise((resolve, reject) => {
    server.listen(flags.port, flags.host, (err) => {
      if (err) {
        return reject(err);
      }

      resolve(server);
    });
  });
}
