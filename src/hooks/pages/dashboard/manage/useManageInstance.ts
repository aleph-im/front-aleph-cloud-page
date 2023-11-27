import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import { Instance, InstanceStatus } from '@/domain/instance'
import { useAccountInstance } from '@/hooks/common/useAccountEntity/useAccountInstance'
import { useCopyToClipboardAndNotify } from '@/hooks/common/useCopyToClipboard'
import { useRequestState } from '@/hooks/common/useRequestState'
import { useInstanceManager } from '@/hooks/common/useManager/useInstanceManager'
import { useAppState } from '@/contexts/appState'
import { ActionTypes } from '@/helpers/store'
import { useInstanceStatus } from '@/hooks/common/useInstanceStatus'
import { useSSHKeyManager } from '@/hooks/common/useManager/useSSHKeyManager'
import { SSHKey } from '@/domain/ssh'
import { useTrustedOperation } from '@/hooks/common/useTrustedOperation'

export type ManageInstance = {
  instance?: Instance
  status?: InstanceStatus
  handleCopyHash: () => void
  handleCopyConnect: () => void
  handleCopyIpv6: () => void
  handleDelete: () => void
  handleStop: () => void
  copyAndNotify: (text: string) => void
  mappedKeys: (SSHKey | undefined)[]
}

export function useManageInstance(): ManageInstance {
  const router = useRouter()
  const { hash } = router.query

  const [mappedKeys, setMappedKeys] = useState<(SSHKey | undefined)[]>([])
  const [instance] = useAccountInstance({ id: hash as string })
  const [, { onLoad, onSuccess, onError }] = useRequestState()
  const [, copyAndNotify] = useCopyToClipboardAndNotify()
  const [, dispatch] = useAppState()

  const status = useInstanceStatus(instance)

  const manager = useInstanceManager()
  const sshKeyManager = useSSHKeyManager()
  const { stopMachine } = useTrustedOperation()

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
      onLoad()

      await manager.del(instance)

      dispatch({
        type: ActionTypes.delAccountInstance,
        payload: { id: instance.id },
      })

      onSuccess(true)

      router.replace('/dashboard')
    } catch (e) {
      onError(e as Error)
    }
  }, [instance, manager, onLoad, dispatch, onSuccess, router, onError])

  const handleStop = useCallback(async () => {
    if (!instance) throw new Error('Invalid function')
    if (!manager) throw new Error('Manager not ready')
    if (!status?.vm_ipv6) throw new Error('Invalid VM IPv6 address')

    stopMachine(status.vm_ipv6, instance.id)
  }, [])

  return {
    instance,
    status,
    handleCopyHash,
    handleCopyConnect,
    handleCopyIpv6,
    handleDelete,
    handleStop,
    copyAndNotify,
    mappedKeys,
  }
}
