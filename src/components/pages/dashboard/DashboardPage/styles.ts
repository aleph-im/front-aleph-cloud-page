import styled from 'styled-components'
import tw from 'twin.macro'

export const StyledEntityCardsContainer = styled.div`
  ${tw`flex gap-6 items-stretch flex-wrap mt-3`}
`

export const EntityCardWrapper = styled.div`
  ${tw`flex overflow-scroll`}
`

export const StyledSectionDescription = styled.p`
  ${tw`lg:max-w-[75%]`}
`
