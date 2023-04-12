import { StyledStrong } from './styles'
import { H1Props } from './types'

export default function Strong({ children, ...rest }: H1Props) {
  return <StyledStrong {...rest}>{children}</StyledStrong>
}