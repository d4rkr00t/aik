declare module "webpack-dev-server" {
  declare type WebpackDevServer = {
    listen: Function,
    use: Function
  };

  declare module.exports: () => WebpackDevServer;
}
