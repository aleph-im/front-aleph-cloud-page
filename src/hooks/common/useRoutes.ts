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
                icon: 'dashboard',
              },
              {
                name: 'Settings',
                href: '/settings',
                exact: true,
                icon: 'settings',
              },
              {
                name: 'Web3 Hosting',
                href: '/hosting',
                icon: 'web3HostingBox',
                children: [
                  {
                    name: 'Manage your webiste',
                    href: '/hosting/website',
                    icon: 'manageWebsite',
                  },
                ],
              },
              {
                name: 'Computing',
                href: '/computing',
                icon: 'computeSolutions',
                children: [
                  {
                    name: 'Functions',
                    href: '/computing/function',
                    icon: 'functions',
                  },
                  {
                    name: 'Instances',
                    href: '/computing/instance',
                    icon: 'instance',
                  },
                  {
                    name: 'Confidential',
                    href: '/computing/confidential',
                    disabled: true,
                    label: '(SOON)',
                    icon: 'confidential',
                  },
                ],
              },
              {
                name: 'Storage',
                href: '/storage',
                icon: 'storageSolutions',
                children: [
                  {
                    name: 'Volumes',
                    href: '/storage',
                    icon: 'storageSolutions',
                  },
                ],
              },
              {
                name: 'Tools',
                href: '#',
                icon: 'console',
                children: [
                  {
                    name: 'VRF',
                    href: 'https://medium.com/aleph-im/aleph-im-verifiable-random-function-vrf-b03544a7e904',
                    external: true,
                    target: '_blank',
                    icon: 'arrow-up-right-from-square',
                    highlighted: true,
                  },
                  {
                    name: 'Indexing Framework',
                    href: 'https://docs.aleph.im/tools/indexer/',
                    external: true,
                    target: '_blank',
                    icon: 'arrow-up-right-from-square',
                    highlighted: true,
                  },
                ],
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
