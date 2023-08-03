import { FormEvent, useCallback } from 'react'
import { useRouter } from 'next/router'
import useConnectedWard from '@/hooks/common/useConnectedWard'
import { useForm } from '@/hooks/common/useForm'
import { useSSHKeyManager } from '@/hooks/common/useManager/useSSHKeyManager'
import { useAppState } from '@/contexts/appState'
import { ActionTypes } from '@/helpers/store'
import { UseControllerReturn, useController } from 'react-hook-form'
import { formValidationRules } from '@/helpers/errors'

export type NewSSHKeyFormState = {
  key: string
  label?: string
}

export const defaultValues: Partial<NewSSHKeyFormState> = {}

export type UseNewSSHKeyPageReturn = {
  keyCtrl: UseControllerReturn<NewSSHKeyFormState, 'key'>
  labelCtrl: UseControllerReturn<NewSSHKeyFormState, 'label'>
  handleSubmit: (e: FormEvent) => Promise<void>
}

export function useNewSSHKeyPage(): UseNewSSHKeyPageReturn {
  useConnectedWard()

  const router = useRouter()
  const manager = useSSHKeyManager()
  const [, dispatch] = useAppState()

  const onSubmit = useCallback(
    async (state: NewSSHKeyFormState) => {
      if (!manager) throw new Error('Manager not ready')

      const [accountSSHKey] = await manager.add(state)

      dispatch({
        type: ActionTypes.addAccountSSHKey,
        payload: { accountSSHKey },
      })

      router.replace('/dashboard')
    },
    [dispatch, manager, router],
  )

  const { control, handleSubmit } = useForm({
    defaultValues,
    onSubmit,
  })

  const { required } = formValidationRules

  const keyCtrl = useController({
    control,
    name: 'key',
    rules: { required },
  })

  const labelCtrl = useController({
    control,
    name: 'label',
    rules: { required },
  })

  return {
    keyCtrl,
    labelCtrl,
    handleSubmit,
  }
}
