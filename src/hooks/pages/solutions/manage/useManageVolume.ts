import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { Volume } from '@/domain/volume'
import { useCopyToClipboardAndNotify } from '@/hooks/common/useCopyToClipboard'
import { useVolumeManager } from '@/hooks/common/useManager/useVolumeManager'
import { useAppState } from '@/contexts/appState'
import { useRequestVolumes } from '@/hooks/common/useRequestEntity/useRequestVolumes'
import { EntityDelAction } from '@/store/entity'
import Err from '@/helpers/errors'

export type ManageVolume = {
  volume?: Volume
  handleCopyHash: () => void
  handleDelete: () => void
  handleDownload: () => void
}

export function useManageVolume(): ManageVolume {
  const [, dispatch] = useAppState()

  const router = useRouter()
  const { hash } = router.query

  const { entities } = useRequestVolumes({ id: hash as string })
  const [volume] = entities || []

  const [, copyAndNotify] = useCopyToClipboardAndNotify()

  const manager = useVolumeManager()

  const handleCopyHash = useCallback(() => {
    copyAndNotify(volume?.id || '')
  }, [copyAndNotify, volume])

  const handleDelete = useCallback(async () => {
    if (!manager) throw Err.ConnectYourWallet
    if (!volume) throw Err.WebsiteNotFound

    try {
      await manager.del(volume)

      dispatch(new EntityDelAction({ name: 'volume', keys: [volume.id] }))

      await router.replace('/')
    } catch (e) {}
  }, [manager, volume, dispatch, router])

  const handleDownload = useCallback(async () => {
    if (!manager) throw Err.ConnectYourWallet
    if (!volume) throw Err.WebsiteNotFound

    await manager.download(volume)
  }, [manager, volume])

  return {
    volume,
    handleCopyHash,
    handleDelete,
    handleDownload,
  }
}
