import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocalRequest, useNotification } from '@aleph-front/core'
import { CRN, NodeManager } from '@/domain/node'
import {
  Executable,
  ExecutableManager,
  ExecutableOperations,
  ExecutableStatus,
  StreamPaymentDetails,
} from '@/domain/executable'
import Err from '@/helpers/errors'
import { PaymentType } from '@aleph-sdk/message'
import { BlockchainId } from '@/domain/connect/base'
import { useAppState } from '@/contexts/appState'
import { useConnection } from './useConnection'
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
import { EntityDelAction } from '@/store/entity'
import { useRouter } from 'next/router'
import {
  isBlockchainHoldingCompatible,
  isBlockchainPAYGCompatible,
} from '@/domain/blockchain'
import { isAccountPAYGCompatible } from '@/domain/account'
import { EVMAccount } from '@aleph-sdk/evm'
import { StaticEVMAccount } from '@/domain/connect/staticEVMAccount'

export type UseExecutableActionsProps = {
  executable?: Executable
  manager?: ExecutableManager<any>
  subscribeLogs?: boolean
}

export type NodeDetails = {
  name: string
  url: string
}

export type UseExecutableActionsReturn = {
  logs: UseRequestExecutableLogsFeedReturn
  nodeDetails?: NodeDetails
  status?: ExecutableStatus
  isRunning: boolean
  stopDisabled: boolean
  startDisabled: boolean
  rebootDisabled: boolean
  logsDisabled: boolean
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

  const status = useExecutableStatus({
    executable,
    manager,
  })

  // ----------------------------

  const [state, dispatch] = useAppState()
  const { account, blockchain } = state.connection

  const { handleConnect } = useConnection({
    triggerOnMount: false,
  })

  // ----------------------------

  const noti = useNotification()
  const [crn, setCRN] = useState<CRN>()

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
    }
  }, [crn])

  const nodeUrl = useMemo(() => {
    const { url = '' } = nodeDetails || {}
    return NodeManager.normalizeUrl(url)
  }, [nodeDetails])

  // ----------------------------

  const handleEnsureNetwork = useCallback(async () => {
    if (!executable) return

    if (isPAYG) {
      if (
        !isBlockchainPAYGCompatible(blockchain) ||
        !isAccountPAYGCompatible(account)
      ) {
        handleConnect({ blockchain: BlockchainId.BASE })
        throw Err.ConnectYourPaymentWallet
      }

      return await createFromEVMAccount(account as EVMAccount)
    } else if (!isBlockchainHoldingCompatible(blockchain)) {
      handleConnect({ blockchain: BlockchainId.ETH })
      throw Err.ConnectYourPaymentWallet
    }
  }, [account, blockchain, handleConnect, executable, isPAYG])

  const handleSendOperation = useCallback(
    async (operation: ExecutableOperations) => {
      try {
        if (!manager) throw Err.ConnectYourWallet
        if (!nodeUrl) throw Err.InvalidNode
        if (!executableId) throw Err.InvalidNode

        await manager.sendPostOperation({
          hostname: nodeUrl,
          operation,
          vmId: executableId,
        })
      } catch (e) {
        noti?.add({
          variant: 'error',
          title: 'Error',
          text: (e as Error)?.message,
        })
      }
    },
    [manager, nodeUrl, noti, executableId],
  )

  const handleStart = useCallback(async () => {
    if (!manager) throw Err.ConnectYourWallet
    if (!executable) throw Err.InstanceNotFound
    if (!isPAYG) throw Err.StreamNotSupported

    try {
      await handleEnsureNetwork()
      if (!crn) throw Err.ConnectYourPaymentWallet

      await manager.notifyCRNAllocation(crn, executable.id)
    } catch (e) {
      noti?.add({
        variant: 'error',
        title: 'Error',
        text: (e as Error)?.message,
      })
    }
  }, [crn, handleEnsureNetwork, executable, isPAYG, manager, noti])

  const isRunning = !!status?.ipv6Parsed

  const stopDisabled = !isPAYG || !isRunning || !crn
  const startDisabled = !isPAYG || isRunning || !crn
  const rebootDisabled = !isRunning || !crn

  const handleStop = useCallback(
    () => handleSendOperation('stop'),
    [handleSendOperation],
  )

  const handleReboot = useCallback(
    () => handleSendOperation('reboot'),
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
      const superfluidAccount = await handleEnsureNetwork()

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

      dispatch(
        new EntityDelAction({ name: executable.type, keys: [executable.id] }),
      )

      await router.replace('/console')
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
      await stop()
    }
  }, [
    dispatch,
    handleEnsureNetwork,
    executable,
    manager,
    next,
    router,
    stop,
    noti,
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
    isRunning,
    stopDisabled,
    startDisabled,
    rebootDisabled,
    logsDisabled: !logs,
    handleStop,
    handleStart,
    handleReboot,
    handleDelete,
  }
}
