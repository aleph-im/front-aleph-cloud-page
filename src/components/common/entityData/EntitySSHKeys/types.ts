import { SSHKey } from '@/domain/ssh'

export type EntitySSHKeysProps = {
  sshKeys: (SSHKey | undefined)[]
  onSSHKeyClick: (sshKey: SSHKey) => void
}
