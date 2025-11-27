import { useCallback } from 'react'
import { useController } from 'react-hook-form'
import { useForm } from '@/hooks/common/useForm'
import {
  AccountPermissions,
  MessageTypePermissions,
} from '@/domain/permissions'

export type PermissionsDetailFormState = {
  channels: string[]
  messageTypes: MessageTypePermissions[]
}

export type UsePermissionsDetailFormProps = {
  permissions: AccountPermissions
}

export type UsePermissionsDetailFormReturn = {
  control: ReturnType<typeof useForm>['control']
  handleSubmit: ReturnType<typeof useForm>['handleSubmit']
  errors: ReturnType<typeof useForm>['formState']['errors']
  isDirty: boolean
  channelsCtrl: ReturnType<typeof useController>
  messageTypesCtrl: ReturnType<typeof useController>
}

export function usePermissionsDetailForm({
  permissions,
}: UsePermissionsDetailFormProps): UsePermissionsDetailFormReturn {
  const defaultValues: PermissionsDetailFormState = {
    channels: permissions.channels,
    messageTypes: permissions.messageTypes,
  }

  const onSubmit = useCallback(
    async (state: PermissionsDetailFormState) => {
      console.log('Updated permissions:', {
        id: permissions.id,
        alias: permissions.alias,
        ...state,
      })
    },
    [permissions.id, permissions.alias],
  )

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues,
    onSubmit,
  })

  const channelsCtrl = useController({
    control,
    name: 'channels',
  })

  const messageTypesCtrl = useController({
    control,
    name: 'messageTypes',
  })

  return {
    control,
    handleSubmit,
    errors,
    isDirty,
    channelsCtrl,
    messageTypesCtrl,
  }
}
