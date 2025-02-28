import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { Volume } from '@/domain/volume'
import { useVolumeManager } from '@/hooks/common/useManager/useVolumeManager'
import { useAppState } from '@/contexts/appState'
import { useRequestVolumes } from '@/hooks/common/useRequestEntity/useRequestVolumes'
import { EntityDelAction } from '@/store/entity'
import Err from '@/helpers/errors'
import {
  stepsCatalog,
  useCheckoutNotification,
} from '@/hooks/form/useCheckoutNotification'
import { useCopyToClipboardAndNotify } from '@aleph-front/core'

export type ManageVolume = {
  volume?: Volume
  handleDelete: () => void
  handleDownload: () => void
  handleCopyHash: () => void
  handleBack: () => void
}

export function useManageVolume(): ManageVolume {
  const [, dispatch] = useAppState()

  const router = useRouter()
  const { hash } = router.query

  const { entities } = useRequestVolumes({ ids: hash as string })
  const [volume] = entities || []

  const manager = useVolumeManager()
  const { next, stop, noti } = useCheckoutNotification({})

  const handleCopyHash = useCopyToClipboardAndNotify(volume?.id || '')

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
      console.error(e)

      const text = (e as Error).message
      const cause = (e as Error)?.cause as string | Error | undefined
      const detail = typeof cause === 'string' ? cause : cause?.message

      noti?.add({
        variant: 'error',
        title: 'Error',
        text,
        detail,
      })
    } finally {
      await stop()
    }
  }, [dispatch, manager, volume, next, router, stop, noti])

  const handleDownload = useCallback(async () => {
    if (!manager) throw Err.ConnectYourWallet
    if (!volume) throw Err.WebsiteNotFound

    await manager.download(volume)
  }, [manager, volume])

  const handleBack = () => {
    router.push('/storage/')
  }

  return {
    volume,
    handleDelete,
    handleDownload,
    handleCopyHash,
    handleBack,
  }
}
