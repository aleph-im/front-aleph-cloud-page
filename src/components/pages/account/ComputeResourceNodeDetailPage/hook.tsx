import { useAppState } from '@/contexts/appState'
import {
  CCN,
  CRN,
  CRNBenchmark,
  CRNSpecs,
  StreamNotSupportedIssue,
} from '@/domain/node'
import Router, { useRouter } from 'next/router'
import { useComputeResourceNode } from '@/hooks/common/node/useComputeResourceNode'
import { useCallback, useMemo, useState } from 'react'
import {
  UseNodeDetailReturn,
  useNodeDetail,
} from '@/hooks/common/node/useNodeDetail'
import { useUserCoreChannelNode } from '@/hooks/common/node/useUserCoreChannelNode'
import {
  UseEditComputeResourceNodeFormReturn,
  useEditComputeResourceNodeForm,
} from '@/hooks/form/node/useEditComputeResourceNodeForm'
import { useLinking } from '@/hooks/common/node/useLinking'
import {
  UseHostingProviderTopItem,
  useHostingProviderTop,
} from '@/hooks/common/node/useHostingProviderTop'
import { useRequestCRNSpecs } from '@/hooks/common/useRequestEntity/useRequestCRNSpecs'
import { consoleNewInstanceUrl } from '@/helpers/constants'
import { convertByteUnits } from '@/helpers/utils'
import { useRequestCRNIps } from '@/hooks/common/useRequestEntity/useRequestCRNIps'
import { StakeManager } from '@/domain/stake'
import { TabsProps } from '@aleph-front/core'
import { DefaultTheme, useTheme } from 'styled-components'
// import { useRequestCRNBenchmark } from '@/hooks/common/useRequestEntity/useRequestCRNBenchmark'

export type UseComputeResourceNodeDetailPageProps = {
  nodes?: CRN[]
}

export type UseComputeResourceNodeDetailPageReturn = UseNodeDetailReturn<CRN> &
  UseEditComputeResourceNodeFormReturn & {
    theme: DefaultTheme
    nodes?: CRN[]
    node?: CRN
    userNode?: CCN
    calculatedRewards?: number
    asnTier?: UseHostingProviderTopItem
    nodeSpecs?: CRNSpecs
    nodeIssue?: StreamNotSupportedIssue
    createInstanceUrl?: string
    nodeBenchmark?: CRNBenchmark
    isLinked?: boolean
    isLinkableByUser?: boolean
    isUnlinkableByUser?: boolean
    tabs: TabsProps['tabs']
    tabId: string
    setTabId: (tab: string) => void
    handleRemovePolicies: () => void
    handleRemove: () => void
    handleLink: () => Promise<boolean>
    handleUnlink: () => Promise<boolean>
  }

