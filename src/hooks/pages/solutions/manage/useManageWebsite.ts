import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import { Website, HistoryVolumes } from '@/domain/website'
import { useCopyToClipboardAndNotify } from '@/hooks/common/useCopyToClipboard'
import { useWebsiteManager } from '@/hooks/common/useManager/useWebsiteManager'
import { useAppState } from '@/contexts/appState'
import { useHashToEntity } from './useHashToEntity'
import { Volume } from '@/domain/volume'
import { useRequestWebsites } from '@/hooks/common/useRequestEntity/useRequestWebsites'
import { EntityDelAction, EntityAddAction } from '@/store/entity'
import {
  stepsCatalog,
  useCheckoutNotification,
} from '@/hooks/form/useCheckoutNotification'
import Err from '@/helpers/errors'

export type ManageWebsite = {
  website?: Website
  refVolume?: Volume
  historyVolumes?: HistoryVolumes
  handleCopyHash: () => void
  handleDelete: () => void
  handleUpdate: (cid?: string, version?: string) => void
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
  const [historyVolumes, setHistoryVolumes] = useState<
    HistoryVolumes | undefined
  >()
  const { next, stop } = useCheckoutNotification({})

  const handleCopyHash = useCallback(() => {
    copyAndNotify(website?.id || '')
  }, [copyAndNotify, website])

  const handleDelete = useCallback(async () => {
    if (!manager) throw Err.ConnectYourWallet
    if (!website) throw Err.WebsiteNotFound

    const iSteps = await manager.getDelSteps(website)
    const nSteps = iSteps.map((i) => stepsCatalog[i])
    const steps = manager.delSteps(website)

    try {
      while (true) {
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

  const handleUpdate = useCallback(
    async (cid?: string, version?: string) => {
      if (!manager) throw Err.ConnectYourWallet
      if (!website) throw Err.WebsiteNotFound

      const domains = await manager.getDomains(website)
      const iSteps = await manager.getUpdateSteps(cid, version, domains)
      const nSteps = iSteps.map((i) => stepsCatalog[i])
      const steps = manager.updateSteps(
        website,
        cid,
        version,
        domains,
        historyVolumes,
      )

      try {
        let accountWebsite
        while (!accountWebsite) {
          const { value, done } = await steps.next()
          if (done) {
            accountWebsite = value
            break
          }
          await next(nSteps)
        }

        dispatch(
          new EntityAddAction({ name: 'website', entities: accountWebsite }),
        )

        await router.replace('/')
      } catch (e) {
      } finally {
        await stop()
      }
    },
    [manager, website, historyVolumes, dispatch, router, next, stop],
  )

  /* const handleDownload = useCallback(async () => {
    if (!manager) throw Err.ConnectYourWallet
    if (!website) throw Err.WebsiteNotFound

    //TODO: Implement download for websites
    await manager.download(website)
  }, [manager, website]) */

  useEffect(() => {
    if (manager && website) {
      manager?.getHistoryVolumes(website).then(setHistoryVolumes)
    }
  }, [manager, website])

  return {
    website,
    refVolume,
    historyVolumes,
    handleCopyHash,
    handleDelete,
    handleUpdate,
    //handleDownload
  }
}
