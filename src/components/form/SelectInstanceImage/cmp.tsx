/* eslint-disable @next/next/no-img-element */
import { useBasePath } from '@/hooks/useBasePath'
import { useCallback } from 'react'
import { useSelectInstanceImage } from '@/hooks/form/useSelectInstanceImage'
import { SelectInstanceImageItemProps, SelectInstanceImageProps } from './types'
import { StyledFlatCard, StyledFlatCardContainer } from './styles'
import React from 'react'

const SelectInstanceImageItem = React.memo(
  ({ image, selected, onChange }: SelectInstanceImageItemProps) => {
    const basePath = useBasePath()
    const imgPrefix = `${basePath}/img`

    const handleClick = useCallback(() => {
      if (image.disabled) return

      onChange(image)
    }, [image, onChange])

    return (
      <StyledFlatCard
        onClick={handleClick}
        $selected={selected}
        $disabled={image.disabled}
      >
        <img
          src={`${imgPrefix}/image/${image.dist}.svg`}
          alt={`${image.name} image image logo`}
          tw="mb-4"
        />
        {image.name}
      </StyledFlatCard>
    )
  },
)
SelectInstanceImageItem.displayName = 'SelectInstanceImageItem'

export const SelectInstanceImage = React.memo(
  (props: SelectInstanceImageProps) => {
    const { image, options, handleChange } = useSelectInstanceImage(props)

    return (
      <div tw="overflow-x-auto md:overflow-x-visible w-full">
        <StyledFlatCardContainer>
          {options.map((option) => (
            <SelectInstanceImageItem
              key={option.id}
              {...{
                option,
                image: option,
                selected: option.id === image?.id,
                onChange: handleChange,
              }}
            />
          ))}
        </StyledFlatCardContainer>
      </div>
    )
  },
)
SelectInstanceImage.displayName = 'SelectInstanceImage'

export default SelectInstanceImage
