import { useCallback, useState } from 'react'
import { useNotification } from '@aleph-front/aleph-core'

export type RequestCallbacks<T> = {
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
  onLoad?: () => void
}

export type RequestState<T> = {
  data: T | null
  loading: boolean
  error: Error | null
}

export type UseRequestStateProps<T> = RequestCallbacks<T>

export type UseRequestStateReturn<T> = [
  RequestState<T>,
  Required<RequestCallbacks<T>>,
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

      if (successProp) return successProp(data)

      noti &&
        noti.add({
          variant: 'success',
          title: 'Operation complete',
        })
    },
    [noti, successProp],
  )

  const onError = useCallback(
    (error: Error) => {
      setState({ data: null, loading: false, error })

      if (errorProp) return errorProp(error)

      const text = error.message
      const detail = (error?.cause as Error)?.message

      noti &&
        noti.add({
          variant: 'error',
          title: 'Error',
          text,
          detail,
        })
    },
    [errorProp, noti],
  )

  const onLoad = useCallback(() => {
    setState({ data: null, loading: true, error: null })

    loadProp && loadProp()
  }, [loadProp])

  return [state, { onSuccess, onError, onLoad }]
}
