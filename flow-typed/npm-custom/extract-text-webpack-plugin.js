declare module "extract-text-webpack-plugin" {
  declare module.exports: (
    options: Object | string
  ) => {
    extract: Function
  };
}