export function useComputeResourceNodeDetailPage(): UseComputeResourceNodeDetailPageReturn {
  const theme = useTheme()
  const router = useRouter()
  const { hash } = router.query

  const [state] = useAppState()
  const {
    connection: { account },
    manager: { nodeManager },
    crns: { entities: nodes },
  } = state

  const { node } = useComputeResourceNode({ hash })

  const { userNode } = useUserCoreChannelNode()

  // -----------------------------

  const stakeManager = useMemo(() => new StakeManager(account), [account])

  const calculatedRewards = useMemo(() => {
    if (!node) return 0
    return stakeManager.CRNRewardsPerDay(node) * (365 / 12)
  }, [node, stakeManager])

  // -----------------------------

  const details = useNodeDetail({ node, nodes })

  // -----------------------------

  const [tabId, setTabId] = useState('overview')

  const tabs: TabsProps['tabs'] = useMemo(() => {
    return [
      {
        id: 'overview',
        name: 'Overview',
      },
      {
        id: 'policies',
        name: 'Policies',
      },
    ]
  }, [])

  // -----------------------------

  const {
    isLinked: isLinkedCheck,
    isLinkableByUser: isLinkableByUserCheck,
    isUnlinkableByUser: isUnlinkableByUserCheck,
    handleLink: handleLinkBase,
    handleUnlink: handleUnlinkBase,
  } = useLinking()

  const isLinked = useMemo(
    () => node && isLinkedCheck(node),
    [isLinkedCheck, node],
  )

  const isLinkableByUser = useMemo(
    () => node && userNode && isLinkableByUserCheck(node, userNode),
    [isLinkableByUserCheck, node, userNode],
  )

  const isUnlinkableByUser = useMemo(
    () => node && isUnlinkableByUserCheck(node),
    [isUnlinkableByUserCheck, node],
  )

  const handleLink = useCallback(async () => {
    if (!node || !userNode) return false

    const success = await handleLinkBase(node.hash, userNode.hash)
    if (!success) return success

    if (!userNode) return success
    router.replace(`/account/earn/ccn/${userNode.hash}`)

    return success
  }, [handleLinkBase, router, node, userNode])

  const handleUnlink = useCallback(async () => {
    if (!node) return false

    const success = await handleUnlinkBase(node.hash)
    if (!success) return success

    if (!userNode) return success
    router.replace(`/account/earn/ccn/${userNode?.hash}`)

    return success
  }, [handleUnlinkBase, router, node, userNode])

  // -----------------------------

  const { top } = useHostingProviderTop({ nodes })
  const asnTier = top.find(
    (topAsn) => topAsn.name === node?.metricsData?.as_name,
  )

  // -----------------------------

  const nodeArray = useMemo(() => {
    if (!node) return
    return [node]
  }, [node])

  const { specs } = useRequestCRNSpecs({ nodes: nodeArray })
  const { ips } = useRequestCRNIps({ nodes: nodeArray })

  // @note: hardcoded here, find a way to share them between console / account pages (new npm lib domain package maybe or API)
  const minSpecs = useMemo(() => {
    return {
      cpu: 1,
      ram: convertByteUnits(2, { from: 'GiB', to: 'MiB' }),
      storage: convertByteUnits(2 * 10, { from: 'GiB', to: 'MiB' }),
    }
  }, [])

  const nodesIssues = useMemo(() => {
    if (!nodeArray) return

    return nodeArray.reduce(
      (ac, node) => {
        const issue = nodeManager.isStreamPaymentNotSupported(node)

        if (issue) {
          ac[node.hash] = issue
          return ac
        }

        const nodeSpecs = specs[node.hash]?.data

        if (nodeSpecs) {
          const validSpecs = nodeManager.validateMinNodeSpecs(
            minSpecs,
            nodeSpecs,
          )

          if (!validSpecs) {
            ac[node.hash] = StreamNotSupportedIssue.MinSpecs
            return ac
          }
        }

        const nodeIps = ips[node.hash]?.data

        if (nodeIps) {
          const validIp = !!nodeIps.vm

          if (!validIp) {
            ac[node.hash] = StreamNotSupportedIssue.IPV6
            return ac
          }
        }

        if (nodeSpecs && nodeIps) {
          ac[node.hash] = StreamNotSupportedIssue.Valid
        }

        return ac
      },
      {} as Record<string, StreamNotSupportedIssue>,
    )
  }, [nodeArray, nodeManager, specs, ips, minSpecs])

  const nodeSpecs = useMemo(() => {
    if (!node) return
    return specs[node.hash]?.data
  }, [specs, node])

  const nodeIssue = useMemo(() => {
    if (!node) return
    return nodesIssues?.[node.hash]
  }, [nodesIssues, node])

  const createInstanceUrl = useMemo(() => {
    if (!node) return

    const isLoading = nodeIssue === undefined
    return !isLoading && !nodeIssue
      ? `${consoleNewInstanceUrl}?crn=${node.hash}`
      : undefined
  }, [node, nodeIssue])

  // -----------------------------

  // const { benchmark } = useRequestCRNBenchmark({ nodes: nodeArray })

  // const nodeBenchmark = useMemo(() => {
  //   if (!node) return
  //   return benchmark[node.hash]?.data
  // }, [benchmark, node])

  // -----------------------------

  const defaultValues = useMemo(() => {
    return {
      hash: node?.hash,
      name: node?.name,
      description: node?.description,
      reward: node?.reward,
      stream_reward: node?.stream_reward,
      authorized: node?.authorized,
      locked: node?.locked,
      registration_url: node?.registration_url,
      picture: node?.picture,
      banner: node?.banner,
      address: node?.address,
      terms_and_conditions: node?.terms_and_conditions,
    }
  }, [node])

  const formProps = useEditComputeResourceNodeForm({ defaultValues })

  //@todo: implement this
  const handleRemovePolicies = useCallback(async () => {
    await nodeManager.updateComputeResourceNode({
      ...formProps.values,
      terms_and_conditions: '',
    })
    Router.reload()
  }, [formProps.values, nodeManager])

  return {
    theme,
    nodes,
    node,
    userNode,
    calculatedRewards,
    asnTier,
    nodeSpecs,
    nodeIssue,
    createInstanceUrl,
    isLinked,
    isLinkableByUser,
    isUnlinkableByUser,
    tabs,
    tabId,
    setTabId,
    handleRemovePolicies,
    handleLink,
    handleUnlink,
    ...formProps,
    ...details,
  }
}
