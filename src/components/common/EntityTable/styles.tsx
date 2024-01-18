import styled from 'styled-components'
import tw from 'twin.macro'
import { Table } from '@aleph-front/core'

export const StyledTable = styled(Table)`
  & td,
  & th {
    ${tw`px-4 w-0 whitespace-nowrap text-ellipsis`}
  }
`
