import { useAppState } from '@/contexts/appState'
import { FormEvent, useCallback } from 'react'
import { useRouter } from 'next/router'
import { useForm } from '@/hooks/common/useForm'
import {
  Control,
  FieldErrors,
  UseControllerReturn,
  useController,
  useWatch,
} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CCN, NewCCN, NodeManager } from '@/domain/node'
import { useNotification, TooltipProps } from '@aleph-front/core'
import { EntityAddAction } from '@/store/entity'
import { useEthereumNetwork } from '@/hooks/common/useEthereumNetwork'

export type NewCoreChannelNodeFormState = NewCCN

const defaultValues: Partial<NewCoreChannelNodeFormState> = {
  name: '',
  multiaddress: '',
}

export type UseNewCoreChannelNodeFormReturn = {
  values: any
  control: Control<any>
  nameCtrl: UseControllerReturn<NewCoreChannelNodeFormState, 'name'>
  multiaddressCtrl: UseControllerReturn<
    NewCoreChannelNodeFormState,
    'multiaddress'
  >
  errors: FieldErrors<NewCoreChannelNodeFormState>
  isEthereumNetwork: boolean
  getEthereumNetworkTooltip: () => TooltipProps['content']
  handleSubmit: (e: FormEvent) => Promise<void>
}

function calculateVirtualNode(
  state: NewCoreChannelNodeFormState,
  hash: string,
  address: string,
): CCN {
  const virtualNode: CCN = {
    hash,
    owner: address,
    reward: address,
    locked: false,
    authorized: [],
    resource_nodes: [],
    crnsData: [],
    time: Date.now(),
    stakers: {},
    total_staked: 0,
    status: 'waiting',
    score: 0,
    score_updated: false,
    decentralization: 0,
    performance: 0,
    has_bonus: false,
    ...state,
    virtual: Date.now(),
  }

  return virtualNode
}

export function useNewCoreChannelNodeForm(): UseNewCoreChannelNodeFormReturn {
  const router = useRouter()
  const [state, dispatch] = useAppState()
  const {
    connection: { account },
    manager: { nodeManager },
  } = state

  const { isEthereumNetwork, getEthereumNetworkTooltip } = useEthereumNetwork()
  const noti = useNotification()

  const onSubmit = useCallback(
    async (state: NewCoreChannelNodeFormState) => {
      if (!nodeManager) throw new Error('Manager not ready')
      if (!account) throw new Error('Invalid account')

      const hash = await nodeManager.newCoreChannelNode(state)

      const entity = calculateVirtualNode(state, hash, account.address)

      return entity
    },
    [account, nodeManager],
  )

  const onSuccess = useCallback(
    async (entity: CCN) => {
      if (!noti) throw new Error('Notification not ready')

      noti.add({
        variant: 'success',
        title: 'Success',
        text: `Your node "${entity.hash}" was created successfully.`,
      })

      dispatch(
        new EntityAddAction({
          name: 'ccns',
          entities: [entity],
        }),
      )

      router.replace(`/account/earn/ccn/${entity.hash}`)
    },
    [dispatch, noti, router],
  )

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    onSubmit,
    onSuccess,
    resolver: zodResolver(NodeManager.newCCNSchema),
  })
  // @note: dont use watch, use useWatch instead: https://github.com/react-hook-form/react-hook-form/issues/10753
  const values = useWatch({ control }) as NewCoreChannelNodeFormState

  const nameCtrl = useController({
    control,
    name: 'name',
  })

  const multiaddressCtrl = useController({
    control,
    name: 'multiaddress',
  })

  return {
    values,
    control,
    nameCtrl,
    multiaddressCtrl,
    errors,
    isEthereumNetwork,
    getEthereumNetworkTooltip,
    handleSubmit,
  }
}
