import { TextGradient } from '@aleph-front/aleph-core'
import { CompositeTitleProps } from './types'
import { StyledLabel } from './styles'

export default function CompositeTitle({
  children,
  number,
  as: As = 'h1',
  type = 'h5',
  color = 'main1',
  disabled = false,
  label,
  ...rest
}: CompositeTitleProps) {
  return (
    <As style={{ lineHeight: '1rem', margin: 0 }}>
      <span className={disabled ? 'unavailable-content' : ''}>
        <span className="tp-body1 fs-28 text-base0" tw="inline">
          {String(number).padStart(2, '0')}/&nbsp;
        </span>
        <TextGradient
          {...{
            forwardedAs: 'span',
            type,
            color,
            ...rest,
          }}
          tw="inline"
        >
          {children}
        </TextGradient>
      </span>
      {label && <StyledLabel type={type}>{label}</StyledLabel>}
    </As>
  )
}
