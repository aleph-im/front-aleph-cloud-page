/* import { createLibp2p } from 'libp2p'
import { webSockets } from '@libp2p/websockets'
import { all as allFilters } from '@libp2p/websockets/filters'
import { webTransport } from '@libp2p/webtransport'
import { yamux } from '@chainsafe/libp2p-yamux'
import { noise } from '@chainsafe/libp2p-noise'
import { bootstrap } from '@libp2p/bootstrap'
import { kadDHT } from '@libp2p/kad-dht'

// Requires: npm i libp2p @libp2p/websockets @libp2p/webtransport @chainsafe/libp2p-yamux @chainsafe/libp2p-noise @libp2p/bootstrap @libp2p/kad-dht

const peers = [
  '/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN',
  '/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa',
  '/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb',
  '/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt',
]

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
} */
