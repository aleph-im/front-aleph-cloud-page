import { useCallback, useMemo, useState } from 'react'

export type InstanceSpecsProp = {
  id: string
  cpu: number
  ram: number
  storage: number
}

// @note: https://medium.com/aleph-im/aleph-im-tokenomics-update-nov-2022-fd1027762d99
export function getDefaultSpecsOptions(
  isPersistent: boolean,
): InstanceSpecsProp[] {
  return [1, 2, 4, 6, 8, 12].map((cpu) => ({
    id: `specs-${cpu}`,
    cpu,
    ram: cpu * 2 * 10 ** 3, // MB
    storage: cpu * 2 * (isPersistent ? 10 : 1) * 10 ** 3, // MB
  }))
}

export type UseSelectInstanceSpecsProps = {
  specs?: InstanceSpecsProp
  options?: InstanceSpecsProp[]
  isPersistent?: boolean
  onChange: (specs: InstanceSpecsProp) => void
}

export type UseSelectInstanceSpecsReturn = {
  specs?: InstanceSpecsProp
  options: InstanceSpecsProp[]
  isPersistent: boolean
  handleChange: (specs: InstanceSpecsProp) => void
}

export function useSelectInstanceSpecs({
  specs: specsProp,
  options: optionsProp,
  isPersistent = true,
  onChange,
}: UseSelectInstanceSpecsProps): UseSelectInstanceSpecsReturn {
  const [specsState, setSpecsState] = useState<InstanceSpecsProp | undefined>()
  const specs = specsProp || specsState

  const options = useMemo(
    () => optionsProp || getDefaultSpecsOptions(isPersistent),
    [optionsProp, isPersistent],
  )

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
    isPersistent,
    handleChange,
  }
}
