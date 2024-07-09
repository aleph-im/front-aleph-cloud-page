import styled from 'styled-components'
import tw from 'twin.macro'

export const StyledEntityCardsContainer = styled.div`
  ${tw`flex gap-6 items-stretch flex-wrap mt-3`}
`

export const EntityCardWrapper = styled.div`
  ${tw`flex overflow-x-scroll`}

  /* Hide scrollbar for Chrome, Safari and Opera */
  &::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`

export const StyledSectionDescription = styled.p`
  ${tw`lg:max-w-[75%]`}
`
