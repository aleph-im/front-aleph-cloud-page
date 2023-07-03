import { ChangeEvent, useCallback, useState } from 'react'

export enum FunctionRuntimeId {
  Runtime1 = 'bd79839bf96e595a06da5ac0b6ba51dea6f7e2591bb913deccded04d831d29f4',
  // @note: Added trailing blank spaces for generating different unique ids (it will be safely .trim() before sending the request) until the right hashes are provided
  Runtime2 = 'bd79839bf96e595a06da5ac0b6ba51dea6f7e2591bb913deccded04d831d29f4 ',
  Custom = 'custom',
}

export type FunctionRuntime = {
  id: string
  name: string
  dist: string
  meta?: string
}

export const FunctionRuntimes: Record<FunctionRuntimeId, FunctionRuntime> = {
  [FunctionRuntimeId.Runtime1]: {
    id: FunctionRuntimeId.Runtime1,
    name: 'Official runtime with Debian 11, Python 3.9 & Node.js 14',
    dist: 'debian',
  },
  [FunctionRuntimeId.Runtime2]: {
    id: FunctionRuntimeId.Runtime2,
    name: 'Official min. runtime for binaries x86_64 (Rust, Go, ...)',
    dist: 'debian',
  },
  [FunctionRuntimeId.Custom]: {
    id: FunctionRuntimeId.Custom,
    name: 'Custom runtime',
    dist: 'ubuntu',
  },
}

export const defaultFunctionRuntimeOptions = [
  FunctionRuntimes[FunctionRuntimeId.Runtime1],
  FunctionRuntimes[FunctionRuntimeId.Runtime2],
  FunctionRuntimes[FunctionRuntimeId.Custom],
]

export type UseSelectFunctionRuntimeProps = {
  runtime?: FunctionRuntime
  options?: FunctionRuntime[]
  onChange: (runtime: FunctionRuntime) => void
}

export type UseSelectFunctionRuntimeReturn = {
  runtime?: FunctionRuntime
  options: FunctionRuntime[]
  handleRuntimeChange: (runtime: FunctionRuntime) => void
  handleCustomRuntimeHashChange: (e: ChangeEvent<HTMLInputElement>) => void
}

export function useSelectFunctionRuntime({
  runtime: runtimeProp,
  options: optionsProp,
  onChange,
}: UseSelectFunctionRuntimeProps): UseSelectFunctionRuntimeReturn {
  const [runtimeState, setFunctionRuntimeState] = useState<
    FunctionRuntime | undefined
  >()
  const runtime = runtimeProp || runtimeState
  const options = optionsProp || defaultFunctionRuntimeOptions

  const handleRuntimeChange = useCallback(
    (runtime: FunctionRuntime) => {
      const updatedRuntime: FunctionRuntime = { ...runtime }
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
      const updatedRuntime: FunctionRuntime = { ...runtime, meta }

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
