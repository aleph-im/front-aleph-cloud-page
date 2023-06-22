import { FormEvent, useCallback, useState } from 'react'
import useConnectedWard from '../useConnectedWard'
import { useAppState } from '@/contexts/appState'
import { useRequestState } from '../useRequestState'
import { useRouter } from 'next/router'
import { NewSSHKey, SSHKeyStore } from '@/helpers/ssh'

export function useNewSSHKeyPage() {
  useConnectedWard()

  const [, { onLoad, onSuccess, onError }] = useRequestState()
  const router = useRouter()
  const [appState] = useAppState()
  const { account } = appState

  const [state, setState] = useState<NewSSHKey>({ key: '' })

  const setStateField = useCallback(
    (key: keyof NewSSHKey, value: any) => {
      setState((prev) => ({
        ...prev,
        [key]: value,
      }))
    },
    [setState],
  )

  const setKey = useCallback(
    (key: string) => setStateField('key', key),
    [setStateField],
  )

  const setLabel = useCallback(
    (label: string) => setStateField('label', label),
    [setStateField],
  )

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault()
      if (!account) return

      onLoad()

      try {
        const sshKeyStore = new SSHKeyStore(account)
        await sshKeyStore.add(state)

        onSuccess(true)
        router.replace('/dashboard')
      } catch (err) {
        onError(err as Error)
      }
    },
    [account, router, state, onError, onLoad, onSuccess],
  )

  return {
    ...state,
    setKey,
    setLabel,
    handleSubmit,
    address: account?.address || '',
  }
}
