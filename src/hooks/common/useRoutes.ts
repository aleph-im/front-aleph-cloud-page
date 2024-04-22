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
            ],
          },
          {
            name: 'Web3 Hosting',
            href: '/hosting',
            children: [
              {
                name: 'Manage Your Website',
                href: '/hosting/website/new',
              },
            ],
          },
          {
            name: 'Computing',
            href: '/computing',
            children: [
              {
                name: 'Functions',
                href: '/computing/function/new',
              },
              {
                name: 'Instances',
                href: '/computing/instance/new',
              },
              {
                name: 'Confidential',
                href: '/computing/confidential/new',
                disabled: true,
              },
            ],
          },
          {
            name: 'Storage',
            href: '/storage',
            children: [
              {
                name: 'Inmutable volumes',
                href: '/storage/volume/new',
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
                name: 'Indexing framework',
                href: 'https://docs.aleph.im/tools/indexer/',
                external: true,
                target: '_blank',
              },
            ],
          },
          {
            name: 'Configure',
            href: '/configure',
            children: [
              {
                name: 'Secrets',
                href: '/configure/ssh/new',
              },
              {
                name: 'Custom domains',
                href: '/configure/domain/new',
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
