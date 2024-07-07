import { Domain } from '@/domain/domain'
import { useDomainManager } from '../useManager/useDomainManager'

import {
  UseRequestEntitiesProps,
  UseRequestEntitiesReturn,
  useRequestEntities,
} from './useRequestEntities'

export type UseRequestDomainsProps = Omit<
  UseRequestEntitiesProps<Domain>,
  'name'
>

export type UseRequestDomainsReturn = UseRequestEntitiesReturn<Domain>

export function useRequestDomains(
  props: UseRequestDomainsProps = {},
): UseRequestDomainsReturn {
  const manager = useDomainManager()
  return useRequestEntities({ ...props, manager, name: 'domain' })
}
