import { FunctionRuntime } from '@/domain/runtime'
import { Control } from 'react-hook-form'

export type SelectFunctionRuntimeProps = {
  name?: string
  control: Control
  options?: FunctionRuntime[]
}
