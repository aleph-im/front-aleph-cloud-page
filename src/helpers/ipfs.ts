import { createLibp2p } from 'libp2p'
import { webSockets } from '@libp2p/websockets'
import { all as allFilters } from '@libp2p/websockets/filters'
import { webTransport } from '@libp2p/webtransport'
import { yamux } from '@chainsafe/libp2p-yamux'
import { noise } from '@chainsafe/libp2p-noise'
import { bootstrap } from '@libp2p/bootstrap'
import { kadDHT } from '@libp2p/kad-dht'

// Requires: npm i libp2p @libp2p/websockets @libp2p/webtransport @chainsafe/libp2p-yamux @chainsafe/libp2p-noise @libp2p/bootstrap @libp2p/kad-dht

/* const peers = [
  '/dns/api1.aleph.im/tcp/4025/p2p/Qmaxufiqdyt5uVWcy1Xh2nh3Rs3382ArnSP2umjCiNG2Vs',
  '/dns/api2.aleph.im/tcp/4025/p2p/QmZkurbY2G2hWay59yiTgQNaQxHSNzKZFt2jbnwJhQcKgV',
  '/dnsaddr/api1.aleph.im/ipfs/12D3KooWNgogVS6o8fVsPdzh2FJpCdJJLVSgJT38XGE1BJoCerHx',
  '/ip4/51.159.57.71/tcp/4001/p2p/12D3KooWBH3JVSBwHLNzxv7EzniBP3tDmjJaoa3EJBF9wyhZtHt2',
  '/ip4/62.210.93.220/tcp/4001/p2p/12D3KooWLcmvqojHzUnR7rr8YhFKGDD8z7fmsPyBfAm2rT3sFGAF',
] */

const peers = [
  '/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN',
  '/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa',
  '/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb',
  '/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt',
]

/**
 * Creates a custom LibP2P node using WebSockets
 */
export const getP2PNode = async () => {
  const node = await createLibp2p({
    //transports: [webSockets({ filter: allFilters }), webTransport()],
    transports: [webSockets(), webTransport()],
    streamMuxers: [yamux()],
    connectionEncryption: [noise()],
    peerDiscovery: [bootstrap({ list: peers })],
    services: { dht: kadDHT({ clientMode: false }) },
  })
  node.services.dht.setMode('server')
  console.log(node.peerId.toString())
  node.getMultiaddrs().forEach((ma) => console.log(ma.toString()))
  node.addEventListener('peer:discovery', (evt) => {
    const peer = evt.detail
    node
      .dial(peer.id)
      .then(() => console.log('Found peer: ', evt.detail.id.toString()))
      .catch((err) => {
        console.log(`Could not dial ${peer.id}`, err)
      })
  })
  node.addEventListener('peer:connect', (evt) => {
    console.log(`Connected to ${evt.detail.toString()}`)
  })
  node.addEventListener('peer:disconnect', (evt) => {
    console.log(`Disconnected from ${evt.detail.toString()}`)
  })
  return node
}
