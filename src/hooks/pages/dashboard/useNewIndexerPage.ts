import { useAppState } from '@/contexts/appState'
import { FormEvent, useCallback, useMemo } from 'react'
import { useRouter } from 'next/router'
import { NameAndTagsField } from '../../form/useAddNameAndTags'
import useConnectedWard from '@/hooks/common/useConnectedWard'
import { useForm } from '@/hooks/common/useForm'
import { useIndexerManager } from '@/hooks/common/useManager/useIndexerManager'
import { ActionTypes } from '@/helpers/store'
import { IndexerManager } from '@/domain/indexer'
import { Control, FieldErrors, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { IndexerBlockchainNetworkField } from '@/hooks/form/useAddIndexerBlockchainNetworks'
import { IndexerTokenAccountField } from '@/hooks/form/useAddIndexerTokenAccounts'
import { IndexerBlockchain } from '@/helpers/constants'

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
  handleChangeEntityTab: (tabId: string) => void
}

export function useNewIndexerPage(): UseNewIndexerPage {
  useConnectedWard()

  const router = useRouter()
  const [appState, dispatch] = useAppState()
  const { account, accountBalance } = appState

  const manager = useIndexerManager()

  const onSubmit = useCallback(
    async (state: NewIndexerFormState) => {
      if (!manager) throw new Error('Manager not ready')

      const accountIndexer = await manager.add(state)

      // @todo: Change this
      dispatch({
        type: ActionTypes.addAccountFunction,
        payload: { accountFunction: accountIndexer },
      })

      // @todo: Check new volumes and domains being created to add them to the store

      router.replace('/dashboard')
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

  const { totalCost } = useMemo(
    () =>
      IndexerManager.getCost({
        specs,
        isPersistent,
        volumes,
        capabilities: {},
      }),
    [isPersistent, specs, volumes],
  )

  const canAfford = (accountBalance || 0) > totalCost
  let isCreateButtonDisabled = !canAfford
  if (process.env.NEXT_PUBLIC_OVERRIDE_ALEPH_BALANCE === 'true') {
    isCreateButtonDisabled = false
  }

  const handleChangeEntityTab = useCallback(
    (id: string) => router.push(`/dashboard/${id}`),
    [router],
  )

  return {
    address: account?.address || '',
    accountBalance: accountBalance || 0,
    isCreateButtonDisabled,
    values,
    control,
    errors,
    holdingRequirementsProps,
    handleSubmit,
    handleChangeEntityTab,
  }
}
