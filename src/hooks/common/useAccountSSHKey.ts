import { useAppState } from '@/contexts/appState'
import { SSHKey, SSHKeyManager } from '@/domain/ssh'
import { ActionTypes } from '@/helpers/store'
import { useCallback, useMemo } from 'react'
import { useRequest } from './useRequest'
import { RequestState } from './useRequestState'

export function useAccountSSHKey(
  id: string,
): [SSHKey | undefined, RequestState<unknown>] {
  const [appState, dispatch] = useAppState()
  const { account } = appState

  const doRequest = useCallback(async () => {
    if (!account) throw new Error('Invalid account')

    const sshKeyStore = new SSHKeyManager(account)
    return await sshKeyStore.get(id)
  }, [account, id])

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
      if (!account) return
      defaultHandler(error)
    },
    [account],
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
