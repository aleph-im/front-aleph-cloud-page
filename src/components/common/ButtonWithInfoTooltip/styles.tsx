import { Icon, IconProps } from '@aleph-front/core'
import styled from 'styled-components'

type InfoIconProps = IconProps & {
  buttonSize?: string
}

export const InfoIcon = styled(Icon).attrs<InfoIconProps>(({ buttonSize }) => ({
  size: (() => {
    switch (buttonSize) {
      case 'xs':
        return 'xs' // xs
      case 'sm':
        return 'sm' // sm
      case 'lg':
        return 'md-lg' // md-lg
      case 'xl':
        return 'lg' // lg
      case 'md':
      default:
        return 'md' // md
    }
  })(),
}))<InfoIconProps>`
  opacity: 0.8;
`
