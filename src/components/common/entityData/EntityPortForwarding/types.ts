export type ForwardedPort = {
  source: string
  destination: string
  udp: boolean
  tcp: boolean
  isDeletable: boolean
}

export type NewForwardedPortEntry = {
  port: string
  udp: boolean
  tcp: boolean
}

export type AddPortFormState = {
  ports: NewForwardedPortEntry[]
}

export const defaultAddPortFormState: AddPortFormState = {
  ports: [{ port: '', udp: false, tcp: false }],
}

export type EntityPortForwardingProps = {
  // No props currently needed, but allows React built-in props like key
}
