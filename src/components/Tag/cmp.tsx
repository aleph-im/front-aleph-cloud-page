import React from 'react'
import { StyledTag } from './styles'
import { TagProps } from './types'

export const TagBlock = ({ children, ...rest }: TagProps) => {
  return (
    <StyledTag {...rest}>
      {children}
    </StyledTag>
  )
}

export default TagBlock
