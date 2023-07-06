import { InstanceImageProp } from '@/hooks/form/useSelectInstanceImage'

export type SelectInstanceImageItemProps = {
  image: InstanceImageProp
  selected: boolean
  onChange: (image: InstanceImageProp) => void
}

export type SelectInstanceImageProps = {
  image?: InstanceImageProp
  options?: InstanceImageProp[]
  onChange: (image: InstanceImageProp) => void
}
