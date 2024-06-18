// next.config.js
const withTwin = require('./withTwin.js')

const isGithubActions = process.env.IS_GH_PAGES || false

let assetPrefix = ''
let basePath = process.env.NEXTJS_BASEPATH || ''

if (isGithubActions) {
  // trim off `<owner>/`
  const repo = process.env.GITHUB_REPOSITORY.replace(/.*?\//, '')

  assetPrefix = `/${repo}/`
  basePath = `/${repo}`

  process.env.NEXTJS_BASEPATH = basePath
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  assetPrefix,
  basePath,
  // reactStrictMode: true,
  reactStrictMode: false,
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
}

module.exports = withTwin(nextConfig)
