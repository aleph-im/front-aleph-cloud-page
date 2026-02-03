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

export type UseManageDomainReturn = {
  // Basic data
  domain?: Domain
  domainId: string
  name: string

  // Status
  status?: DomainStatus

  // Linked resource
  refEntity?: Program | Instance | Volume | Confidential
  account?: Account

  // Action handlers
  handleDelete: () => void
  deleteDisabled: boolean
  deleteLoading: boolean
  handleUpdate: () => void
  updateDisabled: boolean
  handleRetry: () => void
  handleSaveName: (newName: string) => Promise<void>

  // Copy handlers
  handleCopyRef: () => void

  // Navigation
  handleBack: () => void
}

export function useManageDomain(): UseManageDomainReturn {
  const router = useRouter()
  const { hash } = router.query
  const domainId = hash as string

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

  const name = useMemo(
    () => domain?.name || (domain?.id ? domain.id.slice(0, 12) : ''),
    [domain],
  )

  const deleteDisabled = useMemo(() => !domain, [domain])
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

      dispatchDeleteEntity(domain.id)

      await router.replace(NAVIGATION_URLS.console.settings.home)
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
  }, [dispatchDeleteEntity, manager, domain, next, router, stop, noti])

  const updateDisabled = useMemo(() => !domain, [domain])
  const handleUpdate = useCallback(() => {
    if (!domain) throw Err.DomainNotFound

    const params = new URLSearchParams({
      name: domain.name,
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

  const handleCopyRef = useCopyToClipboardAndNotify(domain?.ref || '')

  const handleBack = useCallback(() => {
    router.push(NAVIGATION_URLS.console.settings.home)
  }, [router])

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
        // Update the domain name in a single step
        const steps = manager.updateNameSteps(domain, newName)
        while (true) {
          const { done } = await steps.next()
          if (done) break
          await next(nSteps)
        }

        // Update local state
        dispatchDeleteEntity(domain.id)

        // Wait a couple of seconds for the aggregate to be processed
        await new Promise((resolve) => setTimeout(resolve, 2000))

        // Navigate to the new domain page
        await router.replace(
          NAVIGATION_URLS.console.settings.domain.detail(newName),
        )
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
    [manager, domain, next, stop, noti, router, dispatchDeleteEntity],
  )

  return {
    // Basic data
    domain,
    domainId,
    name,

    // Status
    status,

    // Linked resource
    refEntity,
    account,

    // Action handlers
    handleDelete,
    deleteDisabled,
    deleteLoading: false,
    handleUpdate,
    updateDisabled,
    handleRetry,
    handleSaveName,

    // Copy handlers
    handleCopyRef,

    // Navigation
    handleBack,
  }
}
