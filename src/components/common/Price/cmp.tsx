import React, { memo } from 'react'
import { StyledPrice } from './styles'
import { PriceProps } from './types'
import { Logo } from '@aleph-front/core'
import { humanReadableCurrency } from '@/helpers/utils'

export const Price = ({ value, duration, ...rest }: PriceProps) => {
  return (
    <StyledPrice {...rest}>
      {humanReadableCurrency(value)}
      <Logo color="currentColor" img="aleph" />
      {duration && <span>/ {duration}</span>}
    </StyledPrice>
  )
}
Price.displayName = 'Price'

export default memo(Price) as typeof Price
