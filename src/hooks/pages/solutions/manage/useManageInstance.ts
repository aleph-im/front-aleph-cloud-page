import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import { Instance, InstanceStatus } from '@/domain/instance'
import { useCopyToClipboardAndNotify } from '@/hooks/common/useCopyToClipboard'
import { useCopyHash } from '@/hooks/common/useCopyHash'
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

export type ManageInstance = {
  instance?: Instance
  status?: InstanceStatus
  handleCopyHash: () => void
  handleCopyConnect: () => void
  handleCopyIpv6: () => void
  handleDelete: () => void
  copyAndNotify: (text: string) => void
  mappedKeys: (SSHKey | undefined)[]
}

export function useManageInstance(): ManageInstance {
  const [state, dispatch] = useAppState()
  const { account, blockchain } = state.connection

  const { handleConnect } = useConnection({
    triggerOnMount: false,
  })

  const router = useRouter()
  const { hash } = router.query

  const { entities } = useRequestInstances({ id: hash as string })
  const [instance] = entities || []

  const [mappedKeys, setMappedKeys] = useState<(SSHKey | undefined)[]>([])
  const [, copyAndNotify] = useCopyToClipboardAndNotify()

  const status = useInstanceStatus(instance)

  const manager = useInstanceManager()
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

  const handleCopyHash = useCopyHash(instance)

  const handleCopyConnect = useCallback(() => {
    copyAndNotify(`ssh root@${status?.vm_ipv6}`)
  }, [copyAndNotify, status])

  const handleCopyIpv6 = useCallback(() => {
    copyAndNotify(status?.vm_ipv6 || '')
  }, [copyAndNotify, status])

  const handleDelete = useCallback(async () => {
    if (!manager) throw Err.ConnectYourWallet
    if (!instance) throw Err.InstanceNotFound

    try {
      let superfluidAccount
      if (instance.payment?.type === PaymentType.superfluid) {
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
      } else {
        handleConnect({ blockchain: BlockchainId.ETH })
      }

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
  }, [
    manager,
    instance,
    blockchain,
    account,
    dispatch,
    router,
    handleConnect,
    next,
    stop,
  ])

  return {
    instance,
    status,
    handleCopyHash,
    handleCopyConnect,
    handleCopyIpv6,
    handleDelete,
    copyAndNotify,
    mappedKeys,
  }
}
