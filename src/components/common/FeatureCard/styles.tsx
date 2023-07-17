import { Card, CardProps, getTypoCss } from '@aleph-front/aleph-core'
import styled, { css } from 'styled-components'

export type StyledCardProps = {
  disabled?: boolean
  beta?: boolean
}

export const StyledCard = styled(Card).attrs<StyledCardProps, CardProps>(
  (props) => {
    return {
      ...props,
      variant: 'block',
      buttonColor: 'main0',
      buttonVariant: 'secondary',
      buttonDisabled: props.disabled,
    }
  },
)<StyledCardProps>`
  & header {
    position: relative;
    display: table;
  }

  ${({ theme, disabled, beta }) =>
    disabled
      ? css`
          & > :nth-child(odd),
          & p {
            opacity: 0.3;
          }

          & header {
            opacity: 1;
          }

          & header {
            color: #ffffff36;
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
        `
      : beta
      ? css`
          & header:after {
            position: absolute;
            content: '(BETA)';
            left: 100%;
            top: -0.5em;
            margin-left: 0.40625rem;
            ${getTypoCss('info')}
            color: ${theme.color.main0}
          }
        `
      : ''}
`
