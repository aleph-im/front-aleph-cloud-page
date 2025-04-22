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
import { CRN, NewCRN, NodeManager } from '@/domain/node'
import { useNotification, TooltipProps } from '@aleph-front/core'
import { EntityAddAction } from '@/store/entity'
import { useEthereumNetwork } from '@/hooks/common/useEthereumNetwork'
import { useNodeManager } from '@/hooks/common/useManager/useNodeManager'

export type NewComputeResourceNodeFormState = NewCRN

const defaultValues: Partial<NewComputeResourceNodeFormState> = {
  name: '',
  address: '',
}

// @todo: Split this into reusable hooks by composition

export type UseNewComputeResourceNodeFormReturn = {
  values: any
  control: Control<any>
  nameCtrl: UseControllerReturn<NewComputeResourceNodeFormState, 'name'>
  addressCtrl: UseControllerReturn<NewComputeResourceNodeFormState, 'address'>
  errors: FieldErrors<NewComputeResourceNodeFormState>
  isEthereumNetwork: boolean
  getEthereumNetworkTooltip: () => TooltipProps['content']
  handleSubmit: (e: FormEvent) => Promise<void>
}

function calculateVirtualNode(
  state: NewComputeResourceNodeFormState,
  hash: string,
  address: string,
): CRN {
  const virtualNode: CRN = {
    hash,
    owner: address,
    manager: address,
    reward: address,
    locked: false,
    authorized: [],
    parent: null,
    time: Date.now(),
    status: 'waiting',
    score: 0,
    score_updated: false,
    decentralization: 0,
    performance: 0,
    type: 'compute',
    ...state,
    virtual: Date.now(),
  }

  return virtualNode
}

export function useNewComputeResourceNodeForm(): UseNewComputeResourceNodeFormReturn {
  const router = useRouter()
  const [state, dispatch] = useAppState()
  const {
    connection: { account },
  } = state

  const nodeManager = useNodeManager()

  const { isEthereumNetwork, getEthereumNetworkTooltip } = useEthereumNetwork()
  const noti = useNotification()

  const onSubmit = useCallback(
    async (state: NewComputeResourceNodeFormState) => {
      if (!nodeManager) throw new Error('Manager not ready')
      if (!account) throw new Error('Invalid account')

      const hash = await nodeManager.newComputeResourceNode(state)

      const entity = calculateVirtualNode(state, hash, account.address)

      return entity
    },
    [account, nodeManager],
  )

  const onSuccess = useCallback(
    async (entity: CRN) => {
      if (!noti) throw new Error('Notification not ready')

      noti.add({
        variant: 'success',
        title: 'Success',
        text: `Your node "${entity.hash}" was created successfully.`,
      })

      dispatch(
        new EntityAddAction({
          name: 'crns',
          entities: [entity],
        }),
      )

      router.replace(`/account/earn/crn/${entity.hash}`)
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
    resolver: zodResolver(NodeManager.newCRNSchema),
  })
  // @note: dont use watch, use useWatch instead: https://github.com/react-hook-form/react-hook-form/issues/10753
  const values = useWatch({ control }) as NewComputeResourceNodeFormState

  const nameCtrl = useController({
    control,
    name: 'name',
  })

  const addressCtrl = useController({
    control,
    name: 'address',
  })

  return {
    values,
    control,
    nameCtrl,
    addressCtrl,
    errors,
    isEthereumNetwork,
    getEthereumNetworkTooltip,
    handleSubmit,
  }
}
