import { Confidential } from '@/domain/confidential'
import {
  UseRequestEntitiesProps,
  UseRequestEntitiesReturn,
  useRequestEntities,
} from './useRequestEntities'
import { useConfidentialManager } from '../useManager/useConfidentialManager'

export type UseRequestConfidentialsProps = Omit<
  UseRequestEntitiesProps<Confidential>,
  'name'
>

export type UseRequestConfidentialsReturn =
  UseRequestEntitiesReturn<Confidential>

export function useRequestConfidentials(
  props: UseRequestConfidentialsProps = {},
): UseRequestConfidentialsReturn {
  const manager = useConfidentialManager()
  return useRequestEntities({ ...props, manager, name: 'confidential' })
}
