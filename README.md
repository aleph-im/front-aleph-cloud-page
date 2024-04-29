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
