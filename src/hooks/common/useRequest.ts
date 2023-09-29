import { useCallback, useEffect } from 'react'
import {
  RequestState,
  useRequestState,
  UseRequestStateProps,
} from './useRequestState'

export type UseRequestProps<T> = UseRequestStateProps<T> & {
  doRequest: () => Promise<T>
  triggerOnMount?: boolean
  triggerDeps?: any[]
}

export type UseRequestReturn<T> = RequestState<T> & {
  request: () => Promise<void>
}

export function useRequest<T>({
  doRequest,
  triggerOnMount,
  triggerDeps = [],
  ...rest
}: UseRequestProps<T>): UseRequestReturn<T> {
  const [reqState, { onLoad, onSuccess, onError }] = useRequestState(rest)

  const request = useCallback(async () => {
    onLoad()

    try {
      const response = await doRequest()
      onSuccess(response)
      return
    } catch (e) {
      onError(e as Error)
    }
  }, [doRequest, onLoad, onSuccess, onError])

  useEffect(() => {
    if (!triggerOnMount) return
    request()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, triggerDeps)

  return { ...reqState, request }
}
