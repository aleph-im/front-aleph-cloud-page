import { useAppState } from "@/contexts/appState"
import { getAccountProducts } from "@/helpers/aleph"
import { ActionTypes } from "@/helpers/store"
import { ProgramMessage } from "aleph-sdk-ts/dist/messages/message"
import { useCallback, useMemo } from "react"
import { useRequest } from "./useRequest"
import { RequestState } from "./useRequestState"

export function useAccountProducts(): [ProgramMessage[], RequestState<unknown>] {
  const [appState, dispatch] = useAppState()
  const products = useMemo(() => Object.values(appState.products).flat(), [appState])

  const { account } = appState

  const doRequest = useCallback(() => {
    if (!account) throw new Error('Not account')
    return getAccountProducts(account)
  }, [account])

  const onSuccess = useCallback((products: Record<string, ProgramMessage[]>) => {
    dispatch({ type: ActionTypes.setProducts, payload: { products } })
  }, [dispatch])

  const reqState = useRequest({ doRequest, onSuccess })

  return [products, reqState]
}