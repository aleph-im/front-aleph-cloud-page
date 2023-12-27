import styled, { css } from 'styled-components'
import { getResponsiveCss } from '@aleph-front/aleph-core'
import FlatCardButton from '@/components/common/FlatCardButton'

export const StyledFlatCardButton = styled(FlatCardButton)`
  height: 10.125rem;
  width: 13.875rem;

  ${getResponsiveCss(
    'md',
    css`
      width: 30%;
    `,
  )}
`
