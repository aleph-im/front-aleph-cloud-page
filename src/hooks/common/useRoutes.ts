import { Route } from '@aleph-front/core'
import { useMemo } from 'react'

export type UseRoutesReturn = {
  routes: Route[]
}

export function useRoutes(): UseRoutesReturn {
  const routes: Route[] = useMemo(() => {
    return [
      {
        name: 'Console',
        href: '/',
        icon: 'console',
        children: [
          {
            name: 'Solutions',
            href: '/',
            exact: true,
            children: [
              {
                name: 'Dashboard',
                href: '/',
                exact: true,
              },
              {
                name: 'Settings',
                href: '/settings',
                exact: true,
              },
            ],
          },
          {
            name: 'Web3 Hosting',
            href: '/hosting',
            children: [
              {
                name: 'Websites',
                href: '/hosting/website',
              },
            ],
          },
          {
            name: 'Computing',
            href: '/computing',
            children: [
              {
                name: 'Functions',
                href: '/computing/function',
              },
              {
                name: 'Instances',
                href: '/computing/instance',
              },
              {
                name: 'Confidential',
                href: '/computing/confidential',
                disabled: true,
              },
            ],
          },
          {
            name: 'Storage',
            href: '/storage',
            children: [
              {
                name: 'Volumes',
                href: '/storage',
              },
            ],
          },
          {
            name: 'Tools',
            href: '#',
            children: [
              {
                name: 'VRF',
                href: 'https://medium.com/aleph-im/aleph-im-verifiable-random-function-vrf-b03544a7e904',
                external: true,
                target: '_blank',
              },
              {
                name: 'Indexer',
                href: 'https://docs.aleph.im/tools/indexer/',
                external: true,
                target: '_blank',
              },
            ],
          },
        ],
      },
      {
        name: 'Account',
        icon: 'profile',
        href: 'https://account.aleph.im/',
        target: '_blank',
        external: true,
      },
      {
        name: 'Explorer',
        icon: 'explore',
        href: 'https://explorer.aleph.im/',
        target: '_blank',
        external: true,
      },
      {
        name: 'Swap',
        icon: 'swap',
        href: 'https://swap.aleph.im/',
        target: '_blank',
        external: true,
      },
    ] as Route[]
  }, [])

  return {
    routes,
  }
}
