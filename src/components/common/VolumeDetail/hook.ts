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
import { DefaultTheme, useTheme } from 'styled-components'

export type UseVolumeDetailReturn = {
  theme: DefaultTheme
  volume?: Volume
  handleDownload: () => void
  handleCopyHash: () => void
  handleDelete: () => void
}

export type UseVolumeDetailProps = {
  volumeId: string
}

export function useVolumeDetail({
  volumeId,
}: UseVolumeDetailProps): UseVolumeDetailReturn {
  const theme = useTheme()
  const [, dispatch] = useAppState()
  const router = useRouter()

  const { entities } = useRequestVolumes({ ids: volumeId })
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

      await router.replace('/console')
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
  }, [manager, volume, dispatch, router, next, noti, stop])

  const handleDownload = useCallback(async () => {
    if (!manager) throw Err.ConnectYourWallet
    if (!volume) throw Err.WebsiteNotFound

    await manager.download(volume)
  }, [manager, volume])

  return {
    volume,
    theme,
    handleDelete,
    handleDownload,
    handleCopyHash,
  }
}
