import { createLibp2p } from 'libp2p'
import { webSockets } from '@libp2p/websockets'
import { all as allFilters } from '@libp2p/websockets/filters'
import { mplex } from '@libp2p/mplex'
import { noise } from '@libp2p/noise'

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
