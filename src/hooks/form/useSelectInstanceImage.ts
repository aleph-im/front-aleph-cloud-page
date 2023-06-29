import { useCallback, useState } from 'react'

export enum InstanceImageId {
  Debian11 = 'bd79839bf96e595a06da5ac0b6ba51dea6f7e2591bb913deccded04d831d29f4',
  Debian11Bin = 'bd79839bf96e595a06da5ac0b6ba51dea6f7e2591bb913deccded04d831d29f4',
  Debian12 = 'TODO1',
  Ubuntu22 = 'TODO2',
  Custom = 'custom',
}

export type InstanceImage = {
  id: string
  name: string
  dist: string
}

export const InstanceImages: Record<InstanceImageId, InstanceImage> = {
  [InstanceImageId.Debian11]: {
    id: InstanceImageId.Debian11,
    name: 'Debian 11 “Bullseye”',
    dist: 'debian',
  },
  [InstanceImageId.Debian11Bin]: {
    id: InstanceImageId.Debian11Bin,
    name: 'Debian 11 “Bullseye”',
    dist: 'debian',
  },
  [InstanceImageId.Debian12]: {
    id: InstanceImageId.Debian12,
    name: 'Debian 12 “Bookworm”',
    dist: 'debian',
  },
  [InstanceImageId.Ubuntu22]: {
    id: InstanceImageId.Ubuntu22,
    name: 'Ubuntu 22.04.1 LTS',
    dist: 'ubuntu',
  },
  [InstanceImageId.Custom]: {
    id: InstanceImageId.Custom,
    name: 'Custom',
    dist: 'ubuntu',
  },
}

export const defaultInstanceImageOptions = [
  InstanceImages[InstanceImageId.Debian11],
  InstanceImages[InstanceImageId.Debian12],
  InstanceImages[InstanceImageId.Ubuntu22],
]

export type UseSelectInstanceImageProps = {
  image?: InstanceImage
  options?: InstanceImage[]
  onChange: (image: InstanceImage) => void
}

export type UseSelectInstanceImageReturn = {
  image?: InstanceImage
  options: InstanceImage[]
  handleChange: (image: InstanceImage) => void
}

export function useSelectInstanceImage({
  image: imageProp,
  options: optionsProp,
  onChange,
}: UseSelectInstanceImageProps): UseSelectInstanceImageReturn {
  const [imageState, setInstanceImageState] = useState<
    InstanceImage | undefined
  >()
  const image = imageProp || imageState
  const options = optionsProp || defaultInstanceImageOptions

  // @note: Test overflowding items
  // images = [...images, ...images, ...images, ...images]

  const handleChange = useCallback(
    (image: InstanceImage) => {
      setInstanceImageState(image)
      onChange(image)
    },
    [onChange],
  )

  return {
    image,
    options,
    handleChange,
  }
}
