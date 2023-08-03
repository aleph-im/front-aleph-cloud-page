/* eslint-disable @next/next/no-img-element */
import { useBasePath } from '@/hooks/common/useBasePath'
import { useCallback } from 'react'
import { useSelectInstanceImage } from '@/hooks/form/useSelectInstanceImage'
import { SelectInstanceImageItemProps, SelectInstanceImageProps } from './types'
import { StyledFlatCard, StyledFlatCardContainer } from './styles'
import React from 'react'
import { FormError } from '@aleph-front/aleph-core'

const SelectInstanceImageItem = React.memo(
  ({ option, value, onChange }: SelectInstanceImageItemProps) => {
    const selected = value === option.id
    const basePath = useBasePath()
    const imgPrefix = `${basePath}/img`

    const handleClick = useCallback(() => {
      if (option.disabled) return
      onChange(option.id)
    }, [option, onChange])

    return (
      <StyledFlatCard
        onClick={handleClick}
        $selected={selected}
        $disabled={option.disabled}
      >
        <img
          src={`${imgPrefix}/image/${option.dist}.svg`}
          alt={`${option.name} image image logo`}
          tw="mb-4"
        />
        {option.name}
      </StyledFlatCard>
    )
  },
)
SelectInstanceImageItem.displayName = 'SelectInstanceImageItem'

export const SelectInstanceImage = React.memo(
  (props: SelectInstanceImageProps) => {
    const { imageCtrl, options } = useSelectInstanceImage(props)

    return (
      <div tw="overflow-x-auto md:overflow-x-visible w-full">
        <StyledFlatCardContainer>
          {options.map((option) => (
            <SelectInstanceImageItem
              key={option.id}
              {...imageCtrl.field}
              option={option}
            />
          ))}
        </StyledFlatCardContainer>
        {imageCtrl.fieldState.error && (
          <FormError error={imageCtrl.fieldState.error} />
        )}
      </div>
    )
  },
)
SelectInstanceImage.displayName = 'SelectInstanceImage'

export default SelectInstanceImage
