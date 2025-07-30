import { Executable, ExecutableCalculatedStatus } from '@/domain/executable'
import { DefaultTheme } from 'styled-components'

export type EntityStatusPropsV1 = {
  entity: Executable
  isAllocated: boolean
  theme: DefaultTheme
}

export type EntityStatusPropsV2 = {
  calculatedStatus: ExecutableCalculatedStatus
  theme: DefaultTheme
}

export type EntityStatusProps = {
  calculatedStatus: ExecutableCalculatedStatus
  entity?: Executable
  isAllocated: boolean
  theme: DefaultTheme
}
