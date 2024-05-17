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
import { SSHKeyManager } from '@/domain/ssh'
import {
  stepsCatalog,
  useCheckoutNotification,
} from '@/hooks/form/useCheckoutNotification'
import { EntityAddAction } from '@/store/entity'

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
  const [, dispatch] = useAppState()

  const manager = useSSHKeyManager()
  const { next, stop } = useCheckoutNotification({})

  const onSubmit = useCallback(
    async (state: NewSSHKeyFormState) => {
      if (!manager) throw new Error('Manager not ready')

      const iSteps = await manager.getSteps(state)
      const nSteps = iSteps.map((i) => stepsCatalog[i])

      const steps = manager.addSteps(state)

      try {
        let accountSSHKey

        while (!accountSSHKey) {
          const { value, done } = await steps.next()

          if (done) {
            accountSSHKey = value[0]
            break
          }

          await next(nSteps)
        }

        dispatch(new EntityAddAction({ name: 'ssh', entities: accountSSHKey }))

        await router.replace('/')
      } finally {
        await stop()
      }
    },
    [dispatch, manager, next, router, stop],
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
