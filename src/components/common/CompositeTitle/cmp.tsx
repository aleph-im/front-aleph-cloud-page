import { memo, ReactNode } from 'react'
import { TextGradient } from '@aleph-front/core'

export const SectionTitle = ({ children }: { children: ReactNode }) => {
  return (
    <TextGradient as="h2" color="main0" type="h5">
      {children}
    </TextGradient>
  )
}
SectionTitle.displayName = 'SectionTitle'

export default memo(SectionTitle) as typeof SectionTitle
