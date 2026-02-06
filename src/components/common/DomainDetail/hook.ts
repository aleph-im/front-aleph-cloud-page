import { useCallback, useMemo } from 'react'
import { useRouter } from 'next/router'
import { useCopyToClipboardAndNotify } from '@aleph-front/core'
import { Domain, DomainStatus } from '@/domain/domain'
import { useDomainManager } from '@/hooks/common/useManager/useDomainManager'
import { useAppState } from '@/contexts/appState'
import { useRequestDomains } from '@/hooks/common/useRequestEntity/useRequestDomains'
import { useDispatchDeleteEntityAction } from '@/hooks/common/useDeleteEntityAction'
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
import { NAVIGATION_URLS } from '@/helpers/constants'

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
  handleSaveName: (newName: string) => Promise<void>
  handleCopyHash: () => void
  handleCopyRef: () => void
}

export type UseDomainDetailProps = {
  domainId: string
  onDomainUpdate?: () => void
}

export function useDomainDetail({
  domainId,
  onDomainUpdate,
}: UseDomainDetailProps): UseDomainDetailReturn {
  const router = useRouter()
  const [
    {
      connection: { account },
    },
  ] = useAppState()

  const { dispatchDeleteEntity } = useDispatchDeleteEntityAction({
    entityName: 'domain',
  })

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

      // Wait for backend to propagate the update
      await new Promise((resolve) => setTimeout(resolve, 2000))

      dispatchDeleteEntity(domain.id)

      if (onDomainUpdate) {
        onDomainUpdate()
      } else {
        await router.replace(NAVIGATION_URLS.console.home)
      }
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
  }, [
    dispatchDeleteEntity,
    manager,
    domain,
    next,
    router,
    stop,
    noti,
    onDomainUpdate,
  ])

  const disabledUpdate = useMemo(() => !domain, [domain])
  const handleUpdate = useCallback(() => {
    if (!domain) throw Err.DomainNotFound

    const params = new URLSearchParams({
      name: domain.id,
      target: domain.target,
      ref: domain.ref,
    })

    router.push(
      `${NAVIGATION_URLS.console.settings.domain.new}/?${params.toString()}`,
    )
  }, [router, domain])

  const handleRetry = useCallback(async () => {
    if (!manager) throw Err.ConnectYourWallet
    if (!domain) throw Err.DomainNotFound

    try {
      await manager.retry(domain)

      await router.replace('/')
    } catch (e) {}
  }, [domain, manager, router])

  const handleSaveName = useCallback(
    async (newName: string) => {
      if (!manager) throw Err.ConnectYourWallet
      if (!domain) throw Err.DomainNotFound

      const iSteps = await manager.getUpdateSteps(
        domain.name,
        newName,
        manager.buildAggregateItemContent({
          name: newName,
          target: domain.target,
          ref: domain.ref,
        }),
      )
      const nSteps = iSteps.map((i) => stepsCatalog[i])

      try {
        const steps = manager.updateNameSteps(domain, newName)
        while (true) {
          const { done } = await steps.next()
          if (done) break
          await next(nSteps)
        }

        // Wait for backend to propagate the update
        await new Promise((resolve) => setTimeout(resolve, 2000))

        dispatchDeleteEntity(domain.id)

        if (onDomainUpdate) {
          onDomainUpdate()
        }
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

        throw e
      } finally {
        await stop()
      }
    },
    [manager, domain, next, stop, noti, dispatchDeleteEntity, onDomainUpdate],
  )

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
    handleSaveName,
    handleCopyHash,
    handleCopyRef,
  }
}
