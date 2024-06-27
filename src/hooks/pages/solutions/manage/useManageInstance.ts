import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Instance, InstanceStatus } from '@/domain/instance'
import { useInstanceManager } from '@/hooks/common/useManager/useInstanceManager'
import { useAppState } from '@/contexts/appState'
import { useInstanceStatus } from '@/hooks/common/useInstanceStatus'
import { useSSHKeyManager } from '@/hooks/common/useManager/useSSHKeyManager'
import { SSHKey } from '@/domain/ssh'
import { createFromAvalancheAccount } from '@aleph-sdk/superfluid'
import { useConnection } from '@/hooks/common/useConnection'
import { PaymentType } from '@aleph-sdk/message'
import { AvalancheAccount } from '@aleph-sdk/avalanche'
import { useRequestInstances } from '@/hooks/common/useRequestEntity/useRequestInstances'
import { EntityDelAction } from '@/store/entity'
import {
  stepsCatalog,
  useCheckoutNotification,
} from '@/hooks/form/useCheckoutNotification'
import Err from '@/helpers/errors'
import { BlockchainId } from '@/domain/connect/base'
import { useCopyToClipboardAndNotify, useNotification } from '@aleph-front/core'
import { CRN, NodeManager } from '@/domain/node'
import { ExecutableOperations } from '@/domain/executable'
// import { useRequestExecutableLogsFeed } from '@/hooks/common/useRequestEntity/useRequestExecutableLogsFeed'

export type ManageInstance = {
  instance?: Instance
  status?: InstanceStatus
  mappedKeys: (SSHKey | undefined)[]
  nodeDetails?: { name: string; url: string }
  logs: string
  isRunning: boolean
  stopDisabled: boolean
  startDisabled: boolean
  rebootDisabled: boolean
  handleStop: () => void
  handleStart: () => void
  handleReboot: () => void
  handleCopyHash: () => void
  handleCopyConnect: () => void
  handleCopyIpv6: () => void
  handleDelete: () => void
}

export function useManageInstance(): ManageInstance {
  const [state, dispatch] = useAppState()
  const { account, blockchain } = state.connection

  const { handleConnect } = useConnection({
    triggerOnMount: false,
  })

  const router = useRouter()
  const { hash } = router.query

  const { entities } = useRequestInstances({ ids: hash as string })
  const [instance] = entities || []

  const [mappedKeys, setMappedKeys] = useState<(SSHKey | undefined)[]>([])
  const status = useInstanceStatus(instance)

  const handleCopyHash = useCopyToClipboardAndNotify(instance?.id || '')
  const handleCopyIpv6 = useCopyToClipboardAndNotify(status?.ipv6Parsed || '')
  const handleCopyConnect = useCopyToClipboardAndNotify(
    `ssh root@${status?.ipv6Parsed}`,
  )

  const manager = useInstanceManager()
  const sshKeyManager = useSSHKeyManager()
  const { next, stop } = useCheckoutNotification({})

  const isPAYG = instance?.payment?.type === PaymentType.superfluid
  const instanceId = instance?.id

  useEffect(() => {
    if (!instance || !sshKeyManager) return
    const getMapped = async () => {
      const mapped = await sshKeyManager?.getByValues(
        instance.authorized_keys || [],
      )
      setMappedKeys(mapped)
    }

    getMapped()
  }, [sshKeyManager, instance])

  const handleEnsureNetwork = useCallback(async () => {
    let superfluidAccount
    if (!instance) return

    if (isPAYG) {
      if (
        blockchain !== BlockchainId.AVAX ||
        !(account instanceof AvalancheAccount)
      ) {
        handleConnect({ blockchain: BlockchainId.AVAX })
        throw Err.ConnectYourPaymentWallet
      }
      // @note: refactor in SDK calling init inside this method
      superfluidAccount = createFromAvalancheAccount(account)
      await superfluidAccount.init()

      return superfluidAccount
    } else if (blockchain !== BlockchainId.ETH) {
      handleConnect({ blockchain: BlockchainId.ETH })
      throw Err.ConnectYourPaymentWallet
    }
  }, [account, blockchain, handleConnect, instance, isPAYG])

  const handleDelete = useCallback(async () => {
    if (!manager) throw Err.ConnectYourWallet
    if (!instance) throw Err.InstanceNotFound

    try {
      const superfluidAccount = await handleEnsureNetwork()

      const iSteps = await manager.getDelSteps(instance)
      const nSteps = iSteps.map((i) => stepsCatalog[i])
      const steps = manager.delSteps(instance, superfluidAccount)

      while (true) {
        const { done } = await steps.next()
        if (done) {
          break
        }
        await next(nSteps)
      }

      dispatch(new EntityDelAction({ name: 'instance', keys: [instance.id] }))

      await router.replace('/')
    } catch (e) {
    } finally {
      await stop()
    }
  }, [dispatch, handleEnsureNetwork, instance, manager, next, router, stop])

  const noti = useNotification()

  const [crn, setCRN] = useState<CRN>()

  useEffect(() => {
    let cancelled = false

    async function load() {
      setCRN(undefined)

      if (!manager) return
      if (!instance) return

      const node = await manager.getAllocationCRN(instance)
      if (cancelled) return

      setCRN(node)
    }

    load()

    return () => {
      cancelled = true
    }
  }, [instance, manager])

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

  const handleSendOperation = useCallback(
    async (operation: ExecutableOperations) => {
      try {
        if (!manager) throw Err.ConnectYourWallet
        if (!nodeUrl) throw Err.InvalidNode
        if (!instanceId) throw Err.InvalidNode

        const keyPair = await manager.getKeyPair()
        const authPubkey = await manager.getAuthPubkeyToken({
          url: nodeUrl,
          keyPair,
        })

        await manager.sendPostOperation({
          hostname: nodeUrl,
          operation,
          keyPair,
          authPubkey,
          vmId: instanceId,
        })
      } catch (e) {
        noti?.add({
          variant: 'error',
          title: 'Error',
          text: (e as Error)?.message,
        })
      }
    },
    [manager, nodeUrl, noti, instanceId],
  )

  const handleRetryAllocation = useCallback(async () => {
    if (!manager) throw Err.ConnectYourWallet
    if (!instance) throw Err.InstanceNotFound
    if (!isPAYG) throw Err.StreamNotSupported

    try {
      await handleEnsureNetwork()
      if (!crn) throw Err.ConnectYourPaymentWallet

      await manager.notifyCRNExecution(crn, instance.id)
    } catch (e) {
      noti?.add({
        variant: 'error',
        title: 'Error',
        text: (e as Error)?.message,
      })
    }
  }, [crn, handleEnsureNetwork, instance, isPAYG, manager, noti])

  const isRunning = !!status?.ipv6Parsed

  const stopDisabled = !isPAYG || !isRunning || !crn
  const startDisabled = !isPAYG || isRunning || !crn
  const rebootDisabled = !isRunning || !crn

  const handleStop = useCallback(
    () => handleSendOperation('stop'),
    [handleSendOperation],
  )

  const handleStart = handleRetryAllocation

  const handleReboot = useCallback(
    () => handleSendOperation('reboot'),
    [handleSendOperation],
  )

  // const { logs } = useRequestExecutableLogsFeed({ nodeUrl, vmId: instanceId })
  const logs = ''

  return {
    instance,
    status,
    mappedKeys,
    nodeDetails,
    logs,
    isRunning,
    stopDisabled,
    startDisabled,
    rebootDisabled,
    handleStop,
    handleStart,
    handleReboot,
    handleCopyHash,
    handleCopyConnect,
    handleCopyIpv6,
    handleDelete,
  }
}
