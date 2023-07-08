import { useCallback, useState } from 'react'
import { useNotification } from '@aleph-front/aleph-core'

export type RequestCallbacks<T> = {
  onSuccess?: (data: T, defaultSuccessHandler: () => void) => void
  onError?: (error: Error, defaultErrorHandler: (error: Error) => void) => void
  onLoad?: () => void
}

export type RequestCallbacksReturn<T> = {
  onSuccess: (data: T) => void
  onError: (error: Error) => void
  onLoad: () => void
}

export type RequestState<T> = {
  data: T | null
  loading: boolean
  error: Error | null
}

export type UseRequestStateProps<T> = RequestCallbacks<T>

export type UseRequestStateReturn<T> = [
  RequestState<T>,
  RequestCallbacksReturn<T>,
]

export function useRequestState<T>({
  onSuccess: successProp,
  onError: errorProp,
  onLoad: loadProp,
}: UseRequestStateProps<T> = {}): UseRequestStateReturn<T> {
  const noti = useNotification()

  const [state, setState] = useState<RequestState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const onSuccess = useCallback(
    (data: T) => {
      setState({ data, loading: false, error: null })

      function defaultSuccessHandler() {
        noti &&
          noti.add({
            variant: 'success',
            title: 'Operation complete',
          })
      }

      return successProp
        ? successProp(data, defaultSuccessHandler)
        : defaultSuccessHandler()
    },
    [noti, successProp],
  )

  const onError = useCallback(
    (error: Error) => {
      setState({ data: null, loading: false, error })

      function defaultErrorHandler(error: Error) {
        const text = error.message
        const detail = (error?.cause as Error)?.message

        noti &&
          noti.add({
            variant: 'error',
            title: 'Error',
            text,
            detail,
          })
      }

      return errorProp
        ? errorProp(error, defaultErrorHandler)
        : defaultErrorHandler(error)
    },
    [errorProp, noti],
  )

  const onLoad = useCallback(() => {
    setState({ data: null, loading: true, error: null })

    loadProp && loadProp()
  }, [loadProp])

  return [state, { onSuccess, onError, onLoad }]
}
