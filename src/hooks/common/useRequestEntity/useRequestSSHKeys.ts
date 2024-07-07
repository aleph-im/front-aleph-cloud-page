import { SSHKey } from '@/domain/ssh'
import { useSSHKeyManager } from '../useManager/useSSHKeyManager'

import {
  UseRequestEntitiesProps,
  UseRequestEntitiesReturn,
  useRequestEntities,
} from './useRequestEntities'

export type UseRequestSSHKeysProps = Omit<
  UseRequestEntitiesProps<SSHKey>,
  'name'
>

export type UseRequestSSHKeysReturn = UseRequestEntitiesReturn<SSHKey>

export function useRequestSSHKeys(
  props: UseRequestSSHKeysProps = {},
): UseRequestSSHKeysReturn {
  const manager = useSSHKeyManager()
  return useRequestEntities({ ...props, manager, name: 'ssh' })
}
