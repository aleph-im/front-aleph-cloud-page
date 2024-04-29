import { createLibp2p } from 'libp2p'
import { webSockets } from '@libp2p/websockets'
import { all as allFilters } from '@libp2p/websockets/filters'
import { yamux } from '@chainsafe/libp2p-yamux'
import { noise } from '@chainsafe/libp2p-noise'
import { bootstrap } from '@libp2p/bootstrap'
import { ping } from '@libp2p/ping'
import { multiaddr } from '@multiformats/multiaddr'

const peers = [
  '/ip4/45.77.7.115/tcp/4001/p2p/12D3KooWGtMjP2gwWPrkdx41Aq1Dh1vuFr8ACWXNWxmXdE9NCJ3M/p2p-circuit/p2p/12D3KooWFp6ec9rwkwsofymrfk7L5ALFqVLyJfeKzWdUfgyeJkgF',
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
  /* node.afterStart = async () => {
    node.getConnections().forEach((conn) => {
      console.info(`Connected to ${conn.remotePeer.toString()}`)
    })
    for (let i = 0; i < peerIds.length; i++)
      try {
        console.info(
          `Peer ${i}: ${await node.services.ping.ping(multiaddr(peerIds[i]))}`,
        )
      } catch (err) {
        console.error(`Peer ${i}: ${err}`)
      }
  } */
  node.addEventListener('peer:discovery', async (evt) => {
    const peer = evt.detail
    console.log('found peer: ', peer.id.toString())
    try {
      console.info(await node.services.ping.ping(peer.multiaddrs))
    } catch (err) {
      console.error(err)
    }
  })
  return node
}
