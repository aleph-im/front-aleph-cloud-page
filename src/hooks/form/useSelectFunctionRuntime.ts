import {
  FunctionRuntime,
  FunctionRuntimeId,
  FunctionRuntimes,
} from '@/domain/runtime'
import { Control, UseControllerReturn, useController } from 'react-hook-form'

export type FunctionRuntimeField = {
  id: string
  custom: string
}

export const defaultFunctionRuntime: FunctionRuntimeField = {
  id: FunctionRuntimeId.Runtime1,
  custom: '',
}

export const defaultFunctionRuntimeOptions = [
  FunctionRuntimes[FunctionRuntimeId.Runtime1],
  FunctionRuntimes[FunctionRuntimeId.Runtime2],
  FunctionRuntimes[FunctionRuntimeId.Custom],
]

export type UseSelectFunctionRuntimeProps = {
  name?: string
  control: Control
  defaultValue?: FunctionRuntimeField
  options?: FunctionRuntime[]
}

export type UseSelectFunctionRuntimeReturn = {
  idCtrl: UseControllerReturn<any, any>
  customCtrl: UseControllerReturn<any, any>
  options: FunctionRuntime[]
  isCustomDisabled: boolean
}

export function useSelectFunctionRuntime({
  name = 'runtime',
  control,
  defaultValue,
  options: optionsProp,
}: UseSelectFunctionRuntimeProps): UseSelectFunctionRuntimeReturn {
  const options = optionsProp || defaultFunctionRuntimeOptions

  const idCtrl = useController({
    control,
    name: `${name}.id`,
    defaultValue: defaultValue?.id,
    rules: {
      onChange(e) {
        if (e.target.value === FunctionRuntimeId.Custom) return
        customCtrl.field.onChange('')
      },
    },
  })

  const isCustomDisabled = idCtrl.field.value !== FunctionRuntimeId.Custom

  const customCtrl = useController({
    control,
    name: `${name}.custom`,
    defaultValue: defaultValue?.custom,
  })

  return {
    idCtrl,
    customCtrl,
    options,
    isCustomDisabled,
  }
}
