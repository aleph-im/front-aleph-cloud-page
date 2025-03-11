import React, { memo } from 'react'
import { SliderProps } from './types'
import { StyledSlide, StyledSlider } from './styles'

export const Slider = ({ activeIndex, children }: SliderProps) => {
  const slidesCount = React.Children.count(children)

  return (
    <div tw="overflow-hidden w-full">
      <StyledSlider slidesCount={slidesCount} activeIndex={activeIndex}>
        {children}
      </StyledSlider>
    </div>
  )
}
Slider.displayName = 'Slider'

export const Slide = ({ children }: { children: React.ReactNode }) => {
  return <StyledSlide>{children}</StyledSlide>
}

export default memo(Slider) as typeof Slider
