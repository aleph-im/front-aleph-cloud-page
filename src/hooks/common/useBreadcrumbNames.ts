import { ellipseText } from '@/helpers/utils'
import { NextRouter, useRouter } from 'next/router'
import { useMemo } from 'react'

const defaultNames = {
  '/': 'HOME',
  '/console': 'CONSOLE',
  '/console/storage': 'STORAGE / VOLUMES',
  '/console/storage/volume': '-',
  '/console/storage/volume/[hash]': '-',
  '/console/storage/volume/new': 'SETUP NEW VOLUME',
  '/console/settings': 'SETTINGS',
  '/console/settings/ssh': '-',
  '/console/settings/ssh/[hash]': '-',
  '/console/settings/ssh/new': 'SETUP NEW SSH KEY',
  '/console/settings/domain': '-',
  '/console/settings/domain/[hash]': '-',
  '/console/settings/domain/new': 'SETUP NEW DOMAIN',
  '/console/computing': '-',
  '/console/computing/instance': 'COMPUTING / INSTANCES',
  '/console/computing/instance/[hash]': '-',
  '/console/computing/instance/new': 'SETUP NEW INSTANCE',
  '/console/computing/instance/new/auto': 'AUTOMATIC NODE ALLOCATION',
  '/console/computing/instance/new/crn': 'MANUAL NODE ALLOCATION',
  '/console/computing/instance/new/crn/[hash]': '-',
  '/console/computing/function': 'COMPUTING / FUNCTIONS',
  '/console/computing/function/[hash]': '-',
  '/console/computing/function/new': 'SETUP NEW FUNCTION',
  '/console/computing/confidential': 'COMPUTING / CONFIDENTIALS',
  '/console/computing/confidential/[hash]': '-',
  '/console/hosting': '-',
  '/console/hosting/website': 'WEB3 HOSTING / WEBSITES',
  '/console/hosting/website/[hash]': '-',
  '/console/hosting/website/new': 'SETUP NEW WEBSITE',
  '/account': 'ACCOUNT',
  '/account/earn': 'EARN',
  '/account/earn/staking': 'STAKING',
  '/account/earn/ccn': 'CORE NODES',
  '/account/earn/ccn/[hash]': '-',
  '/account/earn/crn': 'COMPUTE NODES',
  '/account/earn/crn/[hash]': '-',
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
      '/console/computing/instance/new/crn/[hash]': hash,
      '/console/storage/volume/[hash]': `${hash}`,
      '/console/settings/ssh/[hash]': `SSH KEYS / ${hash}`,
      '/console/settings/domain/[hash]': `DOMAINS / ${hashParam}`,
      '/console/computing/instance/[hash]': `${hash}`,
      '/console/computing/confidential/[hash]': `${hash}`,
      '/console/computing/function/[hash]': `${hash}`,
      '/console/hosting/website/[hash]': `${hashParam}`,
      '/account/earn/ccn/[hash]': `CORE NODES / ${hash}`,
      '/account/earn/crn/[hash]': `COMPUTE NODES / ${hash}`,
    }
  }, [router.query, names])

  return {
    names,
  }
}
