import { useCallback, useState } from 'react'

export enum RuntimeId {
  Debian11 = 'bd79839bf96e595a06da5ac0b6ba51dea6f7e2591bb913deccded04d831d29f4',
  Debian11Bin = 'bd79839bf96e595a06da5ac0b6ba51dea6f7e2591bb913deccded04d831d29f4',
  Debian12 = 'TODO1',
  Ubuntu22 = 'TODO2',
  Custom = 'custom',
}

export type Runtime = {
  id: string
  name: string
  dist: string
}

export const Runtimes: Record<RuntimeId, Runtime> = {
  [RuntimeId.Debian11]: {
    id: RuntimeId.Debian11,
    name: 'Debian 11 “Bullseye”',
    dist: 'debian',
  },
  [RuntimeId.Debian11Bin]: {
    id: RuntimeId.Debian11Bin,
    name: 'Debian 11 “Bullseye”',
    dist: 'debian',
  },
  [RuntimeId.Debian12]: {
    id: RuntimeId.Debian12,
    name: 'Debian 12 “Bookworm”',
    dist: 'debian',
  },
  [RuntimeId.Ubuntu22]: {
    id: RuntimeId.Ubuntu22,
    name: 'Ubuntu 22.04.1 LTS',
    dist: 'ubuntu',
  },
  [RuntimeId.Custom]: {
    id: RuntimeId.Custom,
    name: 'Custom',
    dist: 'ubuntu',
  },
}

export const defaultRuntimeOptions = [
  Runtimes[RuntimeId.Debian11],
  Runtimes[RuntimeId.Debian12],
  Runtimes[RuntimeId.Ubuntu22],
]

export type UseRuntimeSelectorProps = {
  runtime?: Runtime
  options?: Runtime[]
  onChange: (runtime: Runtime) => void
}

export type UseRuntimeSelectorReturn = {
  runtime?: Runtime
  options: Runtime[]
  handleChange: (runtime: Runtime) => void
}

export function useRuntimeSelector({
  runtime: runtimeProp,
  options: optionsProp,
  onChange,
}: UseRuntimeSelectorProps): UseRuntimeSelectorReturn {
  const [runtimeState, setRuntimeState] = useState<Runtime | undefined>()

  const runtime = runtimeProp || runtimeState
  const options = optionsProp || defaultRuntimeOptions

  // @note: Test overflowding items
  // runtimes = [...runtimes, ...runtimes, ...runtimes, ...runtimes]

  const handleChange = useCallback(
    (runtime: Runtime) => {
      setRuntimeState(runtime)
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
