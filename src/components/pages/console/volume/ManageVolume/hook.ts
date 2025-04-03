import { useRouter } from 'next/router'

export type ManageVolume = {
  volumeId: string
  handleBack: () => void
}

export function useManageVolume(): ManageVolume {
  const router = useRouter()
  const { hash } = router.query

  const handleBack = () => {
    router.push('/console/storage/')
  }

  return {
    volumeId: hash as string,
    handleBack,
  }
}
