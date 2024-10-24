import { useCallback, useEffect, useMemo } from 'react'
import {
  Control,
  UseControllerReturn,
  useController,
  useFieldArray,
} from 'react-hook-form'
import { useRequestSSHKeys } from '../common/useRequestEntity/useRequestSSHKeys'

export type SSHKeyField = {
  key: string
  label?: string
  isSelected: boolean
  isNew: boolean
}

export const defaultValues: SSHKeyField = {
  key: '',
  isSelected: true,
  isNew: true,
}

export function useAccountSSHKeyItems(): SSHKeyField[] {
  const { entities: accountSSHKeys } = useRequestSSHKeys()

  return useMemo(
    () =>
      (accountSSHKeys || []).map(({ key, label = '' }, i) => ({
        key,
        label,
        isSelected: i === 0,
        isNew: false,
      })),
    [accountSSHKeys],
  )
}

export type UseSSHKeyItemProps = {
  name?: string
  index: number
  control: Control
  allowRemove: boolean
  defaultValue?: SSHKeyField
  onRemove: (index?: number) => void
}

export type UseSSHKeyItemReturn = {
  isSelectedCtrl: UseControllerReturn<any, any>
  keyCtrl: UseControllerReturn<any, any>
  labelCtrl: UseControllerReturn<any, any>
  index: number
  allowRemove: boolean
  isNew: boolean
  handleRemove: () => void
}

export function useSSHKeyItem({
  name = 'sshKeys',
  index,
  control,
  allowRemove,
  defaultValue,
  onRemove,
}: UseSSHKeyItemProps): UseSSHKeyItemReturn {
  const isSelectedCtrl = useController({
    control,
    name: `${name}.${index}.isSelected`,
    defaultValue: defaultValue?.isSelected,
  })

  const keyCtrl = useController({
    control,
    name: `${name}.${index}.key`,
    defaultValue: defaultValue?.key,
  })

  const labelCtrl = useController({
    control,
    name: `${name}.${index}.label`,
    defaultValue: defaultValue?.label,
  })

  const isNewCtrl = useController({
    control,
    name: `${name}.${index}.isNew`,
    defaultValue: defaultValue?.isNew || false,
  })

  const isNew = isNewCtrl.field.value

  const handleRemove = useCallback(() => {
    if (!isNew) return
    onRemove(index)
  }, [index, isNew, onRemove])

  return {
    index,
    isSelectedCtrl,
    keyCtrl,
    labelCtrl,
    allowRemove,
    isNew,
    handleRemove,
  }
}

// --------------------

export type UseSSHKeysProps = {
  name?: string
  control: Control
}

export type UseSSHKeysReturn = {
  name: string
  control: Control
  fields: (SSHKeyField & { id: string })[]
  handleAdd: () => void
  handleRemove: (index?: number) => void
  allowRemove: boolean
}

export function useAddSSHKeys({
  name = 'sshKeys',
  control,
}: UseSSHKeysProps): UseSSHKeysReturn {
  const sshKeysCtrl = useFieldArray({
    control,
    name,
  })

  const { remove: handleRemove, append, replace, prepend } = sshKeysCtrl
  const fields = sshKeysCtrl.fields as (SSHKeyField & { id: string })[]
  const accountSSHKeyItems = useAccountSSHKeyItems()

  // Empty when the account changes
  useEffect(() => handleRemove(), [handleRemove, accountSSHKeyItems])

  useEffect(() => {
    let newValues = accountSSHKeyItems

    if (newValues.length === 0) return

    if (fields.length === 0) {
      replace(newValues)
      return
    }

    const set = new Set(fields.map((field) => field.key))
    newValues = accountSSHKeyItems.filter((field) => !set.has(field.key))

    if (newValues.length === 0) return
    prepend(newValues)
  }, [accountSSHKeyItems, fields, replace, prepend])

  const allowRemove = useMemo(
    () => fields.some((field) => field.isNew),
    [fields],
  )

  const handleAdd = useCallback(() => {
    append({ ...defaultValues })
  }, [append])

  return {
    name,
    control,
    fields,
    handleAdd,
    handleRemove,
    allowRemove,
  }
}
