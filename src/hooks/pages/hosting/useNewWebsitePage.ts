import { FormEvent, useCallback } from 'react'
import { useRouter } from 'next/router'
import { WebsiteManager } from '@/domain/website'
import { useAppState } from '@/contexts/appState'
import { useForm } from '@/hooks/common/useForm'
import { useWebsiteManager } from '@/hooks/common/useManager/useWebsiteManager'
import { ActionTypes } from '@/helpers/store'
import { Control, FieldErrors, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEntityCost } from '@/hooks/common/useEntityCost'
import { EntityType, PaymentMethod } from '@/helpers/constants'
import {
  stepsCatalog,
  useCheckoutNotification,
} from '@/hooks/form/useCheckoutNotification'
import { WebsiteFolderField } from '@/hooks/form/useAddWebsiteFolder'
import {
  NameAndTagsField,
  defaultNameAndTags,
} from '@/hooks/form/useAddNameAndTags'
import { DomainField } from '@/hooks/form/useAddDomains'
import { WebsiteFrameworkField } from '@/hooks/form/useSelectWebsiteFramework'
import Err from '@/helpers/errors'

export type NewWebsiteFormState = NameAndTagsField &
  WebsiteFrameworkField & {
    website: WebsiteFolderField
    domains?: DomainField[]
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
  handleSubmit: (e: FormEvent) => Promise<void>
}

export function useNewWebsitePage(): UseNewWebsitePagePageReturn {
  const router = useRouter()
  const [appState, dispatch] = useAppState()
  const { account } = appState

  const manager = useWebsiteManager()
  const { next, stop } = useCheckoutNotification({})

  const onSubmit = useCallback(
    async (state: NewWebsiteFormState) => {
      if (!manager) throw Err.ConnectYourWallet

      const iSteps = await manager.getSteps(state)
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

        dispatch({
          type: ActionTypes.addAccountWebsite,
          payload: { accountWebsite },
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
    resolver: zodResolver(WebsiteManager.addSchema),
  })

  const values = useWatch({ control }) as NewWebsiteFormState

  const accountBalance = appState?.accountBalance || 0

  const { cost } = useEntityCost({
    entityType: EntityType.Website,
    props: {
      website: values.website,
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
