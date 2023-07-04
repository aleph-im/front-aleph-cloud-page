import { FunctionRuntime } from '@/hooks/form/useSelectFunctionRuntime'

export type SelectFunctionRuntimeItemProps = {
  runtime: FunctionRuntime
  selected: boolean
  onChange: (runtime: FunctionRuntime) => void
}

export type SelectFunctionRuntimeProps = {
  runtime?: FunctionRuntime
  customRuntimeHash?: string
  options?: FunctionRuntime[]
  onChange: (runtime: FunctionRuntime) => void
}
