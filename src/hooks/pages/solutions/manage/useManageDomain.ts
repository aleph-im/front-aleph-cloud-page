import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { Domain, DomainStatus } from '@/domain/domain'
import { useAccountDomain } from '@/hooks/common/useAccountEntity/useAccountDomain'
import { useCopyToClipboardAndNotify } from '@/hooks/common/useCopyToClipboard'
import { useDomainManager } from '@/hooks/common/useManager/useDomainManager'
import { useAppState } from '@/contexts/appState'
import { ActionTypes } from '@/helpers/store'
import { useHashToEntity } from './useHashToEntity'
import { Instance } from '@/domain/instance'
import { Program } from '@/domain/program'
import { Website } from '@/domain/website'
import { useDomainStatus } from '@/hooks/common/useDomainStatus'
import { Account } from '@aleph-sdk/account'
import Err from '@/helpers/errors'
import { Volume } from '@/domain/volume'

export type ManageDomain = {
  domain?: Domain
  status?: DomainStatus
  refEntity?: Program | Instance | Website | Volume
  account?: Account
  handleCopyRef: () => void
  handleDelete: () => void
  handleRetry: () => void
}

export function useManageDomain(): ManageDomain {
  const router = useRouter()
  const { hash } = router.query

  const [domain] = useAccountDomain({ id: hash as string })
  const [, copyAndNotify] = useCopyToClipboardAndNotify()
  const [{ account }, dispatch] = useAppState()
  const refEntity = useHashToEntity(domain?.ref) as
    | Program
    | Instance
    | Website
    | Volume

  const status = useDomainStatus(domain)

  const manager = useDomainManager()

  const handleCopyRef = useCallback(() => {
    copyAndNotify(domain?.ref || '')
  }, [copyAndNotify, domain])

  const handleDelete = useCallback(async () => {
    if (!manager) throw Err.ConnectYourWallet
    if (!domain) throw Err.DomainNotFound

    try {
      await manager.del(domain)

      dispatch({
        type: ActionTypes.delAccountDomain,
        payload: { id: domain.id },
      })

      await router.replace('/')
    } catch (e) {}
  }, [domain, manager, dispatch, router])

  const handleRetry = useCallback(async () => {
    if (!manager) throw Err.ConnectYourWallet
    if (!domain) throw Err.DomainNotFound

    try {
      await manager.retry(domain)

      await router.replace('/')
    } catch (e) {}
  }, [domain, manager, router])

  return {
    domain,
    status,
    refEntity,
    account,
    handleCopyRef,
    handleDelete,
    handleRetry,
  }
}
