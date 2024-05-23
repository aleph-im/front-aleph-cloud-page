import styled from 'styled-components'
import { addClasses } from '@aleph-front/core'

export const StyledStrong = styled.strong.attrs(addClasses('tp-body4'))`
  color: ${({ theme }) => theme.color.main0};
`
