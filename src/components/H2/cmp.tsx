import { StyledH2, StyledLabel } from './styles'
import { H2Props } from './types'

export default function H2({ children, label, ...rest }: H2Props) {
  return (
    <StyledH2 {...rest}>
      {children}
      {label && <StyledLabel {...rest}>{label}</StyledLabel>}
    </StyledH2>
  )
}
