import { ellipseText } from '@/helpers/utils'
import { NextRouter, useRouter } from 'next/router'
import { useMemo } from 'react'

const defaultNames = {
  '/': 'HOME',
  '/storage': '-',
  '/storage/volume': '-',
  '/storage/volume/[hash]': '-',
  '/storage/volume/new': 'SETUP NEW VOLUME',
  '/settings': 'SETTINGS',
  '/settings/ssh': '-',
  '/settings/ssh/[hash]': '-',
  '/settings/ssh/new': 'SETUP NEW SSH KEY',
  '/settings/domain': '-',
  '/settings/domain/[hash]': '-',
  '/settings/domain/new': 'SETUP NEW DOMAIN',
  '/computing': '-',
  '/computing/instance': '-',
  '/computing/instance/[hash]': '-',
  '/computing/instance/new': 'SETUP NEW INSTANCE',
  '/computing/instance/new/auto': 'AUTOMATIC NODE ALLOCATION',
  '/computing/instance/new/crn': 'MANUAL NODE ALLOCATION',
  '/computing/instance/new/crn/[hash]': '-',
  '/computing/function': '-',
  '/computing/function/[hash]': '-',
  '/computing/function/new': 'SETUP NEW FUNCTION',
  '/hosting': '-',
  '/hosting/website': '-',
  '/hosting/website/[hash]': '-',
  '/hosting/website/new': 'SETUP NEW WEBSITE',
}

export type UseBreadcrumbNamesReturn = {
  names: Record<string, string | ((route: NextRouter) => string)>
}

export function useBreadcrumbNames(): UseBreadcrumbNamesReturn {
  const router = useRouter()

  let names = useMemo(() => ({ ...defaultNames }), [])

  names = useMemo(() => {
    const { hash: hashParam } = router.query
    const hash = hashParam ? ellipseText(hashParam as string, 6, 6) : '-'

    return {
      ...names,
      '/computing/instance/new/crn/[hash]': hash,
      '/storage/volume/[hash]': `VOLUME / ${hash}`,
      '/settings/ssh/[hash]': `SSH KEY / ${hash}`,
      '/settings/domain/[hash]': `DOMAIN / ${hashParam}`,
      '/computing/instance/[hash]': `INSTANCE / ${hash}`,
      '/computing/function/[hash]': `FUNCTION / ${hash}`,
      '/hosting/website/[hash]': `WEBSITE / ${hashParam}`,
    }
  }, [router.query, names])

  return {
    names,
  }
}
