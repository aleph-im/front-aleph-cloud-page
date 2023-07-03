import { useCallback, useState } from 'react'

export enum InstanceImageId {
  Debian11 = '5f31b0706f59404fad3d0bff97ef89ddf24da4761608ea0646329362c662ba51',
  Debian12 = 'TODO1',
  Ubuntu22 = 'TODO2',
}

export type InstanceImage = {
  id: string
  name: string
  dist: string

  // @todo: Remove this once we have all premade images
  disabled?: boolean
}

export const InstanceImages: Record<InstanceImageId, InstanceImage> = {
  [InstanceImageId.Debian11]: {
    id: InstanceImageId.Debian11,
    name: 'Debian 11 “Bullseye”',
    dist: 'debian',
  },
  [InstanceImageId.Debian12]: {
    id: InstanceImageId.Debian12,
    name: 'Debian 12 “Bookworm”',
    dist: 'debian',
    disabled: true,
  },
  [InstanceImageId.Ubuntu22]: {
    id: InstanceImageId.Ubuntu22,
    name: 'Ubuntu 22.04.1 LTS',
    dist: 'ubuntu',
    disabled: true,
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
  // options = [...options, ...options, ...options, ...options]

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
