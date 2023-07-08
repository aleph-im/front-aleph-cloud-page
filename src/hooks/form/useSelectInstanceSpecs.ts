import { useCallback, useState } from 'react'

export type InstanceSpecsProp = {
  id: string
  cpu: number
  ram: number
  storage?: number
}

export const defaultSpecsOptions: InstanceSpecsProp[] = [1, 2, 4, 6, 8, 12].map(
  (cpu) => ({
    id: `specs-${cpu}`,
    cpu,
    ram: 2 * cpu * 1000,
  }),
)

export type UseSelectInstanceSpecsProps = {
  specs?: InstanceSpecsProp
  options?: InstanceSpecsProp[]
  isPersistentVM?: boolean
  onChange: (specs: InstanceSpecsProp) => void
}

export type UseSelectInstanceSpecsReturn = {
  specs?: InstanceSpecsProp
  options: InstanceSpecsProp[]
  isPersistentVM: boolean
  handleChange: (specs: InstanceSpecsProp) => void
}

export function useSelectInstanceSpecs({
  specs: specsProp,
  options: optionsProp,
  isPersistentVM = false,
  onChange,
}: UseSelectInstanceSpecsProps): UseSelectInstanceSpecsReturn {
  const [specsState, setSpecsState] = useState<InstanceSpecsProp | undefined>()
  const specs = specsProp || specsState
  const options = optionsProp || defaultSpecsOptions

  const handleChange = useCallback(
    (specs: InstanceSpecsProp) => {
      setSpecsState(specs)
      onChange(specs)
    },
    [onChange],
  )

  return {
    specs,
    options,
    isPersistentVM,
    handleChange,
  }
}
