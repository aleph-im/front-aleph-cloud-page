import { FormEvent, useCallback, useMemo } from 'react'
import { useRouter } from 'next/router'
import { VolumeManager, VolumeType } from '@/domain/volume'
import { useAppState } from '@/contexts/appState'
import { useForm } from '@/hooks/common/useForm'
import { NewVolumeStandaloneField } from '@/hooks/form/useAddVolume'
import { useVolumeManager } from '@/hooks/common/useManager/useVolumeManager'
import { ActionTypes } from '@/helpers/store'
import { Control, FieldErrors, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEntityCost } from '@/hooks/common/useEntityCost'
import { EntityType } from '@/helpers/constants'
import {
  stepsCatalog,
  useCheckoutNotification,
} from '@/hooks/form/useCheckoutNotification'

export type NewVolumeFormState = NewVolumeStandaloneField

export const defaultValues: NewVolumeFormState = {
  volumeType: VolumeType.New,
}

export type UseNewVolumePageReturn = {
  address: string
  accountBalance: number
  isCreateButtonDisabled: boolean
  values: any
  control: Control<any>
  errors: FieldErrors<NewVolumeFormState>
  handleSubmit: (e: FormEvent) => Promise<void>
}

export function useNewVolumePage(): UseNewVolumePageReturn {
  const router = useRouter()
  const [appState, dispatch] = useAppState()
  const { account } = appState

  const manager = useVolumeManager()
  const { next, stop } = useCheckoutNotification({})

  const onSubmit = useCallback(
    async (state: NewVolumeFormState) => {
      if (!manager) throw new Error('Manager not ready')

      const iSteps = await manager.getSteps(state)
      const nSteps = iSteps.map((i) => stepsCatalog[i])

      const steps = manager.addSteps(state)

      try {
        let accountVolume

        while (!accountVolume) {
          const { value, done } = await steps.next()

          if (done) {
            accountVolume = value[0]
            break
          }

          await next(nSteps)
        }

        dispatch({
          type: ActionTypes.addAccountVolume,
          payload: { accountVolume },
        })

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
    resolver: zodResolver(VolumeManager.addSchema),
  })

  const values = useWatch({ control }) as NewVolumeFormState

  const accountBalance = appState?.accountBalance || 0

  const volumes = useMemo(() => [values], [values])

  const { cost } = useEntityCost({
    entityType: EntityType.Volume,
    props: {
      volumes,
    },
  })

  const canAfford =
    accountBalance > (cost?.totalCost || Number.MAX_SAFE_INTEGER)
  let isCreateButtonDisabled = !canAfford
  if (process.env.NEXT_PUBLIC_OVERRIDE_ALEPH_BALANCE === 'true') {
    isCreateButtonDisabled = false
  }

  return {
    address: account?.address || '',
    accountBalance: appState.accountBalance || 0,
    isCreateButtonDisabled,
    values,
    control,
    errors,
    handleSubmit,
  }
}
