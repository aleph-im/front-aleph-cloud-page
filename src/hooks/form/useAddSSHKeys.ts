import { ChangeEvent, useCallback, useId, useMemo, useState } from 'react'
import { useAccountSSHKeys } from '../useAccountSSHKeys'

export type SSHKeyItem = {
  id: string
  key: string
  label: string
  isSelected?: boolean
  isNew?: boolean
}

export const defaultSSHKey: SSHKeyItem = {
  id: `sshkey-0`,
  key: '',
  label: '',
  isSelected: true,
  isNew: true,
}

export type UseSSHKeyItemProps = {
  sshKey: SSHKeyItem
  onChange: (sshKeys: SSHKeyItem) => void
  onRemove: (sshKeyId: string) => void
}

export type UseSSHKeyItemReturn = {
  id: string
  sshKey: SSHKeyItem
  handleIsSelectedChange: (e: ChangeEvent<HTMLInputElement>) => void
  handleKeyChange: (e: ChangeEvent<HTMLInputElement>) => void
  handleLabelChange: (e: ChangeEvent<HTMLInputElement>) => void
  handleRemove: () => void
}

export function useSSHKeyItem({
  sshKey,
  onChange,
  onRemove,
}: UseSSHKeyItemProps): UseSSHKeyItemReturn {
  const id = useId()

  const handleIsSelectedChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const isSelected = e.target.checked
      const newSSHKey: SSHKeyItem = { ...sshKey, isSelected }
      onChange(newSSHKey)
    },
    [onChange, sshKey],
  )

  const handleKeyChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const key = e.target.value
      const newSSHKey: SSHKeyItem = { ...sshKey, key }
      onChange(newSSHKey)
    },
    [onChange, sshKey],
  )

  const handleLabelChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const label = e.target.value
      const newSSHKey: SSHKeyItem = { ...sshKey, label }
      onChange(newSSHKey)
    },
    [onChange, sshKey],
  )

  const handleRemove = useCallback(() => {
    onRemove(sshKey.id)
  }, [sshKey.id, onRemove])

  return {
    id,
    sshKey,
    handleIsSelectedChange,
    handleKeyChange,
    handleLabelChange,
    handleRemove,
  }
}

// --------------------

export type UseSSHKeysProps = {
  sshKeys?: SSHKeyItem[]
  onChange: (sshKeys: SSHKeyItem[]) => void
}

export type UseSSHKeysReturn = {
  sshKeys: SSHKeyItem[]
  handleChange: (sshKeys: SSHKeyItem) => void
  handleAdd: () => void
  handleRemove: (sshKeyId: string) => void
  allowRemove: boolean
}

export function useAddSSHKeys({
  sshKeys: sshKeysProp,
  onChange,
}: UseSSHKeysProps): UseSSHKeysReturn {
  const [sshKeysState, setSSHKeysState] = useState<SSHKeyItem[]>([])
  const newSSHKeys = sshKeysProp || sshKeysState

  const [accountSSHKeys] = useAccountSSHKeys()
  const accountSSHKeyItems: SSHKeyItem[] = useMemo(
    () =>
      (accountSSHKeys || []).map(({ id, key, label = '' }) => ({
        id,
        key,
        label,
        isSelected: false,
        isNew: false,
      })),
    [accountSSHKeys],
  )

  const sshKeys: SSHKeyItem[] = useMemo(() => {
    const newKeysMap = new Map(newSSHKeys.map((key) => [key.id, key]))
    const accountKeysMap = new Map(
      accountSSHKeyItems.map((key) => [key.id, key]),
    )

    return [
      ...accountSSHKeyItems.map((key) => newKeysMap.get(key.id) || key),
      ...newSSHKeys.filter((key) => !accountKeysMap.has(key.id)),
    ]
  }, [accountSSHKeyItems, newSSHKeys])

  const allowRemove = useMemo(() => sshKeys.some((key) => key.isNew), [sshKeys])

  const handleChange = useCallback(
    (sshKey: SSHKeyItem) => {
      let updatedSSHKeys = [...newSSHKeys]
      const index = updatedSSHKeys.findIndex((key) => key.id === sshKey.id)

      if (index !== -1) {
        updatedSSHKeys[index] = sshKey
      } else {
        updatedSSHKeys.push(sshKey)
      }

      // @note: Filter not selected account keys
      updatedSSHKeys = updatedSSHKeys.filter(
        (key) => key.isNew || key.isSelected,
      )

      setSSHKeysState(updatedSSHKeys)
      onChange(updatedSSHKeys)
    },
    [newSSHKeys, onChange],
  )

  const handleAdd = useCallback(() => {
    const newSSHKey = {
      ...defaultSSHKey,
      id: `sshkey-${Date.now()}`,
    }

    const updatedSSHKeys = [...newSSHKeys, newSSHKey]

    setSSHKeysState(updatedSSHKeys)
    onChange(updatedSSHKeys)
  }, [newSSHKeys, onChange])

  const handleRemove = useCallback(
    (sshKeyId: string) => {
      const updatedSSHKeys = newSSHKeys.filter((key) => key.id !== sshKeyId)

      setSSHKeysState(updatedSSHKeys)
      onChange(updatedSSHKeys)
    },
    [newSSHKeys, onChange],
  )

  return {
    sshKeys,
    handleChange,
    handleAdd,
    handleRemove,
    allowRemove,
  }
}
