import { useAppState } from '@/contexts/appState'
import { FormEvent, useCallback } from 'react'
import { useForm } from '@/hooks/common/useForm'
import {
  Control,
  FieldErrors,
  UseControllerReturn,
  useController,
  useWatch,
} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CCN, NodeManager, UpdateCCN } from '@/domain/node'
import { useNotification } from '@aleph-front/core'
import { EntityAddAction } from '@/store/entity'

export type UseEditCoreChannelNodeFormState = UpdateCCN

export type UseEditCoreChannelNodeFormProps = {
  defaultValues?: Partial<UseEditCoreChannelNodeFormState>
}

export type UseEditCoreChannelNodeFormReturn = {
  values: any
  control: Control<any>
  nameCtrl: UseControllerReturn<UseEditCoreChannelNodeFormState, 'name'>
  descriptionCtrl: UseControllerReturn<
    UseEditCoreChannelNodeFormState,
    'description'
  >
  multiaddressCtrl: UseControllerReturn<
    UseEditCoreChannelNodeFormState,
    'multiaddress'
  >
  pictureCtrl: UseControllerReturn<UseEditCoreChannelNodeFormState, 'picture'>
  bannerCtrl: UseControllerReturn<UseEditCoreChannelNodeFormState, 'banner'>
  rewardCtrl: UseControllerReturn<UseEditCoreChannelNodeFormState, 'reward'>
  managerCtrl: UseControllerReturn<UseEditCoreChannelNodeFormState, 'manager'>
  authorizedCtrl: UseControllerReturn<
    UseEditCoreChannelNodeFormState,
    'authorized'
  >
  lockedCtrl: UseControllerReturn<UseEditCoreChannelNodeFormState, 'locked'>
  registrationUrlCtrl: UseControllerReturn<
    UseEditCoreChannelNodeFormState,
    'registration_url'
  >
  errors: FieldErrors<UseEditCoreChannelNodeFormState>
  isDirty: boolean
  handleSubmit: (e: FormEvent) => Promise<void>
}

function calculateVirtualNode(node: CCN, updated: Partial<CCN>): CCN {
  const virtualNode: CCN = {
    ...(node || {}),
    ...updated,
    virtual: Date.now(),
  }

  return virtualNode
}

export function useEditCoreChannelNodeForm({
  defaultValues,
}: UseEditCoreChannelNodeFormProps): UseEditCoreChannelNodeFormReturn {
  const [state, dispatch] = useAppState()
  const {
    connection: { account },
    manager: { nodeManager },
    ccns: { entities: nodes },
  } = state

  const noti = useNotification()

  const onSubmit = useCallback(
    async (state: UseEditCoreChannelNodeFormState) => {
      if (!nodeManager) throw new Error('Manager not ready')
      if (!account) throw new Error('Invalid account')

      const [, partialCCN] = await nodeManager.updateCoreChannelNode(state)

      const node = nodes?.find((node) => node.hash === partialCCN.hash)
      const entity = calculateVirtualNode(node as CCN, partialCCN)

      return entity
    },
    [account, nodeManager, nodes],
  )

  const onSuccess = useCallback(
    async (entity: CCN) => {
      if (!noti) throw new Error('Notification not ready')

      noti.add({
        variant: 'success',
        title: 'Success',
        text: `Your node "${entity.hash}" was updated successfully.`,
      })

      dispatch(
        new EntityAddAction({
          name: 'ccns',
          entities: [entity],
        }),
      )
    },
    [dispatch, noti],
  )

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues,
    onSubmit,
    onSuccess,
    resolver: zodResolver(NodeManager.updateCCNSchema),
    readyDeps: [defaultValues],
  })
  // @note: dont use watch, use useWatch instead: https://github.com/react-hook-form/react-hook-form/issues/10753
  const values = useWatch({ control }) as UseEditCoreChannelNodeFormState

  const nameCtrl = useController({
    control,
    name: 'name',
  })

  const descriptionCtrl = useController({
    control,
    name: 'description',
  })

  const multiaddressCtrl = useController({
    control,
    name: 'multiaddress',
  })

  const pictureCtrl = useController({
    control,
    name: 'picture',
  })

  const bannerCtrl = useController({
    control,
    name: 'banner',
  })

  const rewardCtrl = useController({
    control,
    name: 'reward',
  })

  const managerCtrl = useController({
    control,
    name: 'manager',
  })

  const authorizedCtrl = useController({
    control,
    name: 'authorized',
  })

  const lockedCtrl = useController({
    control,
    name: 'locked',
  })

  const registrationUrlCtrl = useController({
    control,
    name: 'registration_url',
  })

  return {
    values,
    control,
    nameCtrl,
    descriptionCtrl,
    multiaddressCtrl,
    pictureCtrl,
    bannerCtrl,
    rewardCtrl,
    managerCtrl,
    authorizedCtrl,
    lockedCtrl,
    registrationUrlCtrl,
    errors,
    isDirty,
    handleSubmit,
  }
}
