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

export class LocalFS {
  fs: MFS

  constructor(fs: MFS) {
    this.fs = fs
  }

  async addDirectory(dir: FileList) {
    const directories = new Set<string>()
    for (const file of Array.from(dir)) {
      const content = await file.arrayBuffer()
      const splittedName = file.webkitRelativePath.split('/').slice(1)

      if (splittedName.length > 1) {
        for (let i = 0; i < splittedName.length - 1; i++) {
          const dirName = splittedName.slice(0, i + 1).join('/')
          if (!directories.has(dirName)) {
            await this.fs.mkdir(`/${dirName}`)
          }
        }
      }

      await this.fs.writeBytes(
        new Uint8Array(content),
        `/${splittedName.join('/')}`,
      )
    }
  }

  async addFiles(files: FileList) {
    for (const file of Array.from(files)) {
      this.addFile(file)
    }
  }

  async addFile(file: File) {
    const content = await file.arrayBuffer()
    await this.fs.writeBytes(new Uint8Array(content), `/${file.name}`)
  }

  async reset() {
    try {
      await this.fs.rm('/')
    } catch (e) {
      console.log('Could not erase fs', e)
    }
  }

  async getRootCID() {
    const { cid } = await this.fs.stat('/')
    return cid
  }
}
