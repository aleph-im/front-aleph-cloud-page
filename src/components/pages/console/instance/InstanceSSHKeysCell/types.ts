import { SSHKey } from '@/domain/ssh'

export type InstanceSSHKeysCellProps = {
  sshKeys: (SSHKey | undefined)[]
  onSSHKeyClick: (sshKey: SSHKey) => void
}
