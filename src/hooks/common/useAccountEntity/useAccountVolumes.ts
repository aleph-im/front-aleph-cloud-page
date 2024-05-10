import { useAppState } from '@/contexts/appState'
import { ActionTypes } from '@/helpers/store'
import { useCallback } from 'react'
import { Volume } from '@/domain/volume'
import { useRetryNotConfirmedEntities } from '../useRetryNotConfirmedEntities'
import { useVolumeManager } from '../useManager/useVolumeManager'
import { UseRequestReturn, useLocalRequest } from '@aleph-front/core'
import Err from '@/helpers/errors'

export type UseAccountVolumesProps = {
  triggerOnMount?: boolean
}

export type UseAccountVolumesReturn = [
  Volume[] | undefined,
  UseRequestReturn<Volume[]>,
]

export function useAccountVolumes({
  triggerOnMount = true,
}: UseAccountVolumesProps = {}): UseAccountVolumesReturn {
  const [appState, dispatch] = useAppState()
  const manager = useVolumeManager()

  const doRequest = useCallback(async () => {
    if (!manager) throw Err.ManagerNotReady

    return await manager.getAll()
  }, [manager])

  const onSuccess = useCallback(
    (accountVolumes: Volume[]) => {
      dispatch({
        type: ActionTypes.setAccountVolumes,
        payload: { accountVolumes },
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

  const entities = appState.accountVolumes

  useRetryNotConfirmedEntities({
    entities,
    request: reqState.request,
    triggerOnMount,
  })

  return [entities, reqState]
}
