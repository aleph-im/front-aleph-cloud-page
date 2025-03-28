import { FormEvent, useCallback, useEffect, useMemo } from 'react'
import { useRouter } from 'next/router'
import { useForm } from '@/hooks/common/useForm'
import { useWebsiteManager } from '@/hooks/common/useManager/useWebsiteManager'
import { useAppState } from '@/contexts/appState'
import { usePaymentMethod } from '@/hooks/common/usePaymentMethod'
import { WebsiteManager, WebsitePayment } from '@/domain/website'
import { EntityType, PaymentMethod } from '@/helpers/constants'
import { Control, FieldErrors, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { WebsiteFrameworkField } from '@/hooks/form/useSelectWebsiteFramework'
import { WebsiteFolderField } from '@/hooks/form/useAddWebsiteFolder'
import {
  useEntityCost,
  UseEntityCostReturn,
  UseWebsiteCostProps,
} from '@/hooks/common/useEntityCost'
import {
  NameAndTagsField,
  defaultNameAndTags,
} from '@/hooks/form/useAddNameAndTags'
import { DomainField } from '@/hooks/form/useAddDomains'
import {
  stepsCatalog,
  useCheckoutNotification,
} from '@/hooks/form/useCheckoutNotification'
import { EntityAddAction } from '@/store/entity'
import Err from '@/helpers/errors'
import { BlockchainId } from '@/domain/connect/base'
import { useCanAfford } from '@/hooks/common/useCanAfford'

export type NewWebsiteFormState = NameAndTagsField &
  WebsiteFrameworkField & {
    website: WebsiteFolderField
    payment: WebsitePayment
    domains?: Omit<DomainField, 'ref'>[]
    ens?: string[]
  }

export const getDefaultValues = (
  paymentMethod: PaymentMethod,
): Partial<NewWebsiteFormState> => ({
  ...defaultNameAndTags,
  payment: { chain: BlockchainId.ETH, type: paymentMethod },
})

export type UseNewWebsitePagePageReturn = {
  address: string
  accountBalance: number
  isCreateButtonDisabled: boolean
  values: any
  control: Control<any>
  errors: FieldErrors<NewWebsiteFormState>
  cost: UseEntityCostReturn
  handleSubmit: (e: FormEvent) => Promise<void>
  handleBack: () => void
}

export function useNewWebsitePage(): UseNewWebsitePagePageReturn {
  const router = useRouter()
  const [appState, dispatch] = useAppState()
  const { account, balance: accountBalance = 0 } = appState.connection
  const { paymentMethod: globalPaymentMethod, setPaymentMethod } =
    usePaymentMethod()

  const manager = useWebsiteManager()
  const { next, stop } = useCheckoutNotification({})

  const onSubmit = useCallback(
    async (state: NewWebsiteFormState) => {
      if (!manager) throw Err.ConnectYourWallet

      const iSteps = await manager.getAddSteps(state)
      const nSteps = iSteps.map((i) => stepsCatalog[i])

      const steps = manager.addSteps(state)

      try {
        let accountWebsite

        while (!accountWebsite) {
          const { value, done } = await steps.next()

          if (done) {
            accountWebsite = value
            break
          }

          await next(nSteps)
        }

        dispatch(
          new EntityAddAction({ name: 'website', entities: accountWebsite }),
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
    setValue,
  } = useForm({
    defaultValues: getDefaultValues(globalPaymentMethod),
    onSubmit,
    resolver: zodResolver(WebsiteManager.addSchema),
  })

  const values = useWatch({ control }) as NewWebsiteFormState

  // Sync form payment method with global payment method (both ways)
  useEffect(() => {
    // Update local form when global state changes (only on mount or global change)
    if (values.payment?.type !== globalPaymentMethod) {
      setValue('payment', { ...values.payment, type: globalPaymentMethod })
    }
  }, [globalPaymentMethod, setValue, values.payment])

  // Update global state when form changes
  useEffect(() => {
    if (globalPaymentMethod !== values.payment?.type) {
      setPaymentMethod(values.payment?.type)
    }
  }, [values.payment?.type, globalPaymentMethod, setPaymentMethod])

  const costProps: UseWebsiteCostProps = useMemo(
    () => ({
      entityType: EntityType.Website,
      props: {
        website: values.website,
        payment: values.payment,
        domains: values.domains,
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
