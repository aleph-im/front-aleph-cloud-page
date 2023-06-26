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

export type UseRuntimeSelectorProps = {
  images?: Runtime[]
  onChange: (image: Runtime) => void
}

export type UseRuntimeSelectorReturn = {
  images: Runtime[]
  selected?: string
  handleChange: (image: Runtime) => void
}

export function useRuntimeSelector({
  images: imagesProp,
  onChange,
}: UseRuntimeSelectorProps): UseRuntimeSelectorReturn {
  const [selected, setSelected] = useState<string | undefined>()

  const images = imagesProp || [
    Runtimes[RuntimeId.Debian11],
    Runtimes[RuntimeId.Debian12],
    Runtimes[RuntimeId.Ubuntu22],
  ]

  // @note: Test overflowding items
  // images = [...images, ...images, ...images, ...images]

  const handleChange = useCallback(
    (image: Runtime) => {
      setSelected(image.id)
      onChange(image)
    },
    [onChange],
  )

  return {
    images,
    selected,
    handleChange,
  }
}
