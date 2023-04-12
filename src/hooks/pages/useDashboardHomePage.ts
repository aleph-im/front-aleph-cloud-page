import { useAppState } from "@/contexts/appState"
import { ProgramMessage } from "aleph-sdk-ts/dist/messages/message"
import { useAccountProducts } from "../useAccountProducts"
import useConnected from "../useConnected"

export type DashboardHomePage = {
  products: ProgramMessage[]
  functions: ProgramMessage[]
  instances: ProgramMessage[]
  databases: ProgramMessage[]
}

export function useDashboardHomePage(): DashboardHomePage {
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