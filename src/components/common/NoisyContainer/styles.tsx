import { addClasses } from '@aleph-front/aleph-core'
import styled from 'styled-components'
import tw from 'twin.macro'

export type NoisyContainerProps = {
  $type?: 'base' | 'dark' | 'light'
}

export const NoisyContainer = styled.div.attrs<NoisyContainerProps>((props) => {
  const { $type = 'light' } = props
  return addClasses(`fx-noise-${$type}`)(props)
})<NoisyContainerProps>`
  ${tw`p-6 rounded-3xl`}
`

export default NoisyContainer
