import { useCallback } from 'react'
import { useRouter } from 'next/router'
import { useCopyToClipboardAndNotify } from '@aleph-front/core'
import { Domain, DomainStatus } from '@/domain/domain'
import { useDomainManager } from '@/hooks/common/useManager/useDomainManager'
import { useAppState } from '@/contexts/appState'
import { useHashToEntity } from '../../../../../hooks/common/useHashToEntity'
import { Instance } from '@/domain/instance'
import { Program } from '@/domain/program'
import { Volume } from '@/domain/volume'
import { useDomainStatus } from '@/hooks/common/useDomainStatus'
import { Account } from '@aleph-sdk/account'
import { useRequestDomains } from '@/hooks/common/useRequestEntity/useRequestDomains'
import { EntityDelAction } from '@/store/entity'
import {
  stepsCatalog,
  useCheckoutNotification,
} from '@/hooks/form/useCheckoutNotification'
import Err from '@/helpers/errors'
import { Confidential } from '@/domain/confidential'

export type ManageDomain = {
  domain?: Domain
  status?: DomainStatus
  refEntity?: Program | Instance | Volume
  account?: Account
  handleDelete: () => void
  handleRetry: () => void
  handleCopyHash: () => void
  handleCopyRef: () => void
  handleBack: () => void
}

export function useManageDomain(): ManageDomain {
  const [
    {
      connection: { account },
    },
    dispatch,
  ] = useAppState()

  const router = useRouter()
  const { hash } = router.query

  const { entities } = useRequestDomains({ ids: hash as string })
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

  const handleDelete = useCallback(async () => {
    if (!manager) throw Err.ConnectYourWallet
    if (!domain) throw Err.DomainNotFound

    const iSteps = await manager.getDelSteps(domain)
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

  const handleBack = () => {
    router.push('/console/settings/')
  }

  return {
    domain,
    status,
    refEntity,
    account,
    handleDelete,
    handleRetry,
    handleCopyHash,
    handleCopyRef,
    handleBack,
  }
}
