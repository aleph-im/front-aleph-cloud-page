import { NAVIGATION_URLS } from '@/helpers/constants'
import { ellipseText } from '@/helpers/utils'
import { NextRouter, useRouter } from 'next/router'
import { useMemo } from 'react'

const defaultNames = {
  '/': 'HOME',
  [NAVIGATION_URLS.console.home]: 'CONSOLE',
  [NAVIGATION_URLS.console.storage.home]: 'STORAGE / VOLUMES',
  [`${[NAVIGATION_URLS.console.storage.volumes.home]}`]: '-',
  [`${[NAVIGATION_URLS.console.storage.volumes.home]}/[hash]`]: '-',
  [NAVIGATION_URLS.console.storage.volumes.new]: 'SETUP NEW VOLUME',
  [NAVIGATION_URLS.console.settings.home]: 'SETTINGS',
  [NAVIGATION_URLS.console.settings.ssh.home]: '-',
  [`${NAVIGATION_URLS.console.settings.ssh.home}/[hash]`]: '-',
  [NAVIGATION_URLS.console.settings.ssh.new]: 'SETUP NEW SSH KEY',
  [NAVIGATION_URLS.console.domain.home]: 'DOMAINS',
  [`${NAVIGATION_URLS.console.domain.home}/[hash]`]: '-',
  [NAVIGATION_URLS.console.domain.new]: 'SETUP NEW DOMAIN',
  [NAVIGATION_URLS.console.computing.home]: '-',
  [NAVIGATION_URLS.console.computing.instances.home]: 'COMPUTING / INSTANCES',
  [`${NAVIGATION_URLS.console.computing.instances.home}/[hash]`]: '-',
  [NAVIGATION_URLS.console.computing.instances.new]: 'SETUP NEW INSTANCE',
  [NAVIGATION_URLS.console.computing.functions.home]: 'COMPUTING / FUNCTIONS',
  [`${NAVIGATION_URLS.console.computing.functions.home}/[hash]`]: '-',
  [NAVIGATION_URLS.console.computing.functions.new]: 'SETUP NEW FUNCTION',
  [NAVIGATION_URLS.console.computing.confidentials.home]:
    'COMPUTING / CONFIDENTIALS',
  [`${NAVIGATION_URLS.console.computing.confidentials.home}/[hash]`]: '-',
  [NAVIGATION_URLS.console.web3Hosting.home]: '-',
  [NAVIGATION_URLS.console.web3Hosting.website.home]: 'WEB3 HOSTING / WEBSITES',
  [`${NAVIGATION_URLS.console.web3Hosting.website.home}/[hash]`]: '-',
  [NAVIGATION_URLS.console.web3Hosting.website.new]: 'SETUP NEW WEBSITE',
  [NAVIGATION_URLS.account.home]: 'ACCOUNT',
  [NAVIGATION_URLS.account.earn.home]: 'EARN',
  [NAVIGATION_URLS.account.earn.staking]: 'STAKING',
  [NAVIGATION_URLS.account.earn.ccn.home]: 'CORE NODES',
  [`${NAVIGATION_URLS.account.earn.ccn.home}/[hash]`]: '-',
  [NAVIGATION_URLS.account.earn.crn.home]: 'COMPUTE NODES',
  [`${NAVIGATION_URLS.account.earn.crn.home}/[hash]`]: '-',
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
      [`${NAVIGATION_URLS.console.storage.volumes.home}/[hash]`]: `${hash}`,
      [`${NAVIGATION_URLS.console.settings.ssh.home}/[hash]`]: `SSH KEYS / ${hash}`,
      [`${NAVIGATION_URLS.console.domain.home}/[hash]`]: `DOMAINS / ${hashParam}`,
      [`${NAVIGATION_URLS.console.computing.instances.home}/[hash]`]: `${hash}`,
      [`${NAVIGATION_URLS.console.computing.confidentials.home}/[hash]`]: `${hash}`,
      [`${NAVIGATION_URLS.console.computing.functions.home}/[hash]`]: `${hash}`,
      [`${NAVIGATION_URLS.console.web3Hosting.website.home}/[hash]`]: `${hashParam}`,
      [`${NAVIGATION_URLS.account.earn.ccn.home}/[hash]`]: `CORE NODES / ${hash}`,
      [`${NAVIGATION_URLS.account.earn.crn.home}/[hash]`]: `COMPUTE NODES / ${hash}`,
    }
  }, [router.query, names])

  return {
    names,
  }
}
