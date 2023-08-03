import { InstanceImage, InstanceImageId, InstanceImages } from '@/domain/image'
import { formValidationRules } from '@/helpers/errors'
import { Control, UseControllerReturn, useController } from 'react-hook-form'

export type InstanceImageField = string

export const defaultInstanceImage = InstanceImageId.Debian11

export const defaultInstanceImageOptions = [
  InstanceImages[InstanceImageId.Debian11],
  InstanceImages[InstanceImageId.Debian12],
  InstanceImages[InstanceImageId.Ubuntu22],
]

export type UseSelectInstanceImageProps = {
  name?: string
  control: Control
  defaultValue?: InstanceImageField
  options?: InstanceImage[]
}

export type UseSelectInstanceImageReturn = {
  imageCtrl: UseControllerReturn<any, any>
  options: InstanceImage[]
}

export function useSelectInstanceImage({
  name = 'image',
  control,
  defaultValue,
  options: optionsProp,
}: UseSelectInstanceImageProps): UseSelectInstanceImageReturn {
  const options = optionsProp || defaultInstanceImageOptions

  const { required } = formValidationRules

  const imageCtrl = useController({
    control,
    name,
    defaultValue,
    rules: { required },
  })

  return {
    imageCtrl,
    options,
  }
}
