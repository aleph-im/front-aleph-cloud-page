import { NAVIGATION_URLS } from '@/helpers/constants'
import { useRouter } from 'next/router'

export type ManageSSHKey = {
  sshKeyId: string
  handleBack: () => void
}

export function useManageSSHKey(): ManageSSHKey {
  const router = useRouter()
  const { hash } = router.query

  const handleBack = () => {
    router.push(NAVIGATION_URLS.console.settings.home)
  }

  return {
    sshKeyId: hash as string,
    handleBack,
  }
}
