import { useAppState } from '@/contexts/appState'
import { SSHKey } from '@/domain/ssh'
import { ActionTypes } from '@/helpers/store'
import { useCallback } from 'react'
import { useRequest } from './useRequest'
import { RequestState } from './useRequestState'
import { useSSHKeyManager } from './useSSHKeyManager'

export function useAccountSSHKeys(): [
  SSHKey[] | undefined,
  RequestState<unknown>,
] {
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
    triggerOnMount: true,
  })

  return [appState.accountSSHKeys, reqState]
}
