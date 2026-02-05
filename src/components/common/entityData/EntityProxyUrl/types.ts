export type ProxyUrlData = {
  instance_hash: string
  subdomain: string
  url: string
  ipv6: string | null
  active: boolean
}

export type EntityProxyUrlProps = {
  instanceHash?: string
}
