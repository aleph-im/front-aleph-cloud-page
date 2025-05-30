import { FormEvent, useCallback, useMemo } from 'react'
import { useAppState } from '@/contexts/appState'
import { useSyncPaymentMethod } from '@/hooks/common/useSyncPaymentMethod'
import { useRouter } from 'next/router'
import { InstanceSpecsField } from '@/hooks/form/useSelectInstanceSpecs'
import { VolumeField } from '@/hooks/form/useAddVolume'
import { EnvVarField } from '@/hooks/form/useAddEnvVars'
import {
  NameAndTagsField,
  defaultNameAndTags,
} from '@/hooks/form/useAddNameAndTags'
import { useForm } from '@/hooks/common/useForm'
import { useProgramManager } from '@/hooks/common/useManager/useProgramManager'
import { DomainField } from '@/hooks/form/useAddDomains'
import { AddProgram, ProgramManager } from '@/domain/program'
import { Control, FieldErrors, useWatch } from 'react-hook-form'
import { FunctionCodeField, defaultCode } from '@/hooks/form/useAddFunctionCode'
import { zodResolver } from '@hookform/resolvers/zod'
import { CustomFunctionRuntimeField } from '@/domain/runtime'
import {
  useEntityCost,
  UseEntityCostReturn,
  UseProgramCostProps,
} from '@/hooks/common/useEntityCost'
import { EntityType, PaymentMethod } from '@/helpers/constants'
import {
  stepsCatalog,
  useCheckoutNotification,
} from '@/hooks/form/useCheckoutNotification'
import { EntityAddAction } from '@/store/entity'
import Err from '@/helpers/errors'
import { useDefaultTiers } from '@/hooks/common/pricing/useDefaultTiers'
import { useCanAfford } from '@/hooks/common/useCanAfford'
import { useConnection } from '@/hooks/common/useConnection'

export type NewFunctionFormState = NameAndTagsField & {
  code: FunctionCodeField
  specs: InstanceSpecsField
  isPersistent: boolean
  runtime?: CustomFunctionRuntimeField
  volumes?: VolumeField[]
  envVars?: EnvVarField[]
  domains?: DomainField[]
  paymentMethod: PaymentMethod
}

// @todo: Split this into reusable hooks by composition

export type UseNewFunctionPage = {
  address: string
  accountBalance: number
  isCreateButtonDisabled: boolean
  values: any
  control: Control<any>
  errors: FieldErrors<NewFunctionFormState>
  cost: UseEntityCostReturn
  handleSubmit: (e: FormEvent) => Promise<void>
  handleBack: () => void
}

export function useNewFunctionPage(): UseNewFunctionPage {
  const router = useRouter()
  const [, dispatch] = useAppState()
  const {
    blockchain,
    account,
    balance: accountBalance = 0,
  } = useConnection({
    triggerOnMount: false,
  })

  const manager = useProgramManager()
  const { next, stop } = useCheckoutNotification()

  const onSubmit = useCallback(
    async (state: NewFunctionFormState) => {
      if (!manager) throw Err.ConnectYourWallet

      const program = {
        ...state,
        payment: {
          chain: blockchain,
          type: PaymentMethod.Hold,
        },
      } as AddProgram

      const iSteps = await manager.getAddSteps(program)
      const nSteps = iSteps.map((i) => stepsCatalog[i])

      const steps = manager.addSteps(program)

      try {
        let accountFunction

        while (!accountFunction) {
          const { value, done } = await steps.next()

          if (done) {
            accountFunction = value
            break
          }

          await next(nSteps)
        }

        // @todo: Check new volumes and domains being created to add them to the store
        dispatch(
          new EntityAddAction({ name: 'program', entities: accountFunction }),
        )

        await router.replace('/console')
      } finally {
        await stop()
      }
    },
    [blockchain, dispatch, manager, next, router, stop],
  )

  const { defaultTiers } = useDefaultTiers({ type: EntityType.Program })

  const defaultValues: Partial<NewFunctionFormState> = useMemo(
    () => ({
      ...defaultNameAndTags,
      code: { ...defaultCode } as FunctionCodeField,
      specs: defaultTiers[0],
      isPersistent: false,
      paymentMethod: PaymentMethod.Hold,
    }),
    [defaultTiers],
  )

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues,
    onSubmit,
    resolver: zodResolver(ProgramManager.addSchema),
  })
  // @note: dont use watch, use useWatch instead: https://github.com/react-hook-form/react-hook-form/issues/10753
  const values = useWatch({ control }) as NewFunctionFormState

  const costProps: UseProgramCostProps = useMemo(
    () => ({
      entityType: EntityType.Program,
      props: {
        name: values.name || 'MOCK',
        specs: values.specs,
        isPersistent: values.isPersistent,
        volumes: values.volumes,
        domains: values.domains,
        paymentMethod: values.paymentMethod,
        code: values.code,
      },
    }),
    [values],
  )

  const cost = useEntityCost(costProps)

  const { isCreateButtonDisabled } = useCanAfford({
    cost,
    accountBalance,
  })

  const handleBack = () => {
    router.push('.')
  }

  // Sync form payment method with global state
  useSyncPaymentMethod({
    formPaymentMethod: values.paymentMethod,
    setValue,
  })

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
