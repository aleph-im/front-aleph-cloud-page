import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { Volume } from '@/domain/volume'
import { useCopyHash } from '@/hooks/common/useCopyHash'
import { useVolumeManager } from '@/hooks/common/useManager/useVolumeManager'
import { useAppState } from '@/contexts/appState'
import { useRequestVolumes } from '@/hooks/common/useRequestEntity/useRequestVolumes'
import { EntityDelAction } from '@/store/entity'
import Err from '@/helpers/errors'
import {
  stepsCatalog,
  useCheckoutNotification,
} from '@/hooks/form/useCheckoutNotification'

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

  const manager = useVolumeManager()
  const { next, stop } = useCheckoutNotification({})

  const handleCopyHash = useCopyHash(volume)

  const handleDelete = useCallback(async () => {
    if (!manager) throw Err.ConnectYourWallet
    if (!volume) throw Err.WebsiteNotFound

    const iSteps = await manager.getDelSteps(volume)
    const nSteps = iSteps.map((i) => stepsCatalog[i])
    const steps = manager.delSteps(volume)

    try {
      while (true) {
        const { done } = await steps.next()
        if (done) {
          break
        }
        await next(nSteps)
      }

      dispatch(new EntityDelAction({ name: 'volume', keys: [volume.id] }))

      await router.replace('/')
    } catch (e) {
    } finally {
      await stop()
    }
  }, [dispatch, manager, volume, next, router, stop])

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
