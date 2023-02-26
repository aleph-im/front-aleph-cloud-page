import React from 'react'
import { StyledContainer } from './styles'
import { ContainerProps } from './types'

export const Container = ({ children }: ContainerProps) => {
  return (
    <StyledContainer>
      {children}
    </StyledContainer>
  )
}

export default Container
