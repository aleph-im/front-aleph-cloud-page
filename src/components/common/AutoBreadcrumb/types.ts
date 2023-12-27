import { BreadcrumbProps } from '@aleph-front/aleph-core'
import { NextRouter } from 'next/router'
import { HTMLAttributes } from 'react'

export type AutoBreacrumbProps = HTMLAttributes<HTMLElement> &
  Omit<BreadcrumbProps, 'navLinks'> & {
    names?: Record<string, string | ((router: NextRouter) => string)>
    includeHome?: boolean
  }
