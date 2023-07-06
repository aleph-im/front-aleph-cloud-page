import { FunctionRuntimeProp } from '@/hooks/form/useSelectFunctionRuntime'

export type SelectFunctionRuntimeItemProps = {
  runtime: FunctionRuntimeProp
  selected: boolean
  onChange: (runtime: FunctionRuntimeProp) => void
}

export type SelectFunctionRuntimeProps = {
  runtime?: FunctionRuntimeProp
  customRuntimeHash?: string
  options?: FunctionRuntimeProp[]
  onChange: (runtime: FunctionRuntimeProp) => void
}
