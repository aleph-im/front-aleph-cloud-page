# Aleph Cloud Solutions

Aleph Cloud Solutions is a [next.js](https://nextjs.org/) frontend dApp that allows you to easily deploy VMs on the aleph network, without worrying about the different configuration options; just launch the app, upload your code and dependencies and enjoy.

## Requirements

Ensure you have the following installed on your machine:

- Node.js 20
- GNU make
- GNU Compiler Collection (GCC)
- Git
- `libudev.h` on Linux

## Develop locally

First obtain an authentication token to access the proprietary Font Awesome icons and edit `.npmrc` to 
include the aforementioned token.

After cloning the repo make sure to install NPM dependency by running `npm i`

To run the project in development mode (`http://localhost:3000`)

```
npm run dev
```

Create an optimized production build:

```
npm run build
npm run export
```

## Releasing

Two frontends are deployed from this repository, one per branch:

| Branch   | App              | Release tag       |
| -------- | ---------------- | ----------------- |
| `main`   | credits (default) | `vX.Y.Z`         |
| `legacy` | legacy           | `legacy-vX.Y.Z`   |

Publishing a GitHub Release is the only way to deploy. The tag prefix selects the
app, and the workflow refuses tags whose commit is not on the matching branch or
whose version differs from `package.json`.

1. Open a PR that bumps the version (`npm version patch --no-git-tag-version`,
   or `minor` / `major`) and merge it.
2. On GitHub, _Releases → Draft a new release_: create the tag (`v0.38.0` on
   `main`, `legacy-v0.37.5` on `legacy`), target the branch, write the notes,
   _Publish_.
3. The `Release` workflow builds, pushes to IPFS, deploys, and appends the IPFS
   CID and preview URL to the release notes.

To redeploy a previous release (rollback), re-run its `Release` workflow run from
the Actions tab.

Pushing to a `release/**` branch, or running the `Preview build` workflow on any
branch, builds and pushes to IPFS and prints a preview URL without deploying.
