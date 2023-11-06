import { FunctionRuntime } from '@/domain/runtime'
import { Control } from 'react-hook-form'

export type SelectCustomFunctionRuntimeProps = {
  name?: string
  control: Control
  options?: FunctionRuntime[]
}
