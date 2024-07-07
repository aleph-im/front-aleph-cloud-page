import { Program } from '@/domain/program'
import { useProgramManager } from '../useManager/useProgramManager'

import {
  UseRequestEntitiesProps,
  UseRequestEntitiesReturn,
  useRequestEntities,
} from './useRequestEntities'

export type UseRequestProgramsProps = Omit<
  UseRequestEntitiesProps<Program>,
  'name'
>

export type UseRequestProgramsReturn = UseRequestEntitiesReturn<Program>

export function useRequestPrograms(
  props: UseRequestProgramsProps = {},
): UseRequestProgramsReturn {
  const manager = useProgramManager()
  return useRequestEntities({ ...props, manager, name: 'program' })
}
