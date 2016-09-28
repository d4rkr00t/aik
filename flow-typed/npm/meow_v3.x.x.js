// flow-typed signature: fe54aa1864f24f7861424a762b10d94f
// flow-typed version: b66d12f5df/meow_v3.x.x/flow_>=v0.28.x

declare module 'meow' {
  declare type options = string | Array<string> | {
    description?: string,
    help: string | string[],
    version?: string | boolean,
    pkg?: string | Object,
    argv?: Array<string>,
    inferType?: boolean
  };

  declare type minimistOptions = {
    string?: boolean,
    boolean?: boolean,
    alias?: { [arg: string]: string | Array<string> },
    default?: { [arg: string]: any },
    stopEarly?: boolean,
    // TODO: Strings as keys don't work...
    // '--'? boolean,
    unknown?: (param: string) => boolean
  };

  declare module.exports: (
    options: options,
    minimistOptions?: minimistOptions,
  ) => {
    input: Array<string>,
    flags: { [flag: string]: string | boolean },
    pkg: Object,
    help: string,
    showHelp: Function
  }
}
