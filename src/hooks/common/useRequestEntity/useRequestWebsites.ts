import { Website } from '@/domain/website'
import { useWebsiteManager } from '../useManager/useWebsiteManager'

import {
  UseRequestEntitiesProps,
  UseRequestEntitiesReturn,
  useRequestEntities,
} from './useRequestEntities'

export type UseRequestWebsitesProps = Omit<
  UseRequestEntitiesProps<Website>,
  'name'
>

export type UseRequestWebsitesReturn = UseRequestEntitiesReturn<Website>

export function useRequestWebsites(
  props: UseRequestWebsitesProps = {},
): UseRequestWebsitesReturn {
  const manager = useWebsiteManager()
  return useRequestEntities({ ...props, manager, name: 'website' })
}
