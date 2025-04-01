import { useRouter } from 'next/router'

export type ManageSSHKey = {
  sshKeyId: string
  handleBack: () => void
}

export function useManageSSHKey(): ManageSSHKey {
  const router = useRouter()
  const { hash } = router.query

  const handleBack = () => {
    router.push('/settings/')
  }

  return {
    sshKeyId: hash as string,
    handleBack,
  }
}
