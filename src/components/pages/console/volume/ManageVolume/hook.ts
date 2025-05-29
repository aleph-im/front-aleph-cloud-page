import { useRouter } from 'next/router'
import { NAVIGATION_URLS } from '@/helpers/constants'

export type ManageVolume = {
  volumeId: string
  handleBack: () => void
}

export function useManageVolume(): ManageVolume {
  const router = useRouter()
  const { hash } = router.query

  const handleBack = () => {
    router.push(NAVIGATION_URLS.console.storage.home)
  }

  return {
    volumeId: hash as string,
    handleBack,
  }
}
