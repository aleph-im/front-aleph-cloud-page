import { useAppState } from '@/contexts/appState'
import { Route } from '@aleph-front/core'
import { useMemo } from 'react'
import { useFilterUserStakeNodes } from './node/useFilterUserStakeNodes'
import { useFilterUserNodes } from './node/useFilterUserNodes'
import { useFilterNodeIssues } from './node/useFilterNodeIssues'
export type UseRoutesReturn = {
  routes: Route[]
}

export function useRoutes(): UseRoutesReturn {
  const [state] = useAppState()

  // Get node entities if available
  const ccnNodes =
    state.ccns && 'entities' in state.ccns ? state.ccns.entities : undefined
  const crnNodes =
    state.crns && 'entities' in state.crns ? state.crns.entities : undefined

  // Use hooks at the top level, not inside callbacks
  const { stakeNodes } = useFilterUserStakeNodes({ nodes: ccnNodes })
  const { userNodes: userCCNs } = useFilterUserNodes({ nodes: ccnNodes })
  const { userNodes: userCRNs } = useFilterUserNodes({ nodes: crnNodes })

  const { warningFlag: stakeNodesWarningFlag } = useFilterNodeIssues({
    nodes: stakeNodes,
    isStaking: true,
  })

  const { warningFlag: userCCNsWarningFlag } = useFilterNodeIssues({
    nodes: userCCNs,
  })

  const { warningFlag: userCRNsWarningFlag } = useFilterNodeIssues({
    nodes: userCRNs,
  })

  // Combined routes
  const routes = useMemo(() => {
    // Using 'as Route[]' to assert the type for the entire routes array
    return [
      // Console section moved under /console
      {
        name: 'Console',
        href: '/console',
        icon: 'console',
        children: [
          {
            name: 'Solutions',
            href: '/console',
            children: [
              {
                name: 'Dashboard',
                href: '/console',
                exact: true,
                icon: 'dashboard',
              },
              {
                name: 'Settings',
                href: '/console/settings',
                exact: true,
                icon: 'settings',
              },
              {
                name: 'Web3 Hosting',
                href: '/console/hosting',
                icon: 'web3HostingBox',
                children: [
                  {
                    name: 'Manage your website',
                    href: '/console/hosting/website',
                    icon: 'manageWebsite',
                  },
                ],
              },
              {
                name: 'Computing',
                href: '/console/computing',
                icon: 'computeSolutions',
                children: [
                  {
                    name: 'Functions',
                    href: '/console/computing/function',
                    icon: 'functions',
                  },
                  {
                    name: 'Instances',
                    href: '/console/computing/instance',
                    icon: 'instance',
                  },
                  {
                    name: 'GPU',
                    icon: 'gpu',
                    label: '(BETA)',
                    href: '/console/computing/gpu-instance',
                  },
                  {
                    name: 'Confidentials',
                    href: '/console/computing/confidential',
                    label: '(BETA)',
                    icon: 'confidential',
                  },
                ],
              },
              {
                name: 'Storage',
                href: '/console/storage',
                icon: 'storageSolutions',
                children: [
                  {
                    name: 'Volumes',
                    href: '/console/storage',
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
      // Account section (no longer external, moved account section here)
      {
        name: 'Account',
        icon: 'profile',
        href: '/account',
        children: [
          {
            name: 'Earn',
            href: '/account',
            icon: 'earn',
            children: [
              {
                name: 'Staking',
                href: '/account/earn/staking',
                icon: 'earn',
                flag: stakeNodesWarningFlag,
              },
              {
                name: 'Core nodes',
                href: '/account/earn/ccn',
                icon: 'ccn',
                flag: userCCNsWarningFlag,
              },
              {
                name: 'Compute nodes',
                href: '/account/earn/crn',
                icon: 'crn',
                flag: userCRNsWarningFlag,
              },
            ],
          },
        ],
      },
      // External links remain unchanged
      {
        name: 'Explorer',
        icon: 'explore',
        href: 'https://explorer.aleph.cloud/',
        target: '_blank',
        external: true,
      },
      {
        name: 'Swap',
        icon: 'swap',
        href: 'https://swap.aleph.cloud/',
        target: '_blank',
        external: true,
      },
    ] as Route[]
  }, [stakeNodesWarningFlag, userCCNsWarningFlag, userCRNsWarningFlag])

  return { routes }
}
