import { useAppState } from '@/contexts/appState'
import { CCN, CRN } from '@/domain/node'
import { EntityAddAction } from '@/store/entity'
import { useNotification } from '@aleph-front/core'
import { useCallback } from 'react'
import { useNodeManager } from '../useManager/useNodeManager'

export type UseLinkingReturn = {
  isLinked: (crnHashOrNode: string | CRN) => boolean
  isLinkableByUser: (
    crnHashOrNode: string | CRN,
    ccnHashOrNode: string | CCN,
  ) => boolean
  isUnlinkableByUser: (crnHashOrNode: string | CRN) => boolean
  handleLink: (
    crnHashOrNode: string | CRN,
    ccnHashOrNode: string | CCN,
  ) => Promise<boolean>
  handleUnlink: (crnHashOrNode: string | CRN) => Promise<boolean>
}

function calculateVirtualNodesLink(userNode: CCN, linkNode: CRN): [CCN, CRN] {
  const newLinkedNode: CRN = { ...linkNode, virtual: Date.now() }
  const newUserNode: CCN = { ...userNode, virtual: Date.now() }

  newLinkedNode.parent = newUserNode.hash
  newLinkedNode.parentData = newUserNode

  const crnsMap = newUserNode.crnsData.reduce(
    (ac, cv) => {
      ac[cv.hash] = cv
      return ac
    },
    {} as Record<string, CRN>,
  )

  crnsMap[newLinkedNode.hash] = newLinkedNode

  newUserNode.crnsData = Object.values(crnsMap)
  newUserNode.resource_nodes = Object.keys(crnsMap)

  return [newUserNode, newLinkedNode]
}

function calculateVirtualNodesUnlink(
  userNode: CCN,
  unlinkNode: CRN,
): [CCN, CRN] {
  const newUnlinkedNode: CRN = { ...unlinkNode, virtual: Date.now() }
  const newUserNode: CCN = { ...userNode, virtual: Date.now() }

  newUnlinkedNode.parent = ''
  newUnlinkedNode.parentData = undefined

  const crns = newUserNode.crnsData.filter(
    (node) => node.hash !== newUnlinkedNode.hash,
  )

  newUserNode.crnsData = crns
  newUserNode.resource_nodes = crns.map((node) => node.hash)

  return [newUserNode, newUnlinkedNode]
}

export function useLinking(): UseLinkingReturn {
  const [state, dispatch] = useAppState()
  // We don't need account anymore since we use useNodeManager
  const { entities: crns } = state.crns
  const { entities: ccns } = state.ccns

  const nodeManager = useNodeManager()

  const noti = useNotification()

  const getCRNNode = useCallback(
    (crnHashOrNode: string | CRN) => {
      return typeof crnHashOrNode === 'string'
        ? crns?.find((node) => node.hash === crnHashOrNode)
        : crnHashOrNode
    },
    [crns],
  )

  const getCCNNode = useCallback(
    (ccnHashOrNode: string | CCN) => {
      return typeof ccnHashOrNode === 'string'
        ? ccns?.find((node) => node.hash === ccnHashOrNode)
        : ccnHashOrNode
    },
    [ccns],
  )

  const isLinked = useCallback(
    (crnHashOrNode: string | CRN) => {
      const node = getCRNNode(crnHashOrNode)
      if (!node) return false

      return nodeManager.isLinked(node)
    },
    [getCRNNode, nodeManager],
  )

  const isLinkableByUser = useCallback(
    (crnHashOrNode: string | CRN, ccnHashOrNode: string | CCN) => {
      const node = getCRNNode(crnHashOrNode)
      const userNode = getCCNNode(ccnHashOrNode)
      if (!node || !userNode) return false

      return nodeManager.isLinkableBy(node, userNode)[0]
    },
    [getCCNNode, getCRNNode, nodeManager],
  )

  const isUnlinkableByUser = useCallback(
    (crnHashOrNode: string | CRN) => {
      const node = getCRNNode(crnHashOrNode)
      if (!node) return false

      const userNode = getCCNNode(node.parentData || node.parent || '')
      if (!userNode) return false

      return nodeManager.isUnlinkableBy(node, userNode)
    },

    [getCCNNode, getCRNNode, nodeManager],
  )

  const handleLink = useCallback(
    async (crnHashOrNode: string | CRN, ccnHashOrNode: string | CCN) => {
      try {
        if (!noti) throw new Error('Notification not ready')

        const crnNode = getCRNNode(crnHashOrNode)
        if (!crnNode) throw new Error('Invalid CRN node')

        const ccnNode = getCCNNode(ccnHashOrNode)
        if (!ccnNode) throw new Error('Invalid CCN node')

        if (!isLinkableByUser(crnNode, ccnNode))
          throw new Error('Not linkable node')

        await nodeManager.linkComputeResourceNode(crnNode.hash)

        noti.add({
          variant: 'success',
          title: 'Success',
          text: `Linked resource node "${crnNode.hash}" successfully.`,
        })

        const [ccn, crn] = calculateVirtualNodesLink(ccnNode, crnNode)

        dispatch(
          new EntityAddAction<CCN>({
            name: 'ccns',
            entities: [ccn],
          }),
        )

        dispatch(
          new EntityAddAction<CRN>({
            name: 'crns',
            entities: [crn],
          }),
        )

        return true
      } catch (e) {
        noti?.add({
          variant: 'error',
          title: 'Error',
          text: (e as Error).message,
        })
      }

      return false
    },
    [dispatch, getCCNNode, getCRNNode, isLinkableByUser, nodeManager, noti],
  )

  const handleUnlink = useCallback(
    async (crnHashOrNode: string | CRN) => {
      try {
        if (!noti) throw new Error('Notification not ready')

        const crnNode = getCRNNode(crnHashOrNode)
        if (!crnNode) throw new Error('Invalid CRN node')

        const ccnNode = getCCNNode(crnNode.parentData || crnNode.parent || '')
        if (!ccnNode) throw new Error('Invalid CCN node')

        if (!isUnlinkableByUser(crnNode)) throw new Error('Not unlinkable node')

        await nodeManager.unlinkComputeResourceNode(crnNode.hash)

        noti.add({
          variant: 'success',
          title: 'Success',
          text: `Unlinked resource node "${crnNode.hash}" successfully.`,
        })

        const [ccn, crn] = calculateVirtualNodesUnlink(ccnNode, crnNode)

        dispatch(
          new EntityAddAction<CCN>({
            name: 'ccns',
            entities: [ccn],
          }),
        )

        dispatch(
          new EntityAddAction<CRN>({
            name: 'crns',
            entities: [crn],
          }),
        )

        return true
      } catch (e) {
        noti?.add({
          variant: 'error',
          title: 'Error',
          text: (e as Error).message,
        })
      }

      return false
    },
    [dispatch, getCCNNode, getCRNNode, isUnlinkableByUser, nodeManager, noti],
  )

  return {
    isLinked,
    isLinkableByUser,
    isUnlinkableByUser,
    handleLink,
    handleUnlink,
  }
}
