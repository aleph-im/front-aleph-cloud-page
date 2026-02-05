import { ReactNode } from 'react'
import {
  CompositeTitle,
  CompositeTitleProps,
  TextGradient,
} from '@aleph-front/core'

export const CompositeSectionTitle = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  forwardedAs,
  ...rest
}: CompositeTitleProps) => {
  return (
    <CompositeTitle
      {...{ as: 'h2', color: 'main0', numberColor: 'main0', ...rest }}
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
