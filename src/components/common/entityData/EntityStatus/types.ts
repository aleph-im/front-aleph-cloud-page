import { Executable, ExecutableCalculatedStatus } from '@/domain/executable'
import { DefaultTheme } from 'styled-components'

export type EntityStatusPropsV1 = {
  entity: Executable
  isAllocated: boolean
  theme: DefaultTheme
}

export type EntityStatusPropsV2 = {
  calculatedStatus: ExecutableCalculatedStatus
  cannotStart?: boolean
  theme: DefaultTheme
}

export type EntityStatusProps = {
  calculatedStatus: ExecutableCalculatedStatus
  cannotStart?: boolean
  entity?: Executable
  isAllocated: boolean
  theme: DefaultTheme
}
