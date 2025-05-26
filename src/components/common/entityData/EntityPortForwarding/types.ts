export type ForwardedPort = {
  source: string
  destination: string
  udp: boolean
  tcp: boolean
  isDeletable: boolean
}

export type NewForwardedPortEntry = {
  id: string
  port: string
  udp: boolean
  tcp: boolean
}

export type EntityPortForwardingProps = {
  // No props currently needed, but allows React built-in props like key
}
