import { useAppState } from '@/contexts/appState'
import { SSHKey, SSHKeyManager } from '@/domain/ssh'
import { ActionTypes } from '@/helpers/store'
import { useCallback } from 'react'
import { useRequest } from './useRequest'
import { RequestState } from './useRequestState'

export function useAccountSSHKeys(): [
  SSHKey[] | undefined,
  RequestState<unknown>,
] {
  const [appState, dispatch] = useAppState()

  const { account } = appState

  const doRequest = useCallback(async () => {
    if (!account) throw new Error('Invalid account')

    const sshKeyStore = new SSHKeyManager(account)
    return await sshKeyStore.getAll()
  }, [account])

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
      if (!account) return
      defaultHandler(error)
    },
    [account],
  )

  const reqState = useRequest({
    doRequest,
    onSuccess,
    onError,
    triggerOnMount: true,
  })

  return [appState.accountSSHKeys, reqState]
}
