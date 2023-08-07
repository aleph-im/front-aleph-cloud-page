/* eslint-disable @next/next/no-img-element */
import React, { KeyboardEvent } from 'react'
import { useBasePath } from '@/hooks/common/useBasePath'
import { ForwardedRef, forwardRef, memo, useCallback } from 'react'
import { useSelectInstanceImage } from '@/hooks/form/useSelectInstanceImage'
import { SelectInstanceImageItemProps, SelectInstanceImageProps } from './types'
import { StyledFlatCard, StyledFlatCardContainer } from './styles'
import { FormError } from '@aleph-front/aleph-core'

const SelectInstanceImageItem = memo(
  forwardRef(
    (
      { option, index, value, onChange }: SelectInstanceImageItemProps,
      ref: ForwardedRef<HTMLDivElement>,
    ) => {
      const selected = value === option.id
      const basePath = useBasePath()
      const imgPrefix = `${basePath}/img`

      const handleClick = useCallback(() => {
        if (option.disabled) return
        onChange(option.id)
      }, [option, onChange])

      const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
          if (e.code !== 'Space' && e.code !== 'Enter') return
          e.preventDefault()
          onChange(option.id)
        },
        [option, onChange],
      )

      return (
        <StyledFlatCard
          onClick={handleClick}
          $selected={selected}
          $disabled={option.disabled}
          ref={index === 0 ? ref : undefined}
          tabIndex={0}
          onKeyDown={handleKeyDown}
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
  ),
)
SelectInstanceImageItem.displayName = 'SelectInstanceImageItem'

export const SelectInstanceImage = memo((props: SelectInstanceImageProps) => {
  const { imageCtrl, options } = useSelectInstanceImage(props)

  return (
    <div tw="overflow-x-auto md:overflow-x-visible w-full">
      <StyledFlatCardContainer>
        {options.map((option, index) => (
          <SelectInstanceImageItem
            key={option.id}
            {...imageCtrl.field}
            {...{
              index,
              option,
            }}
          />
        ))}
      </StyledFlatCardContainer>
      {imageCtrl.fieldState.error && (
        <FormError error={imageCtrl.fieldState.error} />
      )}
    </div>
  )
})
SelectInstanceImage.displayName = 'SelectInstanceImage'

export default SelectInstanceImage
