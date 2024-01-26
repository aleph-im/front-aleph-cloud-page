import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import { Instance, InstanceStatus } from '@/domain/instance'
import { useAccountInstance } from '@/hooks/common/useAccountEntity/useAccountInstance'
import { useCopyToClipboardAndNotify } from '@/hooks/common/useCopyToClipboard'
import { useInstanceManager } from '@/hooks/common/useManager/useInstanceManager'
import { useAppState } from '@/contexts/appState'
import { ActionTypes } from '@/helpers/store'
import { useInstanceStatus } from '@/hooks/common/useInstanceStatus'
import { useSSHKeyManager } from '@/hooks/common/useManager/useSSHKeyManager'
import { SSHKey } from '@/domain/ssh'
import { useConnect } from '@/hooks/common/useConnect'
import { Chain } from 'aleph-sdk-ts/dist/messages/types'
import { SuperfluidAccount } from 'aleph-sdk-ts/dist/accounts/superfluid'

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
  const { account, switchNetwork, selectedNetwork } = useConnect()
  const router = useRouter()
  const { hash } = router.query

  const [mappedKeys, setMappedKeys] = useState<(SSHKey | undefined)[]>([])
  const [instance] = useAccountInstance({ id: hash as string })
  const [, copyAndNotify] = useCopyToClipboardAndNotify()
  const [, dispatch] = useAppState()

  const status = useInstanceStatus(instance)

  const manager = useInstanceManager()
  const sshKeyManager = useSSHKeyManager()

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

  const handleCopyHash = useCallback(() => {
    copyAndNotify(instance?.id || '')
  }, [copyAndNotify, instance])

  const handleCopyConnect = useCallback(() => {
    copyAndNotify(`ssh root@${status?.vm_ipv6}`)
  }, [copyAndNotify, status])

  const handleCopyIpv6 = useCallback(() => {
    copyAndNotify(status?.vm_ipv6 || '')
  }, [copyAndNotify, status])

  const handleDelete = useCallback(async () => {
    if (!instance) throw new Error('Invalid function')
    if (!manager) throw new Error('Manager not ready')

    try {
      let superfluidAccount
      if (selectedNetwork !== Chain.AVAX) {
        const account = await switchNetwork(Chain.AVAX)
        superfluidAccount = account as SuperfluidAccount
      } else {
        superfluidAccount = account as SuperfluidAccount
      }
      await manager.del(instance, superfluidAccount)

      dispatch({
        type: ActionTypes.delAccountInstance,
        payload: { id: instance.id },
      })

      await router.replace('/')
    } catch (e) {}
  }, [
    instance,
    manager,
    selectedNetwork,
    dispatch,
    router,
    switchNetwork,
    account,
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
