import { ExecutableStatus, ExecutableManager } from '@/domain/executable'

export type ForwardedPort = {
  source: string
  destination?: string
  udp: boolean
  tcp: boolean
  isDeletable: boolean
  isRemoving?: boolean
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
  entityHash?: string
  executableStatus?: ExecutableStatus
  executableManager?: ExecutableManager<any>
}
