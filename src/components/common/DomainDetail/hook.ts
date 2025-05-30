import { useCallback, useMemo } from 'react'
import { useRouter } from 'next/router'
import { useCopyToClipboardAndNotify } from '@aleph-front/core'
import { Domain, DomainStatus } from '@/domain/domain'
import { useDomainManager } from '@/hooks/common/useManager/useDomainManager'
import { useAppState } from '@/contexts/appState'
import { useRequestDomains } from '@/hooks/common/useRequestEntity/useRequestDomains'
import { EntityDelAction } from '@/store/entity'
import Err from '@/helpers/errors'
import {
  stepsCatalog,
  useCheckoutNotification,
} from '@/hooks/form/useCheckoutNotification'
import { Program } from '@/domain/program'
import { Instance } from '@/domain/instance'
import { Volume } from '@/domain/volume'
import { Account } from '@aleph-sdk/account'
import { Confidential } from '@/domain/confidential'
import { useHashToEntity } from '@/hooks/common/useHashToEntity'
import { useDomainStatus } from '@/hooks/common/useDomainStatus'

export type UseDomainDetailReturn = {
  domain?: Domain
  status?: DomainStatus
  refEntity?: Program | Instance | Volume | Confidential
  account?: Account
  handleDelete: () => void
  disabledDelete: boolean
  handleUpdate: () => void
  disabledUpdate: boolean
  handleRetry: () => void
  handleCopyHash: () => void
  handleCopyRef: () => void
}

export type UseDomainDetailProps = {
  domainId: string
}

export function useDomainDetail({
  domainId,
}: UseDomainDetailProps): UseDomainDetailReturn {
  const router = useRouter()
  const [
    {
      connection: { account },
    },
    dispatch,
  ] = useAppState()

  const { entities } = useRequestDomains({ ids: domainId })
  const [domain] = entities || []

  const refEntity = useHashToEntity(domain?.ref) as
    | Program
    | Instance
    | Confidential
    | Volume
    | undefined

  const status = useDomainStatus(domain)

  const manager = useDomainManager()
  const { next, stop, noti } = useCheckoutNotification({})

  const disabledDelete = useMemo(() => !domain, [domain])
  const handleDelete = useCallback(async () => {
    if (!manager) throw Err.ConnectYourWallet
    if (!domain) throw Err.DomainNotFound

    const iSteps = await manager.getDelSteps()
    const nSteps = iSteps.map((i) => stepsCatalog[i])
    const steps = manager.delSteps(domain)

    try {
      while (true) {
        const { done } = await steps.next()
        if (done) {
          break
        }
        await next(nSteps)
      }

      dispatch(new EntityDelAction({ name: 'domain', keys: [domain.id] }))

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
  }, [dispatch, manager, domain, next, router, stop, noti])

  const disabledUpdate = useMemo(() => !domain, [domain])
  const handleUpdate = useCallback(() => {
    if (!domain) throw Err.DomainNotFound

    router.push(`/console/settings/domain/new/?name=${domain.id}`)
  }, [router, domain])

  const handleRetry = useCallback(async () => {
    if (!manager) throw Err.ConnectYourWallet
    if (!domain) throw Err.DomainNotFound

    try {
      await manager.retry(domain)

      await router.replace('/')
    } catch (e) {}
  }, [domain, manager, router])

  const handleCopyHash = useCopyToClipboardAndNotify(refEntity?.id || '')
  const handleCopyRef = useCopyToClipboardAndNotify(domain?.ref || '')

  return {
    domain,
    status,
    refEntity,
    account,
    handleDelete,
    disabledDelete,
    handleUpdate,
    disabledUpdate,
    handleRetry,
    handleCopyHash,
    handleCopyRef,
  }
}
