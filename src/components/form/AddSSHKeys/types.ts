import { SSHKeyField } from '@/hooks/form/useAddSSHKeys'
import { Control } from 'react-hook-form'

export type SSHKeyItemProps = {
  name?: string
  index: number
  control: Control
  allowRemove: boolean
  defaultValue: SSHKeyField
  onRemove: (index?: number) => void
}

export type AddSSHKeysProps = {
  name: string
  control: Control
}
