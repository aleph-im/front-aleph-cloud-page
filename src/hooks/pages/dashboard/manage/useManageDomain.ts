import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { AddDomain, Domain, DomainStatus } from '@/domain/domain'
import { useAccountDomain } from '@/hooks/common/useAccountEntity/useAccountDomain'
import { useCopyToClipboardAndNotify } from '@/hooks/common/useCopyToClipboard'
import { useRequestState } from '@/hooks/common/useRequestState'
import { useDomainManager } from '@/hooks/common/useManager/useDomainManager'
import { useAppState } from '@/contexts/appState'
import { ActionTypes } from '@/helpers/store'
import { useHashToEntity } from './useHashToEntity'
import { Instance } from '@/domain/instance'
import { Program } from '@/domain/program'
import { useDomainStatus } from '@/hooks/common/useDomainStatus'
import { Account } from 'aleph-sdk-ts/dist/accounts/account'

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
  const router = useRouter()
  const { hash } = router.query
  const [, , id] = (hash as string).split('/')

  const [domain] = useAccountDomain({ id })
  const [, { onLoad, onSuccess, onError }] = useRequestState()
  const [, copyAndNotify] = useCopyToClipboardAndNotify()
  const [{ account }, dispatch] = useAppState()

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
      onLoad()

      await manager.del(domain)

      dispatch({
        type: ActionTypes.delAccountDomain,
        payload: { id: domain.id },
      })

      onSuccess(true)

      router.replace('/dashboard')
    } catch (e) {
      onError(e as Error)
    }
  }, [domain, manager, onLoad, dispatch, onSuccess, router, onError])

  const handleRetry = useCallback(async () => {
    if (!domain) throw new Error('Invalid key')
    if (!manager) throw new Error('Manager not ready')

    console.log(domain)

    try {
      onLoad()

      await manager.retry(domain)

      onSuccess(true)
      router.replace('/dashboard')
    } catch (e) {
      onError(e as Error)
    }
  }, [domain, manager, onLoad, onSuccess, onError])

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
