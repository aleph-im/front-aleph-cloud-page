import { EntityType } from '@/helpers/constants'
import { useCallback, useEffect, useMemo, useState } from 'react'

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

export function updateSpecsStorage(
  specs: InstanceSpecsProp,
  isPersistent: boolean,
): InstanceSpecsProp {
  return {
    ...specs,
    storage: specs.cpu * 2 * (isPersistent ? 10 : 1) * 10 ** 3, // MB
  }
}

export type UseSelectInstanceSpecsProps = {
  type: EntityType.Instance | EntityType.Program
  specs?: InstanceSpecsProp
  options?: InstanceSpecsProp[]
  isPersistent?: boolean
  onChange: (specs: InstanceSpecsProp) => void
}

export type UseSelectInstanceSpecsReturn = {
  type: EntityType.Instance | EntityType.Program
  specs?: InstanceSpecsProp
  options: InstanceSpecsProp[]
  isPersistent: boolean
  handleChange: (specs: InstanceSpecsProp) => void
}

export function useSelectInstanceSpecs({
  type,
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

  useEffect(() => {
    if (!specs) return

    const updatedSpecs = updateSpecsStorage(specs, isPersistent)
    if (updatedSpecs.storage === specs.storage) return

    handleChange(updatedSpecs)
  }, [specs, isPersistent, handleChange])

  return {
    type,
    specs,
    options,
    isPersistent,
    handleChange,
  }
}
