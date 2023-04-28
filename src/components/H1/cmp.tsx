import { StyledH1 } from './styles'
import { H1Props } from './types'

export default function H1({ children, ...rest }: H1Props) {
  return <StyledH1 {...rest}>{children}</StyledH1>
}
