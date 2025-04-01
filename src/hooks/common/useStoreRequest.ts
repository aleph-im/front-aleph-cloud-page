import { Dispatch } from 'react'
import { useAppState } from '@/contexts/appState'
import { RequestActionType, RequestAction } from '@/store/request'
import { StoreState } from '@/store/store'
import {
  RequestState,
  UseRequestProps,
  UseRequestReturn,
  useRequest,
} from '@aleph-front/core'

export type StoreRequest<T> = {
  data: T | undefined
  loading: boolean
  error: Error | undefined
}

export type UseStoreRequestProps<T, S> = Omit<
  UseRequestProps<T>,
  'state' | 'setState'
> & {
  state: S
  dispatch: Dispatch<RequestAction<T>>
  name: string & keyof S
}

export type UseStoreRequestReturn<T> = UseRequestReturn<T>

export function useStoreRequest<T, S>({
  state: store,
  dispatch,
  name,
  ...props
}: UseStoreRequestProps<T, S>): UseStoreRequestReturn<T> {
  const state = store[name] as RequestState<T>

  return useRequest({
    state,
    setState: (newState) => {
      return dispatch({
        type: RequestActionType.REQUEST_SET,
        payload: { name, state: newState },
      })
    },
    ...props,
  })
}

export type UseAppStoreRequestProps<T> = Omit<
  UseStoreRequestProps<T, StoreState>,
  'state' | 'dispatch'
>

export function useAppStoreRequest<T>(
  props: UseAppStoreRequestProps<T>,
): UseStoreRequestReturn<T> {
  const [state, dispatch] = useAppState()

  return useStoreRequest<T, StoreState>({ state, dispatch, ...props })
}
