import { FunctionRuntimeProp } from '@/hooks/form/useSelectFunctionRuntime'

export type SelectFunctionRuntimeItemProps = {
  runtime: FunctionRuntimeProp
}

export type SelectFunctionRuntimeProps = {
  value?: FunctionRuntimeProp
  options?: FunctionRuntimeProp[]
  onChange: (runtime: FunctionRuntimeProp) => void
}
