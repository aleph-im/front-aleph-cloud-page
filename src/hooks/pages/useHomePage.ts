import { useAppState } from "@/contexts/appState"
import { ProgramMessage } from "aleph-sdk-ts/dist/messages/message"
import { useAccountProducts } from "../useAccountProducts"
import useConnected from "../useConnected"

export type HomePage = {
  products: ProgramMessage[]
  functions: ProgramMessage[]
  instances: ProgramMessage[]
  databases: ProgramMessage[]
}

export function useHomePage(): HomePage {
  useConnected()
  const [products] = useAccountProducts()
  const [appState] = useAppState()

  const {
    functions = [],
    instances = [],
    databases = []
  } = appState.products || {}

  return {
    products,
    functions,
    instances,
    databases
  }
}