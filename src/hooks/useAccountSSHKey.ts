import { useAppState } from '@/contexts/appState'
import { SSHKey, SSHKeyStore } from '@/helpers/ssh'
import { ActionTypes } from '@/helpers/store'
import { useCallback } from 'react'
import { useRequest } from './useRequest'
import { RequestState } from './useRequestState'

export function useAccountSSHKey(
  id: string,
): [SSHKey | undefined, RequestState<unknown>] {
  const [appState, dispatch] = useAppState()

  const { account } = appState

  const doRequest: any = useCallback(async () => {
    if (!account) throw new Error('You need to be logged in to see this page.')

    const sshKeyStore = new SSHKeyStore(account)
    return await sshKeyStore.get(id)
  }, [account, id])

  const onSuccess = useCallback(
    (accountSSHKey: SSHKey) => {
      dispatch({
        type: ActionTypes.addAccountSSHKey,
        payload: {
          accountSSHKey: accountSSHKey,
        },
      })
    },
    [dispatch],
  )

  const reqState = useRequest({ doRequest, onSuccess, triggerOnMount: true })

  const sshKey = (appState.accountSSHKeys || []).find(
    (key: SSHKey) => key.id === id,
  )

  return [sshKey, reqState]
}
