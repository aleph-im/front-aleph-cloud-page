import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { Volume } from '@/domain/volume'
import { useAccountVolume } from '@/hooks/common/useAccountEntity/useAccountVolume'
import { useCopyToClipboardAndNotify } from '@/hooks/common/useCopyToClipboard'
import { useVolumeManager } from '@/hooks/common/useManager/useVolumeManager'
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
      await manager.del(volume)

      dispatch({
        type: ActionTypes.delAccountVolume,
        payload: { id: volume.id },
      })

      router.replace('/dashboard')
    } catch (e) {}
  }, [manager, volume, dispatch, router])

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
