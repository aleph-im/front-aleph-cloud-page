/* eslint-disable @next/next/no-img-element */
import styled, { css } from 'styled-components'
import tw from 'twin.macro'
import { useBasePath } from '@/hooks/useBasePath'
import { useCallback } from 'react'
import {
  InstanceImage,
  useSelectInstanceImage,
} from '@/hooks/form/useSelectInstanceImage'
import { getGlowHoverEffectCss } from '@aleph-front/aleph-core'

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

export const StyledFlatCardContainer = styled.div`
  ${tw`flex items-center justify-start md:flex-wrap gap-6`}
`

export const StyledFlatCard = styled.div<{
  $selected: boolean
  $disabled?: boolean
}>`
  ${({ $selected, $disabled }) => css`
    ${tw`flex flex-col items-center justify-center shrink-0 cursor-pointer transition-all duration-300`}
    width: 30%;
    height: 10.125rem;
    background-color: #ffffff1a;
    border-radius: 1.5rem;
    ${$selected && `border: 1px solid white;`}
    ${$disabled && 'opacity: 0.3;'}

    &:hover {
      ${!$disabled && getGlowHoverEffectCss('main0')}
    }
  `}
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
    <StyledFlatCard
      onClick={handleClick}
      $selected={selected}
      $disabled={image.disabled}
    >
      <img
        src={`${imgPrefix}/image/${image.dist}.svg`}
        alt={`${image.name} image image logo`}
      />
      {image.name}
    </StyledFlatCard>
  )
}

export default function SelectInstanceImage(props: SelectInstanceImageProps) {
  const { image, options, handleChange } = useSelectInstanceImage(props)

  return (
    <div tw="overflow-x-auto md:overflow-x-visible max-w-full">
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
}
