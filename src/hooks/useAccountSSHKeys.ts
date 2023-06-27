import { useAppState } from '@/contexts/appState'
import { SSHKey, SSHKeyStore } from '@/helpers/ssh'
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
    if (!account) throw new Error('You need to be logged in to see this page.')

    const sshKeyStore = new SSHKeyStore(account)
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

  const reqState = useRequest({ doRequest, onSuccess, triggerOnMount: true })

  return [appState.accountSSHKeys, reqState]
}
