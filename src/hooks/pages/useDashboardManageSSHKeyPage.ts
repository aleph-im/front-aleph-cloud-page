import useConnectedWard from '../useConnectedWard'
import { useAccountSSHKey } from '../useAccountSSHKey'
import { SSHKey, SSHKeyStore } from '@/helpers/ssh'
import { useRequestState } from '../useRequestState'
import { useRouter } from 'next/router'
import useCopyToClipboard from '../useCopyToClipboard'
import { useNotification } from '@aleph-front/aleph-core'
import { useCallback } from 'react'
import { useAppState } from '@/contexts/appState'

export type DashboardManageSSHKeyPage = {
  sshKey?: SSHKey
  handleCopyLabel: () => void
  handleCopyKey: () => void
  handleDelete: () => void
}

export function useDashboardManageSSHKeyPage(): DashboardManageSSHKeyPage {
  useConnectedWard()

  const router = useRouter()
  const { hash } = router.query

  const [globalState] = useAppState()
  const [sshKey] = useAccountSSHKey(hash as string)
  const [, { onLoad, onSuccess, onError }] = useRequestState()

  console.log('sshKey', sshKey)

  // Copy to clipboard

  const [, copyToClipboard] = useCopyToClipboard()
  const noti = useNotification()
  const copyAndNotify = useCallback(
    (value: string) => {
      copyToClipboard(value)

      if (!noti) return
      noti.add({
        variant: 'success',
        title: 'Copied to clipboard',
      })
    },
    [copyToClipboard, noti],
  )

  const handleCopyLabel = useCallback(() => {
    copyAndNotify(sshKey?.label || '')
  }, [copyAndNotify, sshKey])

  const handleCopyKey = useCallback(() => {
    copyAndNotify(sshKey?.key || '')
  }, [copyAndNotify, sshKey])

  const handleDelete = useCallback(async () => {
    const { account } = globalState
    if (!account) throw new Error('Invalid account')
    if (!hash) throw new Error('Invalid hash')

    try {
      onLoad()

      const sshKeyStore = new SSHKeyStore(account)
      await sshKeyStore.del(hash as string)

      onSuccess(true)
      router.replace('/dashboard')
    } catch (e) {
      onError(e as Error)
    }
  }, [globalState, hash, onError, onLoad, onSuccess, router])

  return {
    sshKey,
    handleCopyLabel,
    handleCopyKey,
    handleDelete,
  }
}
