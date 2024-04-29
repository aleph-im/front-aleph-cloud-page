import { createLibp2p } from 'libp2p'
import { webSockets } from '@libp2p/websockets'
import { all as allFilters } from '@libp2p/websockets/filters'
import { yamux } from '@chainsafe/libp2p-yamux'
import { noise } from '@chainsafe/libp2p-noise'
import { bootstrap } from '@libp2p/bootstrap'
import { ping } from '@libp2p/ping'
import { multiaddr } from '@multiformats/multiaddr'

const peers = [
  '/ip4/127.0.0.1/tcp/4001/p2p/12D3KooWD7h5SJ6YKGtnUm1L78cFVJfRamUiD4X7jxzePXYJAffQ',
  '/dns/api1.aleph.im/tcp/4025/p2p/Qmaxufiqdyt5uVWcy1Xh2nh3Rs3382ArnSP2umjCiNG2Vs',
  '/dns/api2.aleph.im/tcp/4025/p2p/QmZkurbY2G2hWay59yiTgQNaQxHSNzKZFt2jbnwJhQcKgV',
  '/dnsaddr/api1.aleph.im/ipfs/12D3KooWNgogVS6o8fVsPdzh2FJpCdJJLVSgJT38XGE1BJoCerHx',
  '/ip4/51.159.57.71/tcp/4001/p2p/12D3KooWBH3JVSBwHLNzxv7EzniBP3tDmjJaoa3EJBF9wyhZtHt2',
  '/ip4/62.210.93.220/tcp/4001/p2p/12D3KooWLcmvqojHzUnR7rr8YhFKGDD8z7fmsPyBfAm2rT3sFGAF',
]

/**
 * Creates a custom LibP2P node using WebSockets
 */
export const getP2PNode = async () => {
  const node = await createLibp2p({
    start: true,
    transports: [
      webSockets({
        // connect to all sockets, even insecure ones
        filter: allFilters,
      }),
    ],
    streamMuxers: [yamux()],
    connectionEncryption: [noise()],
    services: {
      ping: ping(),
    },
    peerDiscovery: [
      bootstrap({
        list: peers,
      }),
    ],
  })
  node.addEventListener('peer:discovery', (evt) => {
    console.log('found peer: ', evt.detail.id.toString())
  })
  node.addEventListener('peer:connect', (evt) => {
    console.log(`Connected to ${evt.detail.toString()}`)
  })
  node.addEventListener('peer:disconnect', (evt) => {
    console.log(`Disconnected from ${evt.detail.toString()}`)
  })
  node.afterStart = async () => {
    console.log(node.peerId.toString())
    node.getMultiaddrs().forEach((ma) => console.log(ma.toString()))
  }
  return node
}
