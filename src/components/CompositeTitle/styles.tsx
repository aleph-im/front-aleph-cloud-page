import styled, { css } from 'styled-components'
import { StyledCompositeTitleLabelProps } from './types'

export const StyledCompositeTitle = styled.div`
  display: flex;
  align-items: baseline;
`

export const StyledCompositeTitleLabel = styled.span<StyledCompositeTitleLabelProps>`
  ${({ theme, type }) => css`
    align-self: center;
    transform: translate(5px, -${theme.typo[type].size / 2}rem);
    color: #FFF;
    font-size: ${theme.typo[type].size / 2}rem;
    font-weight: ${theme.typo[type].weight};
    font-family: ${theme.typo[type].family};
    font-style: ${theme.typo[type].style};  
  `}
`