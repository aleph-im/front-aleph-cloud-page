import styled, { css } from 'styled-components'
import tw from 'twin.macro'

export const StyledStatsRow = styled.div`
  ${tw`flex flex-wrap gap-4 items-stretch`}
`

export const StyledSectionHeader = styled.div`
  ${tw`flex items-center justify-between flex-wrap gap-3 mb-3`}
  position: relative;
  z-index: 2;
`

export const StyledScrollableTableContainer = styled.div<{
  $maxHeight?: string
}>`
  ${({ $maxHeight = '28rem' }) => css`
    max-height: ${$maxHeight};
    overflow-y: auto;
    overflow-x: auto;

    table {
      thead {
        position: sticky;
        top: 0;
        z-index: 1;
      }
    }
  `}
`
