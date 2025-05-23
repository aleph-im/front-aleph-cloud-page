import { useRouter } from 'next/router'

export type ManageDomain = {
  domainId: string
  handleBack: () => void
}

export function useManageDomain(): ManageDomain {
  const router = useRouter()
  const { hash } = router.query

  const handleBack = () => {
    router.push('/console/settings/')
  }

  return {
    domainId: hash as string,
    handleBack,
  }
}
