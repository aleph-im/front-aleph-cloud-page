import { FormEvent, useCallback, useMemo } from 'react'
import { useAppState } from '@/contexts/appState'
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
import {
  CreditPaymentConfiguration,
  PaymentConfiguration,
} from '@/domain/executable'
import { BlockchainId } from '@/domain/connect'

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
  accountCreditBalance: number
  createFunctionDisabled: boolean
  createFunctionButtonTitle: string
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
    creditBalance: accountCreditBalance = 0,
    handleConnect,
  } = useConnection({
    triggerOnMount: false,
  })

  const manager = useProgramManager()
  const { next, stop } = useCheckoutNotification()

  const onSubmit = useCallback(
    async (state: NewFunctionFormState) => {
      if (!manager) throw Err.ConnectYourWallet
      if (!account) throw Err.InvalidAccount

      if (!blockchain) {
        handleConnect({ blockchain: BlockchainId.BASE })
        throw Err.InvalidNetwork
      }

      const payment: CreditPaymentConfiguration = {
        chain: blockchain,
        type: PaymentMethod.Credit,
      }

      const program = {
        ...state,
        payment,
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
    [account, blockchain, handleConnect, dispatch, manager, next, router, stop],
  )

  const { defaultTiers } = useDefaultTiers({ type: EntityType.Program })

  const defaultValues: Partial<NewFunctionFormState> = useMemo(
    () => ({
      ...defaultNameAndTags,
      code: { ...defaultCode } as FunctionCodeField,
      specs: defaultTiers[0],
      isPersistent: false,
      paymentMethod: PaymentMethod.Credit,
    }),
    [defaultTiers],
  )

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    onSubmit,
    resolver: zodResolver(ProgramManager.addSchema),
  })
  // @note: dont use watch, use useWatch instead: https://github.com/react-hook-form/react-hook-form/issues/10753
  const values = useWatch({ control }) as NewFunctionFormState

  const payment: PaymentConfiguration = useMemo(() => {
    return {
      chain: blockchain,
      type: PaymentMethod.Credit,
    } as CreditPaymentConfiguration
  }, [blockchain])

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
        payment,
        code: values.code,
      },
    }),
    [payment, values],
  )

  const cost = useEntityCost(costProps)

  const { canAfford, isCreateButtonDisabled } = useCanAfford({
    cost,
    accountCreditBalance,
  })

  // Checks if user can afford with current balance
  const hasEnoughBalance = useMemo(() => {
    if (!account) return false
    if (!isCreateButtonDisabled) return true
    return canAfford
  }, [account, canAfford, isCreateButtonDisabled])

  const createFunctionButtonTitle: UseNewFunctionPage['createFunctionButtonTitle'] =
    useMemo(() => {
      if (!account) return 'Connect'
      if (!hasEnoughBalance) return 'Insufficient Credits'

      return 'Create function'
    }, [account, hasEnoughBalance])

  const createFunctionDisabled = useMemo(() => {
    return createFunctionButtonTitle !== 'Create function'
  }, [createFunctionButtonTitle])

  const handleBack = () => {
    router.push('.')
  }

  return {
    address: account?.address || '',
    accountCreditBalance,
    createFunctionDisabled,
    createFunctionButtonTitle,
    values,
    control,
    errors,
    cost,
    handleSubmit,
    handleBack,
  }
}
