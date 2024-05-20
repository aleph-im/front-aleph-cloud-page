import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { Website } from '@/domain/website'
import { useCopyToClipboardAndNotify } from '@/hooks/common/useCopyToClipboard'
import { useWebsiteManager } from '@/hooks/common/useManager/useWebsiteManager'
import { useAppState } from '@/contexts/appState'
import { useHashToEntity } from './useHashToEntity'
import { Volume } from '@/domain/volume'
import { useRequestWebsites } from '@/hooks/common/useRequestEntity/useRequestWebsites'
import { EntityDelAction } from '@/store/entity'
import {
  stepsCatalog,
  useCheckoutNotification,
} from '@/hooks/form/useCheckoutNotification'
import Err from '@/helpers/errors'

export type ManageWebsite = {
  website?: Website
  refVolume?: Volume
  handleCopyHash: () => void
  handleDelete: () => void
  //handleDownload: () => void
}

export function useManageWebsite(): ManageWebsite {
  const [, dispatch] = useAppState()

  const router = useRouter()
  const { hash } = router.query

  const { entities } = useRequestWebsites({ id: hash as string })
  const [website] = entities || []

  const [, copyAndNotify] = useCopyToClipboardAndNotify()

  const refVolume = useHashToEntity(website?.volume_id) as Volume

  const manager = useWebsiteManager()
  const { next, stop } = useCheckoutNotification({})

  const handleCopyHash = useCallback(() => {
    copyAndNotify(website?.id || '')
  }, [copyAndNotify, website])

  const handleDelete = useCallback(async () => {
    if (!manager) throw Err.ConnectYourWallet
    if (!website) throw Err.WebsiteNotFound

    const iSteps = await manager.getDelSteps(website)
    const nSteps = iSteps.map((i) => stepsCatalog[i])
    const steps = manager.addDelSteps(website)

    try {
      let accountWebsite

      while (!accountWebsite) {
        const { done } = await steps.next()
        if (done) {
          break
        }
        await next(nSteps)
      }

      dispatch(new EntityDelAction({ name: 'website', keys: [website.id] }))

      await router.replace('/')
    } catch (e) {
    } finally {
      await stop()
    }
  }, [dispatch, manager, website, next, router, stop])

  /* const handleDownload = useCallback(async () => {
    if (!manager) throw Err.ConnectYourWallet
    if (!website) throw Err.WebsiteNotFound

    //TODO: Implement download for websites
    await manager.download(website)
  }, [manager, website]) */

  return {
    website,
    refVolume,
    handleCopyHash,
    handleDelete,
    //handleDownload
  }
}
