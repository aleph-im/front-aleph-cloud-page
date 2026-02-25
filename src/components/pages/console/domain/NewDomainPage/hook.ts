import { useCallback } from 'react'
import { useRouter } from 'next/router'
import { Domain } from '@/domain/domain'
import { EntityDomainType, NAVIGATION_URLS } from '@/helpers/constants'

export type UseNewDomainPageReturn = {
  name?: string
  ref?: string
  target?: EntityDomainType
  onSuccess: (domain: Domain) => void
  handleBack: () => void
}

export function useNewDomainPage(): UseNewDomainPageReturn {
  const router = useRouter()
  const { name, ref, target } = router.query

  const onSuccess = useCallback(
    (domain: Domain) => {
      router.push(NAVIGATION_URLS.console.domain.detail(domain.id))
    },
    [router],
  )
  const handleBack = useCallback(() => {
    router.push(NAVIGATION_URLS.console.domain.home)
  }, [router])

  return {
    name: typeof name === 'string' ? name : undefined,
    ref: typeof ref === 'string' ? ref : undefined,
    target:
      typeof target === 'string' ? (target as EntityDomainType) : undefined,
    onSuccess,
    handleBack,
  }
}
