import styled from 'styled-components'
import { LabelProps } from './types'
import { addClasses } from '@aleph-front/aleph-core'

export const StyledLabel = styled.span.attrs(addClasses('tp-info'))<LabelProps>`
  vertical-align: top;
  color: #fff;
`
