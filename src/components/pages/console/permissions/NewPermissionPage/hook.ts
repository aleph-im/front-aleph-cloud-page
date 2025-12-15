import { FormEvent, useCallback, useMemo } from 'react'
import { useRouter } from 'next/router'
import { useForm } from '@/hooks/common/useForm'
import { Control, FieldErrors, useController, useWatch } from 'react-hook-form'
import {
  stepsCatalog,
  useCheckoutNotification,
} from '@/hooks/form/useCheckoutNotification'
import { useConnection } from '@/hooks/common/useConnection'
import Err from '@/helpers/errors'
import { TooltipProps } from '@aleph-front/core'
import { accountConnectionRequiredDisabledMessage } from './disabledMessages'
import { usePermissionsManager } from '@/hooks/common/useManager/usePermissionManager'
import {
  AccountPermissions,
  MessageTypePermissions,
  PermissionsManager,
} from '@/domain/permissions'
import { MessageType } from '@aleph-sdk/message'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRequestPermissions } from '@/hooks/common/useRequestEntity/useRequestPermissions'

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
  // Handlers

  const handleBack = useCallback(() => {
    router.push('.')
  }, [router])

  // -------------------------
  // Checkout flow

  const manager = usePermissionsManager()
  const { refetch: refetchPermissions } = useRequestPermissions({
    triggerOnMount: false,
  })
  const { noti, next, stop } = useCheckoutNotification({})

  const onSubmit = useCallback(
    async (state: NewPermissionFormState) => {
      if (!manager) throw Err.ConnectYourWallet
      if (!account) throw Err.InvalidAccount

      const permission: AccountPermissions = {
        id: state.address,
        alias: state.alias,
        channels: state.permissions.channels,
        messageTypes: state.permissions.messageTypes,
        revoked: false,
      }

      const iSteps = await manager.getAddSteps()
      const nSteps = iSteps.map((i) => stepsCatalog[i])

      const steps = manager.addNewAccountPermissionSteps(permission)

      try {
        let result

        while (!result) {
          const { value, done } = await steps.next()

          if (done) {
            result = value
            break
          }

          await next(nSteps)
        }
      } finally {
        await stop()
      }
    },
    [manager, account, next, stop],
  )

  const handleSubmissionSuccess = useCallback(async () => {
    noti?.add({
      variant: 'info',
      title: 'Permission created',
      text: 'Redirecting to permissions page...',
    })

    // Wait 2 second to refetch latest data from backend before navigating back
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Refresh permissions data from backend
    await refetchPermissions()

    // Navigate to permissions page
    handleBack()
  }, [handleBack, noti, refetchPermissions])

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
    onSuccess: handleSubmissionSuccess,
    resolver: zodResolver(PermissionsManager.addSchema),
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
