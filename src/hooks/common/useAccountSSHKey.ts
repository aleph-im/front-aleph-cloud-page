import { useAppState } from '@/contexts/appState'
import { SSHKey } from '@/domain/ssh'
import { ActionTypes } from '@/helpers/store'
import { useCallback, useMemo } from 'react'
import { useRequest } from './useRequest'
import { RequestState } from './useRequestState'
import { useSSHKeyManager } from './useSSHKeyManager'

export function useAccountSSHKey(
  id: string,
): [SSHKey | undefined, RequestState<unknown>] {
  const [appState, dispatch] = useAppState()
  const manager = useSSHKeyManager()

  const doRequest = useCallback(async () => {
    if (!manager) throw new Error('Manager not ready')

    return await manager.get(id)
  }, [id, manager])

  const onSuccess = useCallback(
    (accountSSHKey: SSHKey | undefined) => {
      dispatch({
        type: ActionTypes.addAccountSSHKey,
        payload: { accountSSHKey },
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

  const sshKey = useMemo(
    () => (appState.accountSSHKeys || []).find((key: SSHKey) => key.id === id),
    [appState.accountSSHKeys, id],
  )

  const reqState = useRequest({
    doRequest,
    onSuccess,
    onError,
    triggerOnMount: !sshKey,
  })

  return [sshKey, reqState]
}
