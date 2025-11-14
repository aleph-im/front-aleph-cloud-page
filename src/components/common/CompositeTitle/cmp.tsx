import { memo } from 'react'
import { CompositeTitle, CompositeTitleProps } from '@aleph-front/core'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const SectionTitle = ({ forwardedAs, ...rest }: CompositeTitleProps) => {
  return (
    <CompositeTitle
      {...{ as: 'h2', color: 'main0', numberColor: 'main0', ...rest }}
    />
  )
}
SectionTitle.displayName = 'SectionTitle'

export default memo(SectionTitle) as typeof SectionTitle
