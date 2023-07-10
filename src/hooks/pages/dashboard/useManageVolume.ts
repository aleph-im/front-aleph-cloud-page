import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { Volume } from '@/domain/volume'
import { useAccountVolume } from '@/hooks/common/useAccountVolume'
import { useCopyToClipboardAndNotify } from '@/hooks/common/useCopyToClipboard'
import { useRequestState } from '@/hooks/common/useRequestState'
import { useVolumeManager } from '@/hooks/common/useVolumeManager'

export type ManageVolume = {
  volume?: Volume
  handleCopyHash: () => void
  handleDelete: () => void
  handleDownload: () => void
}

export function useManageVolume(): ManageVolume {
  const router = useRouter()
  const { hash } = router.query

  const [volume] = useAccountVolume(hash as string)
  const [, { onLoad, onSuccess, onError }] = useRequestState()
  const [, copyAndNotify] = useCopyToClipboardAndNotify()

  const manager = useVolumeManager()

  const handleCopyHash = useCallback(() => {
    copyAndNotify(volume?.id || '')
  }, [copyAndNotify, volume])

  const handleDelete = useCallback(async () => {
    if (!manager) throw new Error('Manager not ready')
    if (!volume) throw new Error('Invalid volume')

    try {
      onLoad()

      await manager.del(volume)

      onSuccess(true)
      router.replace('/dashboard')
    } catch (e) {
      onError(e as Error)
    }
  }, [manager, volume, router, onError, onLoad, onSuccess])

  const handleDownload = useCallback(async () => {
    if (!manager) throw new Error('Manager not ready')
    if (!volume) throw new Error('Invalid volume')

    await manager.download(volume)
  }, [manager, volume])

  return {
    volume,
    handleCopyHash,
    handleDelete,
    handleDownload,
  }
}
