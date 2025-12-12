import { useCallback, useEffect } from 'react'
import { useWatch } from 'react-hook-form'
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
  onUpdate?: (updatedPermission: AccountPermissions) => void
}

export function usePermissionsDetailForm({
  permissions,
  onSubmitSuccess,
  onUpdate,
}: UsePermissionsDetailFormProps) {
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
    onSuccess: () => Promise.resolve(),
  })

  // Watch form values for real-time updates
  const watchedValues = useWatch({ control })

  useEffect(() => {
    if (onUpdate) {
      const updatedPermission: AccountPermissions = {
        id: permissions.id,
        alias: permissions.alias,
        channels: watchedValues.channels ?? permissions.channels,
        messageTypes:
          (watchedValues.messageTypes as MessageTypePermissions[]) ??
          permissions.messageTypes,
      }
      onUpdate(updatedPermission)
    }
  }, [
    watchedValues,
    permissions.id,
    permissions.alias,
    permissions.channels,
    permissions.messageTypes,
    onUpdate,
  ])

  return {
    control,
    handleSubmit,
    errors,
    isDirty,
  }
}
