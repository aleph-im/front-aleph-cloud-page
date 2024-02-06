import { BreadcrumbProps } from '@aleph-front/core'
import { NextRouter } from 'next/router'
import { HTMLAttributes, ReactNode } from 'react'

export type AutoBreacrumbSlug = ReactNode | ((router: NextRouter) => ReactNode)

export type AutoBreacrumbProps = HTMLAttributes<HTMLElement> &
  Omit<BreadcrumbProps, 'navLinks'> & {
    names?: Record<string, AutoBreacrumbSlug>
  }
