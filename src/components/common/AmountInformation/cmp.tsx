import React, { memo } from 'react'
import { AmountInformationProps } from './types'
import { StyledAmountInformationContainer } from './styles'

export const AmountInformation = ({
  amount = 0,
}: AmountInformationProps = {}) => {
  if (amount === 0) return <></>

  return (
    <StyledAmountInformationContainer tw="px-3">
      <p className="fs-18 text-base2 tp-body2">{amount}</p>
    </StyledAmountInformationContainer>
  )
}
AmountInformation.displayName = 'AmountInformation'

export default memo(AmountInformation) as typeof AmountInformation
