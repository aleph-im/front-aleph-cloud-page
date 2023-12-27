import { NextRouter } from 'next/router'
import { useMemo } from 'react'

const defaultNames = {
  '/': 'SOLUTIONS',
  '/dashboard/function': 'SETUP NEW FUNCTION',
  '/dashboard/instance/new': 'SETUP NEW INSTANCE',
  '/dashboard/volume': 'SETUP NEW VOLUME',
  '/dashboard/domain': 'SETUP NEW DOMAIN',
  // @todo: Calculate entity name by hash (refactor routes)
  '/dashboard/manage': 'ENTITY',
}

export type UseBreadcrumbNamesReturn = {
  names: Record<string, string | ((route: NextRouter) => string)>
}

export function useBreadcrumbNames(): UseBreadcrumbNamesReturn {
  const names = useMemo(() => ({ ...defaultNames }), [])

  return {
    names,
  }
}
