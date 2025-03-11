import styled, { css } from 'styled-components'

type StyledSliderProps = {
  slidesCount: number
  activeIndex: number
}

export const StyledSlide = styled.div``

export const StyledSlider = styled.div<StyledSliderProps>`
  ${({ theme, slidesCount, activeIndex }) => css`
    display: flex;
    width: ${slidesCount * 100}%;

    transform: translateX(-${activeIndex * (100 / slidesCount)}%);
    transition: all ${theme.transition.duration.normal}ms
      ${theme.transition.timing};

    ${StyledSlide} {
      flex: 0 0 ${100 / slidesCount}%;
    }
  `}
`
