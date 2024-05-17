import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { Domain, DomainStatus } from '@/domain/domain'
import { useCopyToClipboardAndNotify } from '@/hooks/common/useCopyToClipboard'
import { useDomainManager } from '@/hooks/common/useManager/useDomainManager'
import { useAppState } from '@/contexts/appState'
import { useHashToEntity } from './useHashToEntity'
import { Instance } from '@/domain/instance'
import { Program } from '@/domain/program'
import { useDomainStatus } from '@/hooks/common/useDomainStatus'
import { Account } from '@aleph-sdk/account'
import { useRequestDomains } from '@/hooks/common/useRequestEntity/useRequestDomains'
import { EntityDelAction } from '@/store/entity'

export type ManageDomain = {
  domain?: Domain
  status?: DomainStatus
  refEntity?: Program | Instance
  account?: Account
  handleCopyRef: () => void
  handleDelete: () => void
  handleRetry: () => void
}

export function useManageDomain(): ManageDomain {
  const [state, dispatch] = useAppState()
  const { account } = state.connection

  const router = useRouter()
  const { hash } = router.query

  const { entities } = useRequestDomains({ id: hash as string })
  const [domain] = entities || []

  const [, copyAndNotify] = useCopyToClipboardAndNotify()

  const refEntity = useHashToEntity(domain?.ref) as
    | Program
    | Instance
    | undefined

  const status = useDomainStatus(domain)

  const manager = useDomainManager()

  const handleCopyRef = useCallback(() => {
    copyAndNotify(domain?.ref || '')
  }, [copyAndNotify, domain])

  const handleDelete = useCallback(async () => {
    if (!domain) throw new Error('Invalid key')
    if (!manager) throw new Error('Manager not ready')

    try {
      await manager.del(domain)

      dispatch(new EntityDelAction({ name: 'domain', keys: [domain.id] }))

      await router.replace('/')
    } catch (e) {}
  }, [domain, manager, dispatch, router])

  const handleRetry = useCallback(async () => {
    if (!domain) throw new Error('Invalid key')
    if (!manager) throw new Error('Manager not ready')

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
