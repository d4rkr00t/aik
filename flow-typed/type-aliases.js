declare type CLIInput = string[]

declare type CLIFlags = {
  build: string | boolean,
  base: string | boolean,
  port: string | number,
  oldPort: string | number,
  host: string,
  react: boolean,
  ngrok: boolean,
  open: boolean,
  cssmodules: boolean,
  version: boolean,
}

declare type AikParams = {
  isProd: boolean,
  ngrok: string,
  template: {
    path: string,
    short: string
  },
  dist: {
    path: string,
    short: string
  }
}

declare type NgrokUrl = string | false

declare type Entry = Object

declare type Output = {
  path: string,
  filename: string,
  hash: boolean,
  publicPath?: string
}

declare type Loader = {
  test: RegExp | string,
  loader?: string,
  loaders?: string[],
  exclude?: RegExp
}

declare type WebPackConfig = {
  entry: Entry,
  output: Output,
  debug: boolean,
  devtool: boolean | string,
  plugins: Array<any>,
  bail: boolean,
  module: {
    preLoaders: Loader[],
    loaders: Loader[]
  },
  eslint: {
    configFile: string,
    useEslintrc: boolean
  },
  postcss: () => Array<any>
}

declare type BuildStats = {
  buildDuration: number,
  assets: BuildStatAsset[]
}

declare type BuildStatAsset = {
  name: string,
  size: number,
  sizeGz: number
}
