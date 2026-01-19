import { FormEvent, useCallback, useMemo } from 'react'
import { useRouter } from 'next/router'
import { VolumeManager, VolumeType } from '@/domain/volume'
import { useAppState } from '@/contexts/appState'
import { useForm } from '@/hooks/common/useForm'
import { NewVolumeStandaloneField } from '@/hooks/form/useAddVolume'
import { useVolumeManager } from '@/hooks/common/useManager/useVolumeManager'
import { Control, FieldErrors, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  useEntityCost,
  UseEntityCostReturn,
  UseVolumeCostProps,
} from '@/hooks/common/useEntityCost'
import { EntityType } from '@/helpers/constants'
import {
  stepsCatalog,
  useCheckoutNotification,
} from '@/hooks/form/useCheckoutNotification'
import { EntityAddAction } from '@/store/entity'
import Err from '@/helpers/errors'
import { useCanAfford } from '@/hooks/common/useCanAfford'
import { NAVIGATION_URLS } from '@/helpers/constants'

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
  cost: UseEntityCostReturn
  handleSubmit: (e: FormEvent) => Promise<void>
  handleBack: () => void
}

export function useNewVolumePage(): UseNewVolumePageReturn {
  const router = useRouter()
  const [appState, dispatch] = useAppState()
  const { account, balance: accountBalance = 0 } = appState.connection

  const manager = useVolumeManager()
  const { next, stop } = useCheckoutNotification({})

  const onSubmit = useCallback(
    async (state: NewVolumeFormState) => {
      if (!manager) throw Err.ConnectYourWallet

      const iSteps = await manager.getAddSteps(state)
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

        dispatch(
          new EntityAddAction({ name: 'volume', entities: accountVolume }),
        )

        await router.replace(
          NAVIGATION_URLS.console.storage.volumes.detail(accountVolume.id),
        )
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
  const volume = useMemo(() => values, [values])

  const costProps: UseVolumeCostProps = useMemo(() => {
    return {
      entityType: EntityType.Volume,
      props: { volume },
    }
  }, [volume])

  const cost = useEntityCost(costProps)

  const { isCreateButtonDisabled } = useCanAfford({
    cost,
    accountBalance,
  })

  const handleBack = () => {
    router.push(NAVIGATION_URLS.console.storage.home)
  }

  return {
    address: account?.address || '',
    accountBalance,
    isCreateButtonDisabled,
    values,
    control,
    errors,
    cost,
    handleSubmit,
    handleBack,
  }
}
