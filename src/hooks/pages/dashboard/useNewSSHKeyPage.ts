import { ChangeEvent, FormEvent, useCallback } from 'react'
import { useRouter } from 'next/router'
import useConnectedWard from '@/hooks/common/useConnectedWard'
import { useForm } from '@/hooks/common/useForm'
import { useSSHKeyManager } from '@/hooks/common/useSSHKeyManager'
import { useAppState } from '@/contexts/appState'
import { ActionTypes } from '@/helpers/store'

export type NewSSHKeyFormState = {
  key: string
  label?: string
}

export const initialState: NewSSHKeyFormState = {
  key: '',
  label: '',
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
  const [, dispatch] = useAppState()

  const onSubmit = useCallback(
    async (state: NewSSHKeyFormState) => {
      if (!manager) throw new Error('Manager not ready')

      const accountSSHKey = await manager.add(state)

      dispatch({
        type: ActionTypes.addAccountSSHKey,
        payload: { accountSSHKey },
      })

      router.replace('/dashboard')
    },
    [dispatch, manager, router],
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
