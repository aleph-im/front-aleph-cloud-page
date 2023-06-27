import { useCallback, useState } from 'react'

export type InstanceSpecs = {
  id: string
  cpu: number
  ram: number
  storage?: number
}

export const defaultSpecsOptions: InstanceSpecs[] = [1, 2, 4, 6, 8, 12].map(
  (cpu) => ({
    id: `specs-${cpu}`,
    cpu,
    ram: 2 * cpu * 1000,
    // storage: 2 * 10 ** Number(isPersistent) * computeUnits,
  }),
)

export type UseSelectInstanceSpecsProps = {
  specs?: InstanceSpecs
  options?: InstanceSpecs[]
  onChange: (specs: InstanceSpecs) => void
}

export type UseSelectInstanceSpecsReturn = {
  specs?: InstanceSpecs
  options: InstanceSpecs[]
  handleChange: (specs: InstanceSpecs) => void
}

export function useSelectInstanceSpecs({
  specs: specsProp,
  options: optionsProp,
  onChange,
}: UseSelectInstanceSpecsProps): UseSelectInstanceSpecsReturn {
  const [specsState, setSpecsState] = useState<InstanceSpecs | undefined>()
  const specs = specsProp || specsState
  const options = optionsProp || defaultSpecsOptions

  const handleChange = useCallback(
    (specs: InstanceSpecs) => {
      setSpecsState(specs)
      onChange(specs)
    },
    [onChange],
  )

  return {
    specs,
    options,
    handleChange,
  }
}