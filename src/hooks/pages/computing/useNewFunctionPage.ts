import { useAppState } from '@/contexts/appState'
import { FormEvent, useCallback } from 'react'
import { useRouter } from 'next/router'
import {
  InstanceSpecsField,
  getDefaultSpecsOptions,
} from '../../form/useSelectInstanceSpecs'
import { VolumeField } from '../../form/useAddVolume'
import { EnvVarField } from '../../form/useAddEnvVars'
import {
  NameAndTagsField,
  defaultNameAndTags,
} from '../../form/useAddNameAndTags'
import { useForm } from '@/hooks/common/useForm'
import { useProgramManager } from '@/hooks/common/useManager/useProgramManager'
import { DomainField } from '@/hooks/form/useAddDomains'
import { ProgramManager } from '@/domain/program'
import { Control, FieldErrors, useWatch } from 'react-hook-form'
import { FunctionCodeField, defaultCode } from '@/hooks/form/useAddFunctionCode'
import { zodResolver } from '@hookform/resolvers/zod'
import { CustomFunctionRuntimeField } from '@/domain/runtime'
import { useEntityCost } from '@/hooks/common/useEntityCost'
import { EntityType, PaymentMethod } from '@/helpers/constants'
import {
  stepsCatalog,
  useCheckoutNotification,
} from '@/hooks/form/useCheckoutNotification'
import { EntityAddAction } from '@/store/entity'
import Err from '@/helpers/errors'

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

const defaultValues: Partial<NewFunctionFormState> = {
  ...defaultNameAndTags,
  code: { ...defaultCode } as FunctionCodeField,
  specs: { ...getDefaultSpecsOptions(false)[0] },
  isPersistent: false,
  paymentMethod: PaymentMethod.Hold,
}

// @todo: Split this into reusable hooks by composition

export type UseNewFunctionPage = {
  address: string
  accountBalance: number
  isCreateButtonDisabled: boolean
  values: any
  control: Control<any>
  errors: FieldErrors<NewFunctionFormState>
  handleSubmit: (e: FormEvent) => Promise<void>
}

export function useNewFunctionPage(): UseNewFunctionPage {
  const router = useRouter()
  const [appState, dispatch] = useAppState()
  const { account, balance: accountBalance = 0 } = appState.connection

  const manager = useProgramManager()
  const { next, stop } = useCheckoutNotification()

  const onSubmit = useCallback(
    async (state: NewFunctionFormState) => {
      if (!manager) throw Err.ConnectYourWallet

      const iSteps = await manager.getAddSteps(state)
      const nSteps = iSteps.map((i) => stepsCatalog[i])

      const steps = manager.addSteps(state)

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
    resolver: zodResolver(ProgramManager.addSchema),
  })
  // @note: dont use watch, use useWatch instead: https://github.com/react-hook-form/react-hook-form/issues/10753
  const values = useWatch({ control }) as NewFunctionFormState

  const { cost } = useEntityCost({
    entityType: EntityType.Program,
    props: {
      specs: values.specs,
      isPersistent: values.isPersistent,
      volumes: values.volumes,
    },
  })

  const canAfford =
    accountBalance >= (cost?.totalCost || Number.MAX_SAFE_INTEGER)
  let isCreateButtonDisabled = !canAfford
  if (process.env.NEXT_PUBLIC_OVERRIDE_ALEPH_BALANCE === 'true') {
    isCreateButtonDisabled = false
  }

  return {
    address: account?.address || '',
    accountBalance,
    isCreateButtonDisabled,
    values,
    control,
    errors,
    handleSubmit,
  }
}
