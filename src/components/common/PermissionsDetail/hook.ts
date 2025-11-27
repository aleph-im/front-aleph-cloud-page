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
  onSubmitSuccess?: (updatedPermission: AccountPermissions) => void
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
  onSubmitSuccess,
}: UsePermissionsDetailFormProps): UsePermissionsDetailFormReturn {
  const defaultValues: PermissionsDetailFormState = {
    channels: permissions.channels,
    messageTypes: permissions.messageTypes,
  }

  const onSubmit = useCallback(
    async (state: PermissionsDetailFormState) => {
      const updatedPermission: AccountPermissions = {
        id: permissions.id,
        alias: permissions.alias,
        ...state,
      }
      console.log('Updated permissions:', updatedPermission)
      onSubmitSuccess?.(updatedPermission)
      // Return void to avoid triggering success notification
      return
    },
    [permissions.id, permissions.alias, onSubmitSuccess],
  )

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues,
    onSubmit,
    // Don't pass onSuccess to avoid showing notification on form submit
    // The notification will be shown later when saving all changes
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
