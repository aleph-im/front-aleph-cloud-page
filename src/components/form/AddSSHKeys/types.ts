import { SSHKeyProp } from '@/hooks/form/useAddSSHKeys'

export type SSHKeyItemProps = {
  sshKey: SSHKeyProp
  onChange: (sshKey: SSHKeyProp) => void
  onRemove: (sshKeyId: string) => void
  index: number
  allowRemove: boolean
}

export type AddSSHKeysProps = {
  sshKeys?: SSHKeyProp[]
  onChange: (sshKeys: SSHKeyProp[]) => void
}