import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { Volume } from '@/domain/volume'
import { useAccountVolume } from '@/hooks/common/useAccountVolume'
import { useCopyToClipboardAndNotify } from '@/hooks/common/useCopyToClipboard'
import { useRequestState } from '@/hooks/common/useRequestState'
import { useVolumeManager } from '@/hooks/common/useVolumeManager'
import { ActionTypes } from '@/helpers/store'
import { useAppState } from '@/contexts/appState'

export type ManageVolume = {
  volume?: Volume
  handleCopyHash: () => void
  handleDelete: () => void
  handleDownload: () => void
}

export function useManageVolume(): ManageVolume {
  const router = useRouter()
  const { hash } = router.query

  const [volume] = useAccountVolume({ id: hash as string })
  const [, { onLoad, onSuccess, onError }] = useRequestState()
  const [, copyAndNotify] = useCopyToClipboardAndNotify()
  const [, dispatch] = useAppState()

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

      dispatch({
        type: ActionTypes.delAccountVolume,
        payload: { id: volume.id },
      })

      onSuccess(true)

      router.replace('/dashboard')
    } catch (e) {
      onError(e as Error)
    }
  }, [manager, volume, onLoad, dispatch, onSuccess, router, onError])

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
