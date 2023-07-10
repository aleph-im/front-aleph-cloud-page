import { ChangeEvent, FormEvent, useCallback } from 'react'
import { useRouter } from 'next/router'
import useConnectedWard from '@/hooks/common/useConnectedWard'
import { useForm } from '@/hooks/common/useForm'
import { useSSHKeyManager } from '@/hooks/common/useSSHKeyManager'

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
  const manager = useSSHKeyManager()

  const onSubmit = useCallback(
    async (state: NewSSHKeyFormState) => {
      console.log('state', state)

      if (!manager) throw new Error('Manager not ready')

      await manager.add(state)

      router.replace('/dashboard')
    },
    [manager, router],
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
