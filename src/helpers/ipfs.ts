import { createLibp2p } from 'libp2p'
import { webSockets } from '@libp2p/websockets'
import { all as allFilters } from '@libp2p/websockets/filters'
import { mplex } from '@libp2p/mplex'
import { noise } from '@libp2p/noise'
import { MFS } from '@helia/mfs'

/**
 * Creates a custom LibP2P node using WebSockets
 */
export const getP2PNode = async () =>
  await createLibp2p({
    transports: [
      webSockets({
        // connect to all sockets, even insecure ones
        filter: allFilters,
      }),
    ],
    streamMuxers: [mplex()],
    connectionEncryption: [noise()],
  })

export const addDirectoryToFilesystem = async (fs: MFS, dir: FileList) => {
  const directories = new Set<string>()
  for (let file of Array.from(dir)) {
    const content = await file.arrayBuffer()
    const splittedName = file.webkitRelativePath.split('/').slice(1)

    if (splittedName.length > 1) {
      for (let i = 0; i < splittedName.length - 1; i++) {
        const dirName = splittedName.slice(0, i + 1).join('/')
        if (!directories.has(dirName)) {
          await fs.mkdir(`/${dirName}`)
        }
      }
    }

    await fs.writeBytes(new Uint8Array(content), `/${splittedName.join('/')}`)
  }
}

export const addFilesToFileSystem = async (fs: MFS, files: FileList) => {
  for (let file of Array.from(files)) {
    const content = await file.arrayBuffer()
    await fs.writeBytes(new Uint8Array(content), `/${file.name}`)
  }
}

export const resetFileSystem = async (fs: MFS) => await fs.rm('/')

export const getRootCID = async (fs: MFS) => {
  const { cid } = await fs.stat('/')
  return cid
}
