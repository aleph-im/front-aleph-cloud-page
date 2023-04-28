import React from 'react'
import { StyledContainer } from './styles'
import { ContainerProps } from './types'

export const Container = ({ children, ...rest }: ContainerProps) => {
  return <StyledContainer {...rest}>{children}</StyledContainer>
}

export default Container
