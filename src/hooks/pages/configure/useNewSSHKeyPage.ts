import { FormEvent, useCallback } from 'react'
import { useRouter } from 'next/router'
import {
  FieldErrors,
  UseControllerReturn,
  useController,
} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { useForm } from '@/hooks/common/useForm'
import { useSSHKeyManager } from '@/hooks/common/useManager/useSSHKeyManager'
import { useAppState } from '@/contexts/appState'
import { ActionTypes } from '@/helpers/store'
import { SSHKeyManager } from '@/domain/ssh'

export type NewSSHKeyFormState = {
  key: string
  label: string
}

export const defaultValues: NewSSHKeyFormState = {
  key: '',
  label: '',
}

export type UseNewSSHKeyPageReturn = {
  keyCtrl: UseControllerReturn<NewSSHKeyFormState, 'key'>
  labelCtrl: UseControllerReturn<NewSSHKeyFormState, 'label'>
  errors: FieldErrors<NewSSHKeyFormState>
  handleSubmit: (e: FormEvent) => Promise<void>
}

export function useNewSSHKeyPage(): UseNewSSHKeyPageReturn {
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

      await router.replace('/')
    },
    [dispatch, manager, router],
  )

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    onSubmit,
    resolver: zodResolver(SSHKeyManager.addSchema),
  })

  const keyCtrl = useController({
    control,
    name: 'key',
  })

  const labelCtrl = useController({
    control,
    name: 'label',
  })

  return {
    keyCtrl,
    labelCtrl,
    handleSubmit,
    errors,
  }
}