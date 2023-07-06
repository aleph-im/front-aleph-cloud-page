import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { useAppState } from '@/contexts/appState'
import { Volume, VolumeManager } from '@/domain/volume'
import { useAccountVolume } from '@/hooks/common/useAccountVolume'
import { useCopyToClipboardAndNotify } from '@/hooks/common/useCopyToClipboard'
import { useRequestState } from '@/hooks/common/useRequestState'

export type ManageVolume = {
  volume?: Volume
  handleCopyHash: () => void
  handleDelete: () => void
  handleDownload: () => void
}

export function useManageVolume(): ManageVolume {
  const router = useRouter()
  const { hash } = router.query

  const [globalState] = useAppState()
  const [volume] = useAccountVolume(hash as string)
  const [, { onLoad, onSuccess, onError }] = useRequestState()

  const { account } = globalState

  const [, copyAndNotify] = useCopyToClipboardAndNotify()

  const handleCopyHash = useCallback(() => {
    copyAndNotify(volume?.id || '')
  }, [copyAndNotify, volume])

  const handleDelete = useCallback(async () => {
    if (!account) throw new Error('Invalid account')
    if (!volume) throw new Error('Invalid volume')

    try {
      onLoad()

      const volumeStore = new VolumeManager(account)
      await volumeStore.del(volume)

      onSuccess(true)
      router.replace('/dashboard')
    } catch (e) {
      onError(e as Error)
    }
  }, [account, volume, router, onError, onLoad, onSuccess])

  const handleDownload = useCallback(async () => {
    if (!account) throw new Error('Invalid account')
    if (!volume) throw new Error('Invalid volume')

    const volumeStore = new VolumeManager(account)
    await volumeStore.download(volume)
  }, [account, volume])

  return {
    volume,
    handleCopyHash,
    handleDelete,
    handleDownload,
  }
}
