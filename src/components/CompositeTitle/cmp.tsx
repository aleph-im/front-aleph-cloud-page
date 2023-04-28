import { TextGradient } from '@aleph-front/aleph-core'
import { StyledCompositeTitle, StyledCompositeTitleLabel } from './styles'
import { CompositeTitleProps, StyledCompositeTitleLabelProps } from './types'

export default function CompositeTitle({
  title,
  number,
  type,
  color,
  label,
}: CompositeTitleProps & StyledCompositeTitleLabelProps) {
  return (
    <StyledCompositeTitle>
      <span className="fs-lg">{String(number).padStart(2, '0')}/&nbsp;</span>
      <TextGradient type={type} color={color}>
        {title}
      </TextGradient>
      {label && (
        <StyledCompositeTitleLabel type={type} className="unavailable-label">
          {label}
        </StyledCompositeTitleLabel>
      )}
    </StyledCompositeTitle>
  )
}
