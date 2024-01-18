import { NextRouter } from 'next/router'
import { useMemo } from 'react'

const defaultNames = {
  '/': 'HOME',
  '/computing/function': 'SETUP NEW FUNCTION',
  '/computing/instance/new': 'SETUP NEW INSTANCE',
  '/storage/volume': 'SETUP NEW VOLUME',
  '/configure/domain': 'SETUP NEW DOMAIN',
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
