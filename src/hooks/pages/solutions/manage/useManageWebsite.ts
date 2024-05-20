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
import Err from '@/helpers/errors'

export type ManageWebsite = {
  website?: Website
  refVolume?: Volume
  //account?: Account
  handleCopyHash: () => void
  handleDelete: () => void
  //handleDownload: () => void
  //copyAndNotify: (text: string) => void
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

  const handleCopyHash = useCallback(() => {
    copyAndNotify(website?.id || '')
  }, [copyAndNotify, website])

  const handleDelete = useCallback(async () => {
    if (!manager) throw Err.ConnectYourWallet
    if (!website) throw Err.WebsiteNotFound

    try {
      await manager.del(website)

      dispatch(new EntityDelAction({ name: 'website', keys: [website.id] }))

      await router.replace('/')
    } catch (e) {}
  }, [manager, website, dispatch, router])

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
