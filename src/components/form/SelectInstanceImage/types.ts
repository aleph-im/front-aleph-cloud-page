import { InstanceImage } from '@/domain/image'
import { InstanceImageField } from '@/hooks/form/useSelectInstanceImage'
import { Control } from 'react-hook-form'

export type SelectInstanceImageItemProps = {
  option: InstanceImage
  value?: InstanceImageField
  onChange: (value: InstanceImageField) => void
}

export type SelectInstanceImageProps = {
  name?: string
  control: Control
  options?: InstanceImage[]
}
