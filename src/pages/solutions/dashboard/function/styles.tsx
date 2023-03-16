import { Button } from "@aleph-front/aleph-core";
import styled from "styled-components";

const CenteredButtonWrapper = styled.div`
  text-align: center;
`
const CenteredButtonStyles = styled(Button)
                        .attrs({
                          color: "main0", 
                          kind: "neon", 
                          size: "big",
                          variant: "primary"
                        })` margin: auto;`

type CenteredButtonProps = {
  children: React.ReactNode
}
export const CenteredButton = ({children, ...props}: CenteredButtonProps) => {
  return (
    <CenteredButtonWrapper>
      <CenteredButtonStyles {...props}>{children}</CenteredButtonStyles>
    </CenteredButtonWrapper>
  )
}