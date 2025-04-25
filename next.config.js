// next.config.js
const withTwin = require('./withTwin.js')

const isGithubPages = process.env.IS_GH_PAGES || false

let assetPrefix = ''
let basePath = process.env.NEXTJS_BASEPATH || ''

if (isGithubPages) {
  // trim off `<owner>/`
  const repo = process.env.GITHUB_REPOSITORY.replace(/.*?\//, '')

  assetPrefix = `/${repo}/`
  basePath = `/${repo}`

  process.env.NEXTJS_BASEPATH = basePath
}

// default to true when unset
const shouldExport = process.env.NEXTJS_EXPORT !== 'false'

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
  output: shouldExport ? 'export' : undefined,
}

module.exports = withTwin(nextConfig)
