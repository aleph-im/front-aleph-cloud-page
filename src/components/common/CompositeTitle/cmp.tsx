import { memo } from 'react'
import { CompositeTitle, CompositeTitleProps } from '@aleph-front/core'

export const SectionTitle = (props: CompositeTitleProps) => {
  return (
    <CompositeTitle
      {...{ as: 'h2', color: 'main0', numberColor: 'main0', ...props }}
    />
  )
}
SectionTitle.displayName = 'SectionTitle'

export default memo(SectionTitle) as typeof SectionTitle
