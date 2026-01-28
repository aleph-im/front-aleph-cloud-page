import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocalRequest, useNotification } from '@aleph-front/core'
import { CRNSpecs, NodeManager } from '@/domain/node'
import {
  Executable,
  ExecutableCalculatedStatus,
  ExecutableManager,
  ExecutableOperations,
  ExecutableStatus,
  StreamPaymentDetails,
} from '@/domain/executable'
import Err from '@/helpers/errors'
import { PaymentType } from '@aleph-sdk/message'
import { BlockchainId, blockchains } from '@/domain/connect'
import { useAppState } from '@/contexts/appState'
import { createFromEVMAccount } from '@aleph-sdk/superfluid'
import { useExecutableStatus } from './useExecutableStatus'
import {
  UseRequestExecutableLogsFeedReturn,
  useRequestExecutableLogsFeed,
} from './useRequestEntity/useRequestExecutableLogsFeed'
import {
  stepsCatalog,
  useCheckoutNotification,
} from '../form/useCheckoutNotification'
import { EntityAddAction } from '@/store/entity'
import { useDispatchDeleteEntityAction } from './useDeleteEntityAction'
import { useRouter } from 'next/router'
import { isAccountPAYGCompatible } from '@/domain/account'
import { EVMAccount } from '@aleph-sdk/evm'
import { StaticEVMAccount } from '@/domain/connect/staticEVMAccount'
import { NAVIGATION_URLS } from '@/helpers/constants'

export type UseExecutableActionsProps = {
  executable?: Executable
  manager?: ExecutableManager<any>
  subscribeLogs?: boolean
}

export type NodeDetails = {
  name: string
  url: string
  version: string
}

export type UseExecutableActionsReturn = {
  logs: UseRequestExecutableLogsFeedReturn
  nodeDetails?: NodeDetails
  status?: ExecutableStatus
  calculatedStatus: ExecutableCalculatedStatus
  isAllocated: boolean
  stopDisabled: boolean
  startDisabled: boolean
  rebootDisabled: boolean
  deleteDisabled: boolean
  logsDisabled: boolean
  stopLoading: boolean
  startLoading: boolean
  rebootLoading: boolean
  deleteLoading: boolean
  streamDetails?: StreamPaymentDetails
  handleStop: () => void
  handleStart: () => void
  handleReboot: () => void
  handleDelete: () => void
}

