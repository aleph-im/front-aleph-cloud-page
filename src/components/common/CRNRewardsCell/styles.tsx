import { ColorDot } from '@aleph-front/core'
import styled from 'styled-components'

export type StyledAPYIconProps = { $performance: number }

export const StyledAPYIcon = styled(ColorDot).attrs<StyledAPYIconProps>(
  ({ $performance, ...rest }) => {
    const $color =
      $performance >= 0.8 ? 'success' : $performance >= 0.5 ? 'main0' : 'error'

    return {
      $color,
      ...rest,
    }
  },
)<StyledAPYIconProps>``
