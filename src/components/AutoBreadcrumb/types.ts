import { BreadcrumbProps } from '@aleph-front/aleph-core'
import { HTMLAttributes } from 'react'

export type AutoBreacrumbProps = HTMLAttributes<HTMLElement> &
  Omit<BreadcrumbProps, 'navLinks'> & {
    names?: Record<string, string>
    includeHome?: boolean
  }
