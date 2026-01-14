import { FormEvent, useCallback, useMemo } from 'react'
import { useRouter } from 'next/router'
import { useForm } from '@/hooks/common/useForm'
import { useWebsiteManager } from '@/hooks/common/useManager/useWebsiteManager'
import { useAppState } from '@/contexts/appState'
import { useSyncPaymentMethod } from '@/hooks/common/useSyncPaymentMethod'
import { AddWebsite, WebsiteManager, WebsitePayment } from '@/domain/website'
import { EntityType, NAVIGATION_URLS, PaymentMethod } from '@/helpers/constants'
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
import { useCanAfford } from '@/hooks/common/useCanAfford'
import { BlockchainId } from '@/domain/connect'

export type NewWebsiteFormState = NameAndTagsField &
  WebsiteFrameworkField & {
    website: WebsiteFolderField
    domains?: Omit<DomainField, 'ref'>[]
    ens?: string[]
    paymentMethod: PaymentMethod
  }

export const defaultValues: Partial<NewWebsiteFormState> = {
  ...defaultNameAndTags,
  paymentMethod: PaymentMethod.Hold,
}

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

  const manager = useWebsiteManager()
  const { next, stop } = useCheckoutNotification({})

  const onSubmit = useCallback(
    async (state: NewWebsiteFormState) => {
      if (!manager) throw Err.ConnectYourWallet

      // @todo: Refactor this
      const payment: WebsitePayment = {
        chain: BlockchainId.ETH,
        type: PaymentMethod.Hold,
      }

      const website = {
        ...state,
        payment,
      } as AddWebsite

      const iSteps = await manager.getAddSteps(website)
      const nSteps = iSteps.map((i) => stepsCatalog[i])

      const steps = manager.addSteps(website)

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

        await router.replace(
          NAVIGATION_URLS.console.web3Hosting.website.detail(accountWebsite.id),
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
    setValue,
  } = useForm({
    defaultValues,
    onSubmit,
    resolver: zodResolver(WebsiteManager.addSchema),
  })

  const values = useWatch({ control }) as NewWebsiteFormState

  const costProps: UseWebsiteCostProps = useMemo(
    () => ({
      entityType: EntityType.Website,
      props: {
        website: values.website,
        paymentMethod: values.paymentMethod,
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

  // Sync form payment method with global state - special case for nested field
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
