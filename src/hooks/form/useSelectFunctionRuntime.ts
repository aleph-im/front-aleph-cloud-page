import { useCallback, useState } from 'react'

export enum FunctionRuntimeId {
  Debian11 = 'bd79839bf96e595a06da5ac0b6ba51dea6f7e2591bb913deccded04d831d29f4',
  Debian11Bin = 'bd79839bf96e595a06da5ac0b6ba51dea6f7e2591bb913deccded04d831d29f4',
  Debian12 = 'TODO1',
  Ubuntu22 = 'TODO2',
  Custom = 'custom',
}

export type FunctionRuntime = {
  id: string
  name: string
  dist: string
}

export const FunctionRuntimes: Record<FunctionRuntimeId, FunctionRuntime> = {
  [FunctionRuntimeId.Debian11]: {
    id: FunctionRuntimeId.Debian11,
    name: 'Debian 11 “Bullseye”',
    dist: 'debian',
  },
  [FunctionRuntimeId.Debian11Bin]: {
    id: FunctionRuntimeId.Debian11Bin,
    name: 'Debian 11 “Bullseye”',
    dist: 'debian',
  },
  [FunctionRuntimeId.Debian12]: {
    id: FunctionRuntimeId.Debian12,
    name: 'Debian 12 “Bookworm”',
    dist: 'debian',
  },
  [FunctionRuntimeId.Ubuntu22]: {
    id: FunctionRuntimeId.Ubuntu22,
    name: 'Ubuntu 22.04.1 LTS',
    dist: 'ubuntu',
  },
  [FunctionRuntimeId.Custom]: {
    id: FunctionRuntimeId.Custom,
    name: 'Custom',
    dist: 'ubuntu',
  },
}

export const defaultFunctionRuntimeOptions = [
  FunctionRuntimes[FunctionRuntimeId.Debian11],
  FunctionRuntimes[FunctionRuntimeId.Debian12],
  FunctionRuntimes[FunctionRuntimeId.Ubuntu22],
]

export type UseSelectFunctionRuntimeProps = {
  runtime?: FunctionRuntime
  options?: FunctionRuntime[]
  onChange: (runtime: FunctionRuntime) => void
}

export type UseSelectFunctionRuntimeReturn = {
  runtime?: FunctionRuntime
  options: FunctionRuntime[]
  handleChange: (runtime: FunctionRuntime) => void
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

  // @note: Test overflowding items
  // runtimes = [...runtimes, ...runtimes, ...runtimes, ...runtimes]

  const handleChange = useCallback(
    (runtime: FunctionRuntime) => {
      setFunctionRuntimeState(runtime)
      onChange(runtime)
    },
    [onChange],
  )

  return {
    runtime,
    options,
    handleChange,
  }
}
