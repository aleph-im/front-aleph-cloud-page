import { CustomFunctionRuntimeField, FunctionRuntime } from '@/domain/runtime'
import { Control, UseControllerReturn, useController } from 'react-hook-form'

export type UseSelectCustomFunctionRuntimeProps = {
  name?: string
  control: Control
  defaultValue?: CustomFunctionRuntimeField
  options?: FunctionRuntime[]
}

export type UseSelectCustomFunctionRuntimeReturn = {
  runtimeCtrl: UseControllerReturn<any, any>
}

export function useSelectCustomFunctionRuntime({
  name = 'runtime',
  control,
  defaultValue,
}: UseSelectCustomFunctionRuntimeProps): UseSelectCustomFunctionRuntimeReturn {
  const runtimeCtrl = useController({
    control,
    name,
    defaultValue,
    shouldUnregister: true,
  })

  return {
    runtimeCtrl,
  }
}
