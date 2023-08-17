import { MainProps } from './types'
import { StyledMain } from './styles'

export const Main = ({ children }: MainProps) => {
  return <StyledMain>{children}</StyledMain>
}

export default Main
