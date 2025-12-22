import { useCallback } from 'react'
import { useRouter } from 'next/router'
import { Domain } from '@/domain/domain'
import { NAVIGATION_URLS } from '@/helpers/constants'

export type UseNewDomainPageReturn = {
  onSuccess: (domain: Domain) => void
  handleBack: () => void
}

export function useNewDomainPage(): UseNewDomainPageReturn {
  const router = useRouter()

  const onSuccess = useCallback(
    (domain: Domain) => {
      router.push(NAVIGATION_URLS.console.settings.domain.detail(domain.id))
    },
    [router],
  )
  const handleBack = useCallback(() => {
    router.push(NAVIGATION_URLS.console.settings.home)
  }, [router])

  return {
    onSuccess,
    handleBack,
  }
}
