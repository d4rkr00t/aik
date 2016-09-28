declare type CLIInput = string[]

declare type CLIFlags = {
  build: string | boolean,
  base: string | boolean,
  port: string,
  host: string,
  react: boolean,
  ngrok: boolean,
  open: boolean,
  cssmodules: boolean,
  version: boolean,
}

declare type Console = {
  log: Function,
  error: Function
}

declare type NgrokUrl = string | false

type WebpackMessageImports = {
  chalk: $npm$chalk$Style,
  log: Function
}

type Entry = {
  app: string[]
}


type Output = {
  path: string,
  filename: string,
  hash: boolean,
  publicPath?: string
}

type Loader = {
  test: RegExp | string,
  loader?: string,
  loaders?: string[],
  exclude?: RegExp
}

type WebPackConfig = {
  entry: Entry,
  output: Output,
  debug: boolean,
  devtool: boolean | string,
  plugins: Array<any>,
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
