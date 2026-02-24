import { SSHKey } from '@/domain/ssh'
import { useRequestSSHKeys } from '@/hooks/common/useRequestEntity/useRequestSSHKeys'

export type UseSettingsDashboardPageReturn = {
  sshKeys: SSHKey[]
}

export function useSettingsDashboardPage(): UseSettingsDashboardPageReturn {
  const { entities: sshKeys = [] } = useRequestSSHKeys()

  return {
    sshKeys,
  }
}
