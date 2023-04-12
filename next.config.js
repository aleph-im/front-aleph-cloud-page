
const isGithubActions = process.env.GITHUB_ACTIONS || false

let assetPrefix = ''
let basePath = ''

if (isGithubActions) {
  // trim off `<owner>/`
  const repo = process.env.GITHUB_REPOSITORY.replace(/.*?\//, '')

  assetPrefix = `/${repo}/`
  basePath = `/${repo}`
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  assetPrefix,
  basePath,
  reactStrictMode: true,
  compiler: {
    // see https://styled-components.com/docs/tooling#babel-plugin for more info on the options.
    styledComponents: true
    // boolean | {
    //   // Enabled by default in development, disabled in production to reduce file size,
    //   // setting this will override the default for all environments.
    //   displayName?: boolean,
    //   // Enabled by default.
    //   ssr?: boolean,
    //   // Enabled by default.
    //   fileName?: boolean,
    //   // Empty by default.
    //   topLevelImportPaths?: string[],
    //   // Defaults to ["index"].
    //   meaninglessFileNames?: string[],
    //   // Enabled by default.
    //   cssProp?: boolean,
    //   // Empty by default.
    //   namespace?: string,
    //   // Not supported yet.
    //   minify?: boolean,
    //   // Not supported yet.
    //   transpileTemplateLiterals?: boolean,
    //   // Not supported yet.
    //   pure?: boolean,
    // },
  },
}

module.exports = nextConfig
