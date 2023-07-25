import { ChangeEvent, useCallback, useState } from 'react'
import {
  FunctionRuntime,
  FunctionRuntimeId,
  FunctionRuntimes,
} from '@/domain/runtime'

export type FunctionRuntimeProp = FunctionRuntime

export const defaultFunctionRuntimeOptions = [
  FunctionRuntimes[FunctionRuntimeId.Runtime1],
  FunctionRuntimes[FunctionRuntimeId.Runtime2],
  FunctionRuntimes[FunctionRuntimeId.Custom],
]

export type UseSelectFunctionRuntimeProps = {
  value?: FunctionRuntimeProp
  options?: FunctionRuntimeProp[]
  onChange: (runtime: FunctionRuntimeProp) => void
}

export type UseSelectFunctionRuntimeReturn = {
  runtime?: FunctionRuntimeProp
  options: FunctionRuntimeProp[]
  handleRuntimeChange: (
    _: ChangeEvent<HTMLInputElement>,
    runtime?: unknown,
  ) => void
  handleCustomRuntimeHashChange: (e: ChangeEvent<HTMLInputElement>) => void
}

export function useSelectFunctionRuntime({
  value: runtimeProp,
  options: optionsProp,
  onChange,
}: UseSelectFunctionRuntimeProps): UseSelectFunctionRuntimeReturn {
  const [runtimeState, setFunctionRuntimeState] = useState<
    FunctionRuntimeProp | undefined
  >()
  const runtime = runtimeProp || runtimeState
  const options = optionsProp || defaultFunctionRuntimeOptions

  const handleRuntimeChange = useCallback(
    (_: ChangeEvent<HTMLInputElement>, runtimeId?: unknown) => {
      const runtime = options.find((opt) => opt.id === runtimeId)
      if (!runtime) return

      const updatedRuntime: FunctionRuntimeProp = { ...runtime }
      updatedRuntime.meta =
        runtime.id === FunctionRuntimeId.Custom
          ? updatedRuntime.meta
          : undefined

      setFunctionRuntimeState(runtime)
      onChange(runtime)
    },
    [onChange],
  )

  const handleCustomRuntimeHashChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (!runtime) return

      // @note: Custom hash string
      const meta = e.target.value
      const updatedRuntime: FunctionRuntimeProp = { ...runtime, meta }

      setFunctionRuntimeState(updatedRuntime)
      onChange(updatedRuntime)
    },
    [onChange, runtime],
  )

  return {
    runtime,
    options,
    handleRuntimeChange,
    handleCustomRuntimeHashChange,
  }
}
