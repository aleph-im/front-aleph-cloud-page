import { ReactNode } from 'react'
import {
  CompositeTitle,
  CompositeTitleProps,
  TextGradient,
} from '@aleph-front/core'

export const CompositeSectionTitle = (props: CompositeTitleProps) => {
  return (
    <CompositeTitle
      {...{ as: 'h2', color: 'main0', numberColor: 'main0', ...props }}
    />
  )
}
CompositeSectionTitle.displayName = 'CompositeSectionTitle'

export const SectionTitle = ({ children }: { children: ReactNode }) => {
  return (
    <TextGradient as="h2" color="main0" type="h5">
      {children}
    </TextGradient>
  )
}
SectionTitle.displayName = 'SectionTitle'