export function useExecutableActions({
  manager,
  executable,
  subscribeLogs,
}: UseExecutableActionsProps): UseExecutableActionsReturn {
  const isPAYG = executable?.payment?.type === PaymentType.superfluid
  const executableId = executable?.id

  const { status, calculatedStatus, triggerBoostPolling } = useExecutableStatus(
    {
      executable,
      manager,
    },
  )

  // ----------------------------

  const [state, dispatch] = useAppState()
  const { account, blockchain } = state.connection
  const { dispatchDeleteEntity } = useDispatchDeleteEntityAction({
    entityName: executable?.type || '',
  })

  // ----------------------------

  const noti = useNotification()
  const [crn, setCRN] = useState<CRNSpecs>()

  // Loading states
  const [stopLoading, setStopLoading] = useState(false)
  const [startLoading, setStartLoading] = useState(false)
  const [rebootLoading, setRebootLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setCRN(undefined)

      if (!manager) return
      if (!executable) return

      const node = await manager.getAllocationCRN(executable)
      if (cancelled) return

      setCRN(node)
    }

    load()

    return () => {
      cancelled = true
    }
  }, [executable, manager])

  const nodeDetails = useMemo(() => {
    if (!crn) return
    return {
      name: crn.name || crn.hash,
      url: crn.address || '',
      version: crn.version || 'unknown',
    }
  }, [crn])

  const nodeUrl = useMemo(() => {
    const { url = '' } = nodeDetails || {}
    return NodeManager.normalizeUrl(url)
  }, [nodeDetails])

  // ----------------------------

  const checkNetworkCompatibility = useCallback(
    (requiredBlockchain?: BlockchainId): string | undefined => {
      if (!requiredBlockchain || requiredBlockchain === blockchain)
        return undefined

      const networkInfo = blockchains[requiredBlockchain]
      return networkInfo?.name || requiredBlockchain.toString()
    },
    [blockchain],
  )

  const handleSendOperation = useCallback(
    async (
      operation: ExecutableOperations,
      setLoading?: (loading: boolean) => void,
      expectedStatuses?: ExecutableCalculatedStatus[],
    ) => {
      try {
        if (!manager) throw Err.ConnectYourWallet
        if (!nodeUrl) throw Err.InvalidNode
        if (!executableId) throw Err.InvalidNode

        setLoading?.(true)

        await manager.sendPostOperation({
          hostname: nodeUrl,
          operation,
          vmId: executableId,
        })

        triggerBoostPolling({
          expectedStatuses,
          onComplete: () => setLoading?.(false),
        })
      } catch (e) {
        setLoading?.(false)
        noti?.add({
          variant: 'error',
          title: 'Error',
          text: (e as Error)?.message,
        })
      }
    },
    [manager, nodeUrl, noti, executableId, triggerBoostPolling],
  )

  const handleStart = useCallback(async () => {
    if (!manager) throw Err.ConnectYourWallet
    if (!executable) throw Err.InstanceNotFound
    if (!isPAYG) throw Err.StreamNotSupported

    try {
      setStartLoading(true)

      const instanceNetwork = executable.payment?.chain
      const incompatibleNetwork = checkNetworkCompatibility(instanceNetwork)

      if (incompatibleNetwork) {
        throw Err.NetworkMismatch(incompatibleNetwork)
      }

      if (isPAYG && !isAccountPAYGCompatible(account)) {
        throw Err.ConnectYourPaymentWallet
      }

      if (!crn) throw Err.ConnectYourPaymentWallet

      // For PAYG, notify CRN
      if (isPAYG) {
        await manager.notifyCRNAllocation(crn, executable.id)
      }

      triggerBoostPolling({
        expectedStatuses: ['running'],
        onComplete: () => setStartLoading(false),
      })
    } catch (e) {
      setStartLoading(false)
      noti?.add({
        variant: 'error',
        title: 'Error',
        text: (e as Error)?.message,
      })
    }
  }, [
    crn,
    executable,
    isPAYG,
    manager,
    noti,
    checkNetworkCompatibility,
    account,
    triggerBoostPolling,
  ])

  const isAllocated = !!status?.ipv6Parsed

  const stopDisabled = useMemo(() => {
    if (!isPAYG || !crn) return true

    switch (calculatedStatus) {
      case 'v1':
        return !isAllocated
      case 'running':
        return false
      default:
        return true
    }
  }, [calculatedStatus, crn, isAllocated, isPAYG])

  const startDisabled = useMemo(() => {
    if (!crn) return true

    switch (calculatedStatus) {
      case 'v1':
        return isAllocated
      case 'stopped':
        return false
      case 'not-allocated':
        return false
      default:
        return true
    }
  }, [calculatedStatus, crn, isAllocated])

  const rebootDisabled = useMemo(() => {
    if (!crn) return true

    switch (calculatedStatus) {
      case 'v1':
        return !isAllocated
      case 'running':
        return false
      default:
        return true
    }
  }, [calculatedStatus, crn, isAllocated])

  const deleteDisabled = useMemo(() => {
    return !executable
  }, [executable])

  const handleStop = useCallback(
    () =>
      handleSendOperation('stop', setStopLoading, ['stopped', 'not-allocated']),
    [handleSendOperation],
  )

  const handleReboot = useCallback(
    () => handleSendOperation('reboot', setRebootLoading),
    [handleSendOperation],
  )

  // ----------- LOGS

  const logs = useRequestExecutableLogsFeed({
    nodeUrl,
    vmId: executableId,
    subscribe: subscribeLogs,
  })

  // ----------- DELETE

  const router = useRouter()
  const { next, stop } = useCheckoutNotification({})

  const handleDelete = useCallback(async () => {
    if (!manager) throw Err.ConnectYourWallet
    if (!executable) throw Err.InstanceNotFound

    try {
      setDeleteLoading(true)

      // Check if the current network matches the instance's payment network
      const instanceNetwork = executable.chain || executable.payment?.chain
      const isPAYG = executable.payment?.type === PaymentType.superfluid

      // Use the network compatibility checker
      const incompatibleNetwork = checkNetworkCompatibility(instanceNetwork)
      if (incompatibleNetwork) {
        throw Err.NetworkMismatch(incompatibleNetwork)
      }

      // Verify account compatibility with payment type
      if (isPAYG && !isAccountPAYGCompatible(account)) {
        throw Err.ConnectYourPaymentWallet
      }

      // Create superfluid account for PAYG instances
      const superfluidAccount = isPAYG
        ? await createFromEVMAccount(account as EVMAccount)
        : undefined

      // Optimistic deletion: Remove entity from cache immediately
      dispatchDeleteEntity(executable.id)

      try {
        const iSteps = await manager.getDelSteps(executable)
        const nSteps = iSteps.map((i) => stepsCatalog[i])
        const steps = manager.delSteps(executable, superfluidAccount)

        while (true) {
          const { done } = await steps.next()
          if (done) {
            break
          }
          await next(nSteps)
        }
      } catch (deletionError) {
        // Rollback: Add entity back to cache if deletion fails
        dispatch(
          new EntityAddAction({
            name: executable.type,
            entities: [executable],
          }),
        )

        // Re-throw to trigger error handling
        throw deletionError
      }

      await router.replace(NAVIGATION_URLS.console.home)
    } catch (e) {
      console.error(e)

      const text = (e as Error).message
      const cause = (e as Error)?.cause as string | Error | undefined
      const detail = typeof cause === 'string' ? cause : cause?.message

      noti?.add({
        variant: 'error',
        title: 'Error',
        text,
        detail,
      })
    } finally {
      setDeleteLoading(false)
      await stop()
    }
  }, [
    dispatchDeleteEntity,
    dispatch,
    executable,
    manager,
    next,
    router,
    stop,
    noti,
    account,
    checkNetworkCompatibility,
  ])

  // ------------------------------

  const paymentAddress = executable?.address
  const paymentBlockchain = executable?.payment?.chain as BlockchainId

  const { data: streamDetails } = useLocalRequest({
    doRequest: async () => {
      if (!manager) return
      if (!executable) return
      if (!isPAYG) return
      if (!paymentAddress) return
      if (!paymentBlockchain) return

      // @todo: Refactor this in the sdk
      const evmAccount = new StaticEVMAccount(paymentAddress, paymentBlockchain)

      return manager.getStreamPaymentDetails(executable, evmAccount)
    },
    onSuccess: () => null,
    flushData: true,
    triggerOnMount: true,
    triggerDeps: [executable?.id, isPAYG, paymentAddress, paymentBlockchain],
  })

  // ------------------------------

  return {
    logs,
    nodeDetails,
    streamDetails,
    status,
    calculatedStatus,
    isAllocated,
    stopDisabled,
    startDisabled,
    rebootDisabled,
    deleteDisabled,
    logsDisabled: !logs,
    stopLoading,
    startLoading,
    rebootLoading,
    deleteLoading,
    handleStop,
    handleStart,
    handleReboot,
    handleDelete,
  }
}
