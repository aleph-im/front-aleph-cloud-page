import { useAppState } from '@/contexts/appState'
import { Route } from '@aleph-front/core'
import { useMemo } from 'react'
import { useFilterUserStakeNodes } from './node/useFilterUserStakeNodes'
import { useFilterUserNodes } from './node/useFilterUserNodes'
import { useFilterNodeIssues } from './node/useFilterNodeIssues'
import { NAVIGATION_URLS } from '@/helpers/constants'
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
            href: NAVIGATION_URLS.console.home,
            children: [
              {
                name: 'Dashboard',
                href: NAVIGATION_URLS.console.home,
                exact: true,
                icon: 'dashboard',
              },
              {
                name: 'Settings',
                href: NAVIGATION_URLS.console.settings.home,
                exact: true,
                icon: 'settings',
              },
              {
                name: 'Web3 Hosting',
                href: NAVIGATION_URLS.console.web3Hosting.home,
                icon: 'web3HostingBox',
                children: [
                  {
                    name: 'Manage your website',
                    href: NAVIGATION_URLS.console.web3Hosting.website.home,
                    icon: 'manageWebsite',
                  },
                ],
              },
              {
                name: 'Computing',
                href: NAVIGATION_URLS.console.computing.home,
                icon: 'computeSolutions',
                children: [
                  {
                    name: 'Functions',
                    href: NAVIGATION_URLS.console.computing.functions.home,
                    icon: 'functions',
                  },
                  {
                    name: 'Instances',
                    href: NAVIGATION_URLS.console.computing.instances.home,
                    icon: 'instance',
                  },
                  {
                    name: 'GPU',
                    icon: 'gpu',
                    label: '(BETA)',
                    href: NAVIGATION_URLS.console.computing.gpus.home,
                  },
                  {
                    name: 'Confidentials',
                    href: NAVIGATION_URLS.console.computing.confidentials.home,
                    label: '(BETA)',
                    icon: 'confidential',
                  },
                ],
              },
              {
                name: 'Storage',
                href: NAVIGATION_URLS.console.storage.home,
                icon: 'storageSolutions',
                children: [
                  {
                    name: 'Volumes',
                    href: NAVIGATION_URLS.console.storage.volumes.home,
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
                    href: NAVIGATION_URLS.external.vrf,
                    external: true,
                    target: '_blank',
                    icon: 'arrow-up-right-from-square',
                    highlighted: true,
                  },
                  {
                    name: 'Indexing Framework',
                    href: NAVIGATION_URLS.external.indexingFramework,
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
        href: NAVIGATION_URLS.account.home,
        children: [
          {
            name: 'Earn',
            href: NAVIGATION_URLS.account.home,
            icon: 'earn',
            children: [
              {
                name: 'Staking',
                href: NAVIGATION_URLS.account.earn.staking,
                icon: 'earn',
                flag: stakeNodesWarningFlag,
              },
              {
                name: 'Core nodes',
                href: NAVIGATION_URLS.account.earn.ccn.home,
                icon: 'ccn',
                flag: userCCNsWarningFlag,
              },
              {
                name: 'Compute nodes',
                href: NAVIGATION_URLS.account.earn.crn.home,
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
        href: NAVIGATION_URLS.explorer.home,
        target: '_blank',
        external: true,
      },
      {
        name: 'Swap',
        icon: 'swap',
        href: NAVIGATION_URLS.swap.home,
        target: '_blank',
        external: true,
      },
    ] as Route[]
  }, [stakeNodesWarningFlag, userCCNsWarningFlag, userCRNsWarningFlag])

  return { routes }
}
