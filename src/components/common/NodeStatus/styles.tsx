import styled from 'styled-components'
import { AlephNode } from '@/domain/node'
import { ColorDot } from '@aleph-front/core'

export type StyledStatusIconProps = { $status: AlephNode['status'] }

export const StyledStatusIcon = styled(ColorDot).attrs<StyledStatusIconProps>(
  ({ $status, ...rest }) => {
    const $color =
      $status === 'active' || $status === 'linked' ? 'main0' : 'main1'

    return {
      $color,
      ...rest,
    }
  },
)<StyledStatusIconProps>``
