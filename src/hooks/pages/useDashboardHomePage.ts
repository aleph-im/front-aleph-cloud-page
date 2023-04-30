import { useAppState } from '@/contexts/appState'
import {
  ProgramMessage,
  StoreMessage,
} from 'aleph-sdk-ts/dist/messages/message'
import { useAccountProducts } from '../useAccountProducts'
import useConnectedWard from '../useConnectedWard'

export type DashboardHomePage = {
  products: (ProgramMessage | StoreMessage)[]
  functions: ProgramMessage[]
  instances: ProgramMessage[]
  volumes: StoreMessage[]
}

export function useDashboardHomePage(): DashboardHomePage {
  useConnectedWard()
  const [products] = useAccountProducts()
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
  }
}
