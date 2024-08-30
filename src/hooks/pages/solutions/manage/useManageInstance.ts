import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Instance, InstanceStatus } from '@/domain/instance'
import { useInstanceManager } from '@/hooks/common/useManager/useInstanceManager'
import { useAppState } from '@/contexts/appState'
import { useInstanceStatus } from '@/hooks/common/useInstanceStatus'
import { useSSHKeyManager } from '@/hooks/common/useManager/useSSHKeyManager'
import { SSHKey } from '@/domain/ssh'
import {
  createFromEVMAccount,
  isAccountSupported as isAccountPAYGCompatible,
  isBlockchainSupported as isBlockchainPAYGCompatible,
} from '@aleph-sdk/superfluid'
import { useConnection } from '@/hooks/common/useConnection'
import { PaymentType } from '@aleph-sdk/message'
import { useRequestInstances } from '@/hooks/common/useRequestEntity/useRequestInstances'
import { EntityDelAction } from '@/store/entity'
import {
  stepsCatalog,
  useCheckoutNotification,
} from '@/hooks/form/useCheckoutNotification'
import Err from '@/helpers/errors'
import { BlockchainId } from '@/domain/connect/base'
import { useCopyToClipboardAndNotify, useNotification } from '@aleph-front/core'
import { useNodeManager } from '@/hooks/common/useManager/useNodeManager'
import { CRN } from '@/domain/node'
import { EVMAccount } from '@aleph-sdk/evm'

export type ManageInstance = {
  instance?: Instance
  status?: InstanceStatus
  mappedKeys: (SSHKey | undefined)[]
  crn?: CRN
  nodeDetails?: { name: string; url: string }
  handleRetryAllocation: () => void
  handleCopyHash: () => void
  handleCopyConnect: () => void
  handleCopyIpv6: () => void
  handleDelete: () => void
  handleBack: () => void
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
  const handleCopyIpv6 = useCopyToClipboardAndNotify(status?.vm_ipv6 || '')
  const handleCopyConnect = useCopyToClipboardAndNotify(
    `ssh root@${status?.vm_ipv6}`,
  )

  const manager = useInstanceManager()
  const nodeManager = useNodeManager()
  const sshKeyManager = useSSHKeyManager()
  const { next, stop } = useCheckoutNotification({})

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
    if (!instance) return

    if (instance.payment?.type === PaymentType.superfluid) {
      if (
        !isBlockchainPAYGCompatible(blockchain) ||
        !isAccountPAYGCompatible(account)
      ) {
        handleConnect({ blockchain: BlockchainId.BASE })
        throw Err.InvalidNetwork
      }

      return await createFromEVMAccount(account as EVMAccount)
    } else if (blockchain !== BlockchainId.ETH) {
      handleConnect({ blockchain: BlockchainId.ETH })
      throw Err.ConnectYourPaymentWallet
    }
  }, [account, blockchain, handleConnect, instance])

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
    async function load() {
      try {
        if (!nodeManager) throw new Error()
        if (!instance) throw new Error()
        if (instance.payment?.type !== PaymentType.superfluid) throw new Error()

        const { receiver } = instance.payment || {}
        if (!receiver) throw new Error()

        const node = await nodeManager.getCRNByStreamRewardAddress(receiver)
        setCRN(node)
      } catch {
        setCRN(undefined)
      }
    }
    load()
  }, [instance, nodeManager])

  const handleRetryAllocation = useCallback(async () => {
    if (!manager) throw Err.ConnectYourWallet
    if (!instance) throw Err.InstanceNotFound

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
  }, [crn, handleEnsureNetwork, instance, manager, noti])

  const nodeDetails = useMemo(() => {
    if (status?.node) {
      return {
        name: status.node.node_id,
        url: status.node.url,
      }
    }
    if (crn) {
      return {
        name: crn.name || crn.hash,
        url: crn.address || '',
      }
    }
  }, [crn, status?.node])

  const handleBack = () => {
    router.push('.')
  }

  return {
    instance,
    status,
    mappedKeys,
    crn,
    nodeDetails,
    handleRetryAllocation,
    handleCopyHash,
    handleCopyConnect,
    handleCopyIpv6,
    handleDelete,
    handleBack,
  }
}
