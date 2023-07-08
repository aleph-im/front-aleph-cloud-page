import { ChangeEvent, FormEvent, useCallback } from 'react'
import { useAppState } from '@/contexts/appState'
import { useRouter } from 'next/router'
import { SSHKeyManager } from '@/domain/ssh'
import useConnectedWard from '@/hooks/common/useConnectedWard'
import { useForm } from '@/hooks/common/useForm'

export type NewSSHKeyFormState = {
  key: string
  label?: string
}

export const initialState: NewSSHKeyFormState = {
  key: '',
}

export type UseNewSSHKeyPage = {
  formState: NewSSHKeyFormState
  handleSubmit: (e: FormEvent) => Promise<void>
  handleChangeKey: (e: ChangeEvent<HTMLTextAreaElement>) => void
  handleChangeLabel: (e: ChangeEvent<HTMLInputElement>) => void
}

export function useNewSSHKeyPage() {
  useConnectedWard()

  const router = useRouter()
  const [appState] = useAppState()
  const { account } = appState

  const onSubmit = useCallback(
    async (state: NewSSHKeyFormState) => {
      console.log('state', state)

      if (!account) throw new Error('Account not found')

      const sshKeyStore = new SSHKeyManager(account)
      await sshKeyStore.add(state)

      router.replace('/dashboard')
    },
    [account, router],
  )

  const {
    state: formState,
    setFormValue,
    handleSubmit,
  } = useForm({ initialState, onSubmit })

  const handleChangeKey = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) =>
      setFormValue('key', e.target.value),
    [setFormValue],
  )

  const handleChangeLabel = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setFormValue('label', e.target.value),
    [setFormValue],
  )

  return {
    ...formState,
    handleChangeKey,
    handleChangeLabel,
    handleSubmit,
  }
}
