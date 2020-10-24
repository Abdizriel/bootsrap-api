import { loadFilesSync } from '@graphql-tools/load-files'

const imports = (() => {
  if (process.env.IS_BUNDLED) {
    // @ts-ignore
    const res = require.context('.', true, /.*\.(resolver\.(js|ts))$/)
    return res.keys().map((k: string) => res(k))
  }
  return loadFilesSync(__dirname + `/**/*.resolver.{js,ts}`)
})()

export const Resolvers = imports
  .map((i: any) => {
    return Object.values(i).filter(e => typeof e === 'function')
  })
  .reduce((e1: any[], e2: any[]) => [...e1, ...e2], [])
