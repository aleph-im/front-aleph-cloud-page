import { addClasses } from '@aleph-front/aleph-core'
import styled from 'styled-components'
import tw from 'twin.macro'

const NoisyContainer = styled.div.attrs(addClasses('fx-noise-light'))`
  ${tw`p-6 rounded-3xl`}
`

export default NoisyContainer
