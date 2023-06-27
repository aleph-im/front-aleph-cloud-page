import { useAppState } from '@/contexts/appState'
import {
  ProgramMessage,
  StoreMessage,
} from 'aleph-sdk-ts/dist/messages/message'
import { useAccountProducts } from '../useAccountProducts'
import useConnectedWard from '../useConnectedWard'
import { AccountFileObject } from '@/helpers/aleph'
import { useGetFileSize } from '../useGetFileSize'
import { useAccountSSHKeys } from '../useAccountSSHKeys'
import { SSHKey } from '@/helpers/ssh'

export type DashboardHomePage = {
  products: (ProgramMessage | StoreMessage)[]
  functions: ProgramMessage[]
  instances: ProgramMessage[]
  volumes: StoreMessage[]
  sshKeys: SSHKey[]
  fileStats: AccountFileObject[]
}

export function useDashboardHomePage(): DashboardHomePage {
  useConnectedWard()
  const [products] = useAccountProducts()
  const [fileStatsWrapper] = useGetFileSize()
  const [appState] = useAppState()
  const [sshKeys = []] = useAccountSSHKeys()

  const {
    functions = [],
    volumes = [],
    instances = [],
  } = appState.products || {}

  return {
    products,
    functions,
    volumes,
    sshKeys,
    instances,
    fileStats: fileStatsWrapper.files,
  }
}
