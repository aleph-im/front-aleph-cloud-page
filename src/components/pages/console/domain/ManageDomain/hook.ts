import { NAVIGATION_URLS } from '@/helpers/constants'
import { useRouter } from 'next/router'

export type ManageDomain = {
  domainId: string
  handleBack: () => void
}

export function useManageDomain(): ManageDomain {
  const router = useRouter()
  const { hash } = router.query

  const handleBack = () => {
    router.push(NAVIGATION_URLS.console.domain.home)
  }

  return {
    domainId: hash as string,
    handleBack,
  }
}
