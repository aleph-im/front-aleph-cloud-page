import { useAppState } from '@/contexts/appState'
import { Website } from '@/domain/website'
import { ActionTypes } from '@/helpers/store'
import { useCallback, useMemo } from 'react'
import { useRetryNotConfirmedEntities } from '../useRetryNotConfirmedEntities'
import { useWebsiteManager } from '../useManager/useWebsiteManager'
import { UseRequestReturn, useLocalRequest } from '@aleph-front/core'

export type UseAccountWebsiteProps = {
  id: string
  triggerOnMount?: boolean
}

export type UseAccountWebsiteReturn = [
  Website | undefined,
  UseRequestReturn<Website | undefined>,
]

export function useAccountWebsite({
  id,
  triggerOnMount = true,
}: UseAccountWebsiteProps): UseAccountWebsiteReturn {
  const [appState, dispatch] = useAppState()
  const manager = useWebsiteManager()

  const doRequest = useCallback(async () => {
    if (!manager) throw new Error('Manager not ready')

    return await manager.get(id)
  }, [manager, id])

  const onSuccess = useCallback(
    (accountWebsite: Website | undefined) => {
      dispatch({
        type: ActionTypes.addAccountWebsite,
        payload: { accountWebsite },
      })
    },
    [dispatch],
  )

  const onError = useCallback(
    (error: Error, defaultHandler: (error: Error) => void) => {
      if (!manager) return
      defaultHandler(error)
    },
    [manager],
  )

  const website = useMemo(
    () =>
      (appState.accountWebsites || []).find((key: Website) => key.id === id),
    [appState.accountWebsites, id],
  )

  const reqState = useLocalRequest({
    doRequest,
    onSuccess,
    onError,
    triggerOnMount,
  })

  useRetryNotConfirmedEntities({
    entities: website,
    request: reqState.request,
    triggerOnMount,
  })

  return [website, reqState]
}
