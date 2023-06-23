/* eslint-disable @next/next/no-img-element */
import styled from 'styled-components'
import tw from 'twin.macro'
import { useBasePath } from '@/hooks/useBasePath'
import { useCallback } from 'react'
import { Runtime } from '@/helpers/constants'
import { useRuntimeSelector } from '@/hooks/useRuntimeSelector'

export type RuntimeItemProps = {
  image: Runtime
  onChange: (iamge: Runtime) => void
  selected: boolean
}

export type RuntimeSelectorProps = {
  images?: Runtime[]
  onChange: (iamge: Runtime) => void
}

export const StyledFlatCard = styled.div<{ $selected: boolean }>`
  ${tw`flex flex-col items-center justify-center shrink-0 cursor-pointer`}
  width: 30%;
  height: 10.125rem;
  background-color: #ffffff1a;
  border-radius: 1.5rem;
  ${({ $selected }) => $selected && `border: 1px solid white`}
`

function RuntimeSelectorItem({ image, onChange, selected }: RuntimeItemProps) {
  const basePath = useBasePath()
  const imgPrefix = `${basePath}/img`

  const handleClick = useCallback(() => {
    onChange(image)
  }, [image, onChange])

  return (
    <StyledFlatCard onClick={handleClick} $selected={selected}>
      <img
        src={`${imgPrefix}/runtime/${image.dist}.svg`}
        alt={`${image.name} runtime image logo`}
      />
      {image.name}
    </StyledFlatCard>
  )
}

// Mocked runtimes
export default function RuntimeSelector({
  images: imagesProp,
  onChange,
}: RuntimeSelectorProps) {
  const { images, selected, handleChange } = useRuntimeSelector({
    images: imagesProp,
    onChange,
  })

  return (
    <div tw="overflow-auto max-w-full">
      <div tw="flex items-center justify-start flex-nowrap gap-6">
        {images.map((image) => (
          <RuntimeSelectorItem
            key={image.id + image.name}
            {...{
              image,
              selected: image.id === selected,
              onChange: handleChange,
            }}
          />
        ))}
      </div>
    </div>
  )
}
