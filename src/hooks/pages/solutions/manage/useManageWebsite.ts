import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import { Website, HistoryVolumes } from '@/domain/website'
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
import { useCopyToClipboardAndNotify } from '@aleph-front/core'
import {
  UseNewWebsitePagePageReturn,
  useNewWebsitePage,
} from '../../hosting/useNewWebsitePage'
import { DefaultTheme, useTheme } from 'styled-components'
import { cidV0Tov1 } from '@/helpers/utils'

export type ManageWebsite = {
  website?: Website
  refVolume?: Volume
  historyVolumes?: HistoryVolumes
  cidV1: string
  defaultUrl: string
  state: UseNewWebsitePagePageReturn
  theme: DefaultTheme
  handleDelete: () => void
  handleUpdate: (cid?: string, version?: string) => void
  //handleDownload: () => void
  handleCopyHash: () => void
  handleCopyUrl: () => void
  handleCopyIpfsUrl: () => void
  handleCopyVolumeHash: () => void
  handleCopyCIDv0: () => void
  handleCopyCIDv1: () => void
}

export function useManageWebsite(): ManageWebsite {
  const [, dispatch] = useAppState()

  const router = useRouter()
  const { hash } = router.query

  const { entities } = useRequestWebsites({ id: hash as string })
  const [website] = entities || []

  const refVolume = useHashToEntity(website?.volume_id) as Volume

  const manager = useWebsiteManager()
  const [historyVolumes, setHistoryVolumes] = useState<
    HistoryVolumes | undefined
  >()

  const { next, stop } = useCheckoutNotification({})

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

  // -------------

  const cidV1 = refVolume?.item_hash && cidV0Tov1(refVolume.item_hash)
  const defaultUrl = `https://${cidV1}.ipfs.aleph.sh`
  /* const alt_url = `https://${cidV1}.ipfs.storry.tv`
  const alt_url_2 = `https://${cidV1}.ipfs.cf-ipfs.com`
  const alt_url_3 = `https://${cidV1}.ipfs.dweb.link` */

  const handleCopyHash = useCopyToClipboardAndNotify(website?.id || '')
  const handleCopyUrl = useCopyToClipboardAndNotify(defaultUrl)
  const handleCopyIpfsUrl = useCopyToClipboardAndNotify(`ipfs://${cidV1}` || '')
  const handleCopyVolumeHash = useCopyToClipboardAndNotify(refVolume?.id || '')
  const handleCopyCIDv0 = useCopyToClipboardAndNotify(
    refVolume?.item_hash || '',
  )
  const handleCopyCIDv1 = useCopyToClipboardAndNotify(cidV1 ?? '')

  // -------------

  const state = useNewWebsitePage()
  const theme = useTheme()
  const cid = state.values.website?.cid

  useEffect(() => {
    if (!cid) return
    handleUpdate(cid as string)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cid, handleUpdate])

  return {
    website,
    refVolume,
    historyVolumes,
    cidV1,
    defaultUrl,
    theme,
    state,
    handleDelete,
    handleUpdate,
    handleCopyHash,
    handleCopyUrl,
    handleCopyIpfsUrl,
    handleCopyVolumeHash,
    handleCopyCIDv0,
    handleCopyCIDv1,
    //handleDownload
  }
}
