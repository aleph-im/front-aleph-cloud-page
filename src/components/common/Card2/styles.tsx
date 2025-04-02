import { addClasses, NoisyContainer } from '@aleph-front/core'
import { ReactNode } from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'

export const StyledContainer = styled(NoisyContainer).attrs({
  type: 'grain-3',
})`
  ${tw`p-6 relative flex flex-col gap-6`}
`

export const StyledTitle = styled.div.attrs(addClasses('tp-info'))<{
  children?: ReactNode
}>`
  ${tw`uppercase`}
`
