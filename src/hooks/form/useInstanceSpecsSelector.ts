import { useCallback, useState } from 'react'

export type InstanceSpecs = {
  cpu: number
  ram: number
  storage?: number
}

export const Specs: InstanceSpecs[] = [1, 2, 4, 6, 8, 12].map((cpu) => ({
  cpu,
  ram: 2 * cpu * 1000,
  // storage: 2 * 10 ** Number(isPersistent) * computeUnits,
}))

export type UseInstanceSpecsSelectorProps = {
  specs?: InstanceSpecs[]
  onChange: (specs: InstanceSpecs) => void
}

export type UseInstanceSpecsSelectorReturn = {
  specs: InstanceSpecs[]
  selected?: number
  handleChange: (specs: InstanceSpecs) => void
}

export function useInstanceSpecsSelector({
  specs: specsProp,
  onChange,
}: UseInstanceSpecsSelectorProps): UseInstanceSpecsSelectorReturn {
  const [selected, setSelected] = useState<number | undefined>()

  const specs = specsProp || Specs

  const handleChange = useCallback(
    (specs: InstanceSpecs) => {
      setSelected(specs.cpu)
      onChange(specs)
    },
    [onChange],
  )

  return {
    specs,
    selected,
    handleChange,
  }
}
