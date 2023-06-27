import { SSHKeyItem } from '@/hooks/form/useAddSSHKeys'

export type SSHKeyItemProps = {
  sshKey: SSHKeyItem
  onChange: (sshKey: SSHKeyItem) => void
  onRemove: (sshKeyId: string) => void
  index: number
  allowRemove: boolean
}

export type AddSSHKeyProps = {
  sshKeys?: SSHKeyItem[]
  onChange: (sshKeys: SSHKeyItem[]) => void
}
