declare module 'webpack-dev-server' {
  declare type WebpackDevServer = {
    listen: Function
  }

  declare module.exports: () => WebpackDevServer
}
