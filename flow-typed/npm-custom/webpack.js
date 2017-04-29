declare module "webpack" {
  declare module.exports: (
    options: Object
  ) => {
    run: Function,
    plugin: Function,
    DefinePlugin: Function,
    optimize: Object
  };
}
