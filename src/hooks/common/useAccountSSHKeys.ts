import { useAppState } from '@/contexts/appState'
import { SSHKey } from '@/domain/ssh'
import { ActionTypes } from '@/helpers/store'
import { useCallback } from 'react'
import { UseRequestReturn, useRequest } from './useRequest'
import { useSSHKeyManager } from './useSSHKeyManager'
import { useRetryNotConfirmedEntities } from './useRetryNotConfirmedEntities'

export type UseAccountSSHKeysProps = {
  triggerOnMount?: boolean
}

export type UseAccountSSHKeysReturn = [
  SSHKey[] | undefined,
  UseRequestReturn<SSHKey[]>,
]

export function useAccountSSHKeys({
  triggerOnMount = true,
}: UseAccountSSHKeysProps = {}): UseAccountSSHKeysReturn {
  const [appState, dispatch] = useAppState()
  const manager = useSSHKeyManager()

  const doRequest = useCallback(async () => {
    if (!manager) throw new Error('Manager not ready')

    return await manager.getAll()
  }, [manager])

  const onSuccess = useCallback(
    (accountSSHKeys: SSHKey[]) => {
      dispatch({
        type: ActionTypes.setAccountSSHKeys,
        payload: { accountSSHKeys },
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

  const reqState = useRequest({
    doRequest,
    onSuccess,
    onError,
    triggerOnMount,
  })

  const entities = appState.accountSSHKeys

  useRetryNotConfirmedEntities({
    entities,
    request: reqState.request,
    triggerOnMount,
  })

  return [entities, reqState]
}
