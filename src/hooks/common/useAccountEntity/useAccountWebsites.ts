import { useAppState } from '@/contexts/appState'
import { ActionTypes } from '@/helpers/store'
import { useCallback } from 'react'
import { Website } from '@/domain/website'
import { useRetryNotConfirmedEntities } from '../useRetryNotConfirmedEntities'
import { useWebsiteManager } from '../useManager/useWebsiteManager'
import { UseRequestReturn, useLocalRequest } from '@aleph-front/core'

export type UseAccountWebsitesProps = {
  triggerOnMount?: boolean
}

export type UseAccountWebsitesReturn = [
  Website[] | undefined,
  UseRequestReturn<Website[]>,
]

export function useAccountWebsites({
  triggerOnMount = true,
}: UseAccountWebsitesProps = {}): UseAccountWebsitesReturn {
  const [appState, dispatch] = useAppState()
  const manager = useWebsiteManager()

  const doRequest = useCallback(async () => {
    if (!manager) throw new Error('Manager not ready')

    return await manager.getAll()
  }, [manager])

  const onSuccess = useCallback(
    (accountWebsites: Website[]) => {
      dispatch({
        type: ActionTypes.setAccountWebsites,
        payload: { accountWebsites },
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

  const reqState = useLocalRequest({
    doRequest,
    onSuccess,
    onError,
    triggerOnMount,
    triggerDeps: [appState.account],
  })

  const entities = appState.accountWebsites

  useRetryNotConfirmedEntities({
    entities,
    request: reqState.request,
    triggerOnMount,
  })

  return [entities, reqState]
}
