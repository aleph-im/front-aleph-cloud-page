import { ellipseText } from '@/helpers/utils'
import { NextRouter, useRouter } from 'next/router'
import { useMemo } from 'react'

const defaultNames = {
  '/': 'HOME',
  '/storage': 'STORAGE / VOLUMES',
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
  '/computing/instance': 'COMPUTING / INSTANCES',
  '/computing/instance/[hash]': '-',
  '/computing/instance/new': 'SETUP NEW INSTANCE',
  '/computing/instance/new/auto': 'AUTOMATIC NODE ALLOCATION',
  '/computing/instance/new/crn': 'MANUAL NODE ALLOCATION',
  '/computing/instance/new/crn/[hash]': '-',
  '/computing/function': 'COMPUTING / FUNCTIONS',
  '/computing/function/[hash]': '-',
  '/computing/function/new': 'SETUP NEW FUNCTION',
  '/computing/confidential': 'COMPUTING / CONFIDENTIALS',
  '/hosting': '-',
  '/hosting/website': 'WEB3 HOSTING / WEBSITES',
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
      '/storage/volume/[hash]': `${hash}`,
      '/settings/ssh/[hash]': `SSH KEYS / ${hash}`,
      '/settings/domain/[hash]': `DOMAINS / ${hashParam}`,
      '/computing/instance/[hash]': `${hash}`,
      '/computing/function/[hash]': `${hash}`,
      '/hosting/website/[hash]': `${hashParam}`,
    }
  }, [router.query, names])

  return {
    names,
  }
}
