// next.config.js
const withTwin = require('./withTwin.js')

// const isGithubActions = process.env.GITHUB_ACTIONS || false

let assetPrefix = ''
let basePath = ''

// if (isGithubActions) {
//   // trim off `<owner>/`
//   const repo = process.env.GITHUB_REPOSITORY.replace(/.*?\//, '')

//   assetPrefix = `/${repo}/`
//   basePath = `/${repo}`
// }

/** @type {import('next').NextConfig} */
const nextConfig = {
  assetPrefix,
  basePath,
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
}

module.exports = withTwin(nextConfig)
