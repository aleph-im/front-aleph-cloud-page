import { Icon, IconProps } from '@aleph-front/core'
import styled from 'styled-components'

type InfoIconProps = IconProps & {
  buttonSize?: string
}

export const InfoIcon = styled(Icon)<InfoIconProps>`
  opacity: 0.8;

  ${({ buttonSize }) => {
    switch (buttonSize) {
      case 'xs':
        return 'font-size: 0.75rem;' // xs
      case 'sm':
        return 'font-size: 0.875rem;' // sm
      case 'lg':
        return 'font-size: 1.25rem;' // md-lg
      case 'xl':
        return 'font-size: 1.5rem;' // lg
      case 'md':
      default:
        return 'font-size: 1rem;' // md
    }
  }}
`
