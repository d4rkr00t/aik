declare module 'detect-port' {
  declare module.exports: (port: number | string) => Promise<number>
}
