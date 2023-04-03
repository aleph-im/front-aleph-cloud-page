import { useEffect } from 'react'
import { RequestState, useRequestState, UseRequestStateProps } from './useRequestState'

export type UseRequestProps<T> = UseRequestStateProps<T> & {
  doRequest: () => Promise<T>
}

export type UseRequestReturn<T> = RequestState<T>

// @note: https://react.dev/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development
export function useRequest<T>({
  doRequest,
  ...rest
}: UseRequestProps<T>): UseRequestReturn<T> {
  const [reqState, { onLoad, onSuccess, onError }] = useRequestState(rest)

  useEffect(() => {
    let ignore = false

    async function handleRequest() {
      onLoad()

      try {
        console.log('---> DO REQUEST')

        const response = await doRequest()
        if (ignore) return

        console.log('---> SUCCESS')

        onSuccess(response)
      } catch (e) {
        if (ignore) return

        console.log('---> ERROR', e)

        onError(e as Error)
      }
    }

    handleRequest()

    return () => {
      ignore = true
    }
  }, [doRequest, onLoad, onSuccess, onError])

  return reqState
}
