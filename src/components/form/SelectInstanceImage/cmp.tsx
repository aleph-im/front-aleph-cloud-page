/* eslint-disable @next/next/no-img-element */
import styled from 'styled-components'
import tw from 'twin.macro'
import { useBasePath } from '@/hooks/useBasePath'
import { useCallback } from 'react'
import {
  InstanceImage,
  useSelectInstanceImage,
} from '@/hooks/form/useSelectInstanceImage'

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

export const StyledFlatCard = styled.div<{ $selected: boolean }>`
  ${tw`flex flex-col items-center justify-center shrink-0 cursor-pointer`}
  width: 30%;
  height: 10.125rem;
  background-color: #ffffff1a;
  border-radius: 1.5rem;
  ${({ $selected }) => $selected && `border: 1px solid white`}
`

function SelectInstanceImageItem({
  image,
  selected,
  onChange,
}: SelectInstanceImageItemProps) {
  const basePath = useBasePath()
  const imgPrefix = `${basePath}/img`

  const handleClick = useCallback(() => {
    if (image.disabled) return

    onChange(image)
  }, [image, onChange])

  return (
    <StyledFlatCard onClick={handleClick} $selected={selected}>
      <img
        src={`${imgPrefix}/image/${image.dist}.svg`}
        alt={`${image.name} image image logo`}
      />
      {image.name}
    </StyledFlatCard>
  )
}

export default function SelectInstanceImage({
  image: imageProp,
  options: optionsProp,
  onChange,
}: SelectInstanceImageProps) {
  const { image, options, handleChange } = useSelectInstanceImage({
    image: imageProp,
    options: optionsProp,
    onChange,
  })

  return (
    <div tw="overflow-auto max-w-full">
      <div tw="flex items-center justify-start flex-nowrap gap-6">
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
      </div>
    </div>
  )
}
