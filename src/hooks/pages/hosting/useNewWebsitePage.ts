import { FormEvent, useCallback, useMemo } from 'react'
import { useRouter } from 'next/router'
import { useForm } from '@/hooks/common/useForm'
import { useWebsiteManager } from '@/hooks/common/useManager/useWebsiteManager'
import { useAppState } from '@/contexts/appState'
import { WebsiteManager, WebsitePayment } from '@/domain/website'
import { EntityType, PaymentMethod } from '@/helpers/constants'
import { Control, FieldErrors, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { WebsiteFrameworkField } from '@/hooks/form/useSelectWebsiteFramework'
import { WebsiteFolderField } from '@/hooks/form/useAddWebsiteFolder'
import {
  useEntityCost,
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

export type NewWebsiteFormState = NameAndTagsField &
  WebsiteFrameworkField & {
    website: WebsiteFolderField
    payment: WebsitePayment
    domains?: Omit<DomainField, 'ref'>[]
    ens?: string[]
  }

export const defaultValues: Partial<NewWebsiteFormState> = {
  ...defaultNameAndTags,
  payment: { chain: BlockchainId.ETH, type: PaymentMethod.Hold },
}

export type UseNewWebsitePagePageReturn = {
  address: string
  accountBalance: number
  isCreateButtonDisabled: boolean
  values: any
  control: Control<any>
  errors: FieldErrors<NewWebsiteFormState>
  costProps: UseWebsiteCostProps
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
        payment: values.payment,
        domains: values.domains,
      },
    }),
    [values],
  )

  const { cost } = useEntityCost(costProps)

  const canAfford =
    accountBalance >= (cost?.totalCost || Number.MAX_SAFE_INTEGER)
  let isCreateButtonDisabled = !canAfford || !values.framework || !values.name
  if (process.env.NEXT_PUBLIC_OVERRIDE_ALEPH_BALANCE === 'true') {
    isCreateButtonDisabled = false
  }

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
    costProps,
    handleSubmit,
    handleBack,
  }
}
