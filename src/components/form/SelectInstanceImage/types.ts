import { InstanceImage } from '@/hooks/form/useSelectInstanceImage'

export type SelectInstanceImageItemProps = {
  image: InstanceImage
  selected: boolean
  onChange: (image: InstanceImage) => void
}

export type SelectInstanceImageProps = {
  image?: InstanceImage
  options?: InstanceImage[]
  onChange: (image: InstanceImage) => void
}
