import { useAppState } from '@/contexts/appState'
import { FormEvent, useCallback } from 'react'
import { useRouter } from 'next/router'
import { NameAndTagsField } from '../../form/useAddNameAndTags'
import { useForm } from '@/hooks/common/useForm'
import { useIndexerManager } from '@/hooks/common/useManager/useIndexerManager'
import { IndexerManager } from '@/domain/indexer'
import { Control, FieldErrors, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { IndexerBlockchainNetworkField } from '@/hooks/form/useAddIndexerBlockchainNetworks'
import { IndexerTokenAccountField } from '@/hooks/form/useAddIndexerTokenAccounts'
import { EntityType, IndexerBlockchain } from '@/helpers/constants'
import { useEntityCost } from '@/hooks/common/useEntityCost'
import { EntityAddAction } from '@/store/entity'

export type NewIndexerFormState = NameAndTagsField & {
  networks: IndexerBlockchainNetworkField[]
  accounts: IndexerTokenAccountField[]
}

const defaultValues: Partial<NewIndexerFormState> = {
  networks: [
    {
      id: '',
      blockchain: IndexerBlockchain.Ethereum,
      rpcUrl: '',
    },
  ],
  accounts: [
    {
      network: '',
      contract: '',
      deployer: '',
      supply: '',
    } as IndexerTokenAccountField,
  ],
}

// @todo: Split this into reusable hooks by composition

export type UseNewIndexerPage = {
  address: string
  accountBalance: number
  isCreateButtonDisabled: boolean
  values: any
  control: Control<any>
  errors: FieldErrors<NewIndexerFormState>
  holdingRequirementsProps: Record<string, unknown>
  handleSubmit: (e: FormEvent) => Promise<void>
}

export function useNewIndexerPage(): UseNewIndexerPage {
  const router = useRouter()
  const [appState, dispatch] = useAppState()
  const { account, balance: accountBalance = 0 } = appState.connection

  const manager = useIndexerManager()

  const onSubmit = useCallback(
    async (state: NewIndexerFormState) => {
      if (!manager) throw new Error('Manager not ready')

      const accountIndexer = await manager.add(state)

      // @todo: Change this
      dispatch(
        new EntityAddAction({ name: 'indexer', entities: accountIndexer }),
      )

      // @todo: Check new volumes and domains being created to add them to the store

      await router.replace('/')
    },
    [dispatch, manager, router],
  )

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    onSubmit,
    resolver: zodResolver(IndexerManager.addSchema),
  })
  // @note: dont use watch, use useWatch instead: https://github.com/react-hook-form/react-hook-form/issues/10753
  const values = useWatch({ control }) as NewIndexerFormState

  const holdingRequirementsProps = IndexerManager.getStaticProgramConfig()
  const { specs, isPersistent, volumes } = holdingRequirementsProps

  const { cost } = useEntityCost({
    entityType: EntityType.Indexer,
    props: {
      specs,
      isPersistent,
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
    accountBalance,
    isCreateButtonDisabled,
    values,
    control,
    errors,
    holdingRequirementsProps,
    handleSubmit,
  }
}
