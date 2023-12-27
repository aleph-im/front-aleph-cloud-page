import { Route } from '@aleph-front/aleph-core'
import { useMemo } from 'react'

export type UseRoutesReturn = {
  routes: Route[]
}

export function useRoutes(): UseRoutesReturn {
  const routes: Route[] = useMemo(() => {
    return [
      {
        name: 'Solutions',
        href: '/',
      },
      {
        name: 'Dashboard',
        href: '/dashboard',
      },
    ]
  }, [])

  return {
    routes,
  }
}
