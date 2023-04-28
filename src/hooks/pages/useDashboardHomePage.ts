import { useAppState } from '@/contexts/appState'
import {
  ProgramMessage,
  StoreMessage,
} from 'aleph-sdk-ts/dist/messages/message'
import { useAccountProducts } from '../useAccountProducts'
import useConnected from '../useConnected'

export type HomePage = {
  products: (ProgramMessage | StoreMessage)[]
  functions: ProgramMessage[]
  instances: ProgramMessage[]
  volumes: StoreMessage[]
}

export function useHomePage(): HomePage {
  useConnected()
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
