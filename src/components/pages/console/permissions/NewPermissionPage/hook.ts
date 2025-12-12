import { FormEvent, useCallback, useMemo } from 'react'
import { useRouter } from 'next/router'
import { useForm } from '@/hooks/common/useForm'
import { Control, FieldErrors, useController, useWatch } from 'react-hook-form'
import { useCheckoutNotification } from '@/hooks/form/useCheckoutNotification'
import { useConnection } from '@/hooks/common/useConnection'
import Err from '@/helpers/errors'
import { TooltipProps } from '@aleph-front/core'
import { accountConnectionRequiredDisabledMessage } from './disabledMessages'
import { usePermissionsManager } from '@/hooks/common/useManager/usePermissionManager'
import { MessageTypePermissions } from '@/domain/permissions'
import { MessageType } from '@aleph-sdk/message'

export type NewPermissionFormState = {
  address: string
  alias: string
  permissions: {
    channels: string[]
    messageTypes: MessageTypePermissions[]
  }
}

export type Modal = 'node-list' | 'terms-and-conditions'

export type UseNewPermissionPageReturn = {
  createPermissionDisabled: boolean
  createPermissionDisabledMessage?: TooltipProps['content']
  createPermissionButtonTitle?: string
  values: any
  control: Control<any>
  errors: FieldErrors<NewPermissionFormState>
  handleSubmit: (e: FormEvent) => Promise<void>
  handleBack: () => void
  addressCtrl: any
  aliasCtrl: any
}

export function useNewPermissionPage(): UseNewPermissionPageReturn {
  const { account } = useConnection({
    triggerOnMount: false,
  })

  const router = useRouter()

  // -------------------------
  // Checkout flow

  const manager = usePermissionsManager()
  useCheckoutNotification({})

  const onSubmit = useCallback(
    async (state: NewPermissionFormState) => {
      if (!manager) throw Err.ConnectYourWallet
      if (!account) throw Err.InvalidAccount

      await manager.addNewAccountPermission({
        id: state.address,
        alias: state.alias,
        channels: state.permissions.channels,
        messageTypes: state.permissions.messageTypes,
      })

      router.push('.')
    },
    [manager, account, router],
  )

  // -------------------------
  // Setup form

  const defaultValues: Partial<NewPermissionFormState> = useMemo(
    () => ({
      address: '',
      alias: '',
      permissions: {
        channels: [],
        messageTypes: [
          { type: MessageType.post, postTypes: [], authorized: false },
          {
            type: MessageType.aggregate,
            aggregateKeys: [],
            authorized: false,
          },
          { type: MessageType.instance, authorized: false },
          { type: MessageType.program, authorized: false },
          { type: MessageType.store, authorized: false },
        ],
      },
    }),
    [],
  )

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    onSubmit,
    readyDeps: [],
  })

  const formValues = useWatch({ control }) as NewPermissionFormState

  const addressCtrl = useController({
    control,
    name: 'address',
  })

  const aliasCtrl = useController({
    control,
    name: 'alias',
  })

  // -------------------------
  // Memos
  const createPermissionDisabledMessage: UseNewPermissionPageReturn['createPermissionDisabledMessage'] =
    useMemo(() => {
      if (!account)
        return accountConnectionRequiredDisabledMessage(
          'create a new permission',
        )
    }, [account])

  const createPermissionButtonTitle: UseNewPermissionPageReturn['createPermissionButtonTitle'] =
    useMemo(() => {
      if (!account) return 'Connect'

      return 'Save permissions'
    }, [account])

  const createPermissionDisabled = useMemo(() => {
    if (createPermissionButtonTitle !== 'Save permissions') return true

    return !!createPermissionDisabledMessage
  }, [createPermissionButtonTitle, createPermissionDisabledMessage])

  // -------------------------
  // Handlers

  const handleBack = () => {
    router.push('.')
  }

  return {
    createPermissionDisabled,
    createPermissionDisabledMessage,
    createPermissionButtonTitle,
    values: formValues,
    control,
    errors,
    handleSubmit,
    handleBack,
    addressCtrl,
    aliasCtrl,
  }
}
