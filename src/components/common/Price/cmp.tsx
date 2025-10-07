import React, { memo } from 'react'
import { StyledPrice } from './styles'
import { PriceProps } from './types'
import { Logo } from '@aleph-front/core'
import { humanReadableCurrency } from '@/helpers/utils'

export const Price = ({
  value,
  type = 'token',
  duration,
  iconSize = '0.75em',
  ...rest
}: PriceProps) => {
  return (
    <StyledPrice {...rest}>
      {humanReadableCurrency(value)}
      {type === 'token' && (
        <Logo color="currentColor" img="aleph" size={iconSize} />
      )}
      {duration && <span>/ {duration}</span>}
    </StyledPrice>
  )
}
Price.displayName = 'Price'

export default memo(Price) as typeof Price
