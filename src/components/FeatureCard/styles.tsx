import { Card, getTypoCss } from '@aleph-front/aleph-core'
import styled, { css } from 'styled-components'

export const StyledCard = styled(Card).attrs(props => {
  return {
    ...props,
    variant: "block",
    buttonColor: "main0",
    buttonVariant: "secondary",
    buttonHref: "#",
    buttonOnClick: () => { },
  }
}) <{ disabled?: boolean }>`
  & header {
    position: relative;
    display: inline-block;
    clear: both;
  }

  ${({ theme, disabled }) => disabled ? css`
    & > :nth-child(odd), & p {
      opacity: 0.3;
    }

    & header {
      opacity: 1;
    }

    & header {
      color: #FFFFFF36
    }
    
      & header:after {
        position: absolute;
        content: '(SOON)';
        left: 100%;
        top: -0.5em;
        margin-left: 0.40625rem;
        ${getTypoCss('info')}
        color: ${theme.color.text}
      }
    ` : ''
  }
`