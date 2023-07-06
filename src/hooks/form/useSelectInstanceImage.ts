import { InstanceImage, InstanceImageId, InstanceImages } from '@/domain/image'
import { useCallback, useState } from 'react'

export type InstanceImageProp = InstanceImage

export const defaultInstanceImageOptions = [
  InstanceImages[InstanceImageId.Debian11],
  InstanceImages[InstanceImageId.Debian12],
  InstanceImages[InstanceImageId.Ubuntu22],
]

export type UseSelectInstanceImageProps = {
  image?: InstanceImageProp
  options?: InstanceImageProp[]
  onChange: (image: InstanceImageProp) => void
}

export type UseSelectInstanceImageReturn = {
  image?: InstanceImageProp
  options: InstanceImageProp[]
  handleChange: (image: InstanceImageProp) => void
}

export function useSelectInstanceImage({
  image: imageProp,
  options: optionsProp,
  onChange,
}: UseSelectInstanceImageProps): UseSelectInstanceImageReturn {
  const [imageState, setInstanceImageState] = useState<
    InstanceImageProp | undefined
  >()
  const image = imageProp || imageState
  const options = optionsProp || defaultInstanceImageOptions

  // @note: Test overflowding items
  // options = [...options, ...options, ...options, ...options]

  const handleChange = useCallback(
    (image: InstanceImageProp) => {
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
