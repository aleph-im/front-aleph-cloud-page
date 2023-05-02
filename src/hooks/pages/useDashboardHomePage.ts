import { useAppState } from '@/contexts/appState'
import {
  ProgramMessage,
  StoreMessage,
} from 'aleph-sdk-ts/dist/messages/message'
import { useAccountProducts } from '../useAccountProducts'
import useConnectedWard from '../useConnectedWard'
import { AccountFileObject } from '@/helpers/aleph'
import { useGetFileSize } from '../useGetFileSize'

export type DashboardHomePage = {
  products: (ProgramMessage | StoreMessage)[]
  functions: ProgramMessage[]
  instances: ProgramMessage[]
  volumes: StoreMessage[]
  fileStats: AccountFileObject[]
}

export function useDashboardHomePage(): DashboardHomePage {
  useConnectedWard()
  const [products] = useAccountProducts()
  const [fileStatsWrapper] = useGetFileSize()
  const [appState] = useAppState()

  const {
    functions = [],
    volumes = [],
    instances = [],
  } = appState.products || {}

  return {
    products,
    functions,
    volumes,
    instances,
    fileStats: fileStatsWrapper.files,
  }
}
