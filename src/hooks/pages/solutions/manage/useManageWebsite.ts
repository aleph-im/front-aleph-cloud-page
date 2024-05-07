import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { Website } from '@/domain/website'
import { useAccountWebsite } from '@/hooks/common/useAccountEntity/useAccountWebsite'
import { useCopyToClipboardAndNotify } from '@/hooks/common/useCopyToClipboard'
import { useWebsiteManager } from '@/hooks/common/useManager/useWebsiteManager'
import { ActionTypes } from '@/helpers/store'
import { useAppState } from '@/contexts/appState'

export type ManageWebsite = {
  website?: Website
  handleCopyHash: () => void
  handleDelete: () => void
  //handleDownload: () => void
}

export function useManageWebsite(): ManageWebsite {
  const router = useRouter()
  const { hash } = router.query

  const [website] = useAccountWebsite({ id: hash as string })
  const [, copyAndNotify] = useCopyToClipboardAndNotify()
  const [, dispatch] = useAppState()

  const manager = useWebsiteManager()

  const handleCopyHash = useCallback(() => {
    copyAndNotify(website?.id || '')
  }, [copyAndNotify, website])

  const handleDelete = useCallback(async () => {
    if (!manager) throw new Error('Manager not ready')
    if (!website) throw new Error('Invalid website')

    try {
      await manager.del(website)

      dispatch({
        type: ActionTypes.delAccountWebsite,
        payload: { id: website.id },
      })

      await router.replace('/')
    } catch (e) {}
  }, [manager, website, dispatch, router])

  /* const handleDownload = useCallback(async () => {
    if (!manager) throw new Error('Manager not ready')
    if (!website) throw new Error('Invalid website')

    //TODO: Implement download for websites
    await manager.download(website)
  }, [manager, website]) */

  return {
    website,
    handleCopyHash,
    handleDelete,
  }
}
