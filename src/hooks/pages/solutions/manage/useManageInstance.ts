import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Instance } from '@/domain/instance'
import { useInstanceManager } from '@/hooks/common/useManager/useInstanceManager'
import { useSSHKeyManager } from '@/hooks/common/useManager/useSSHKeyManager'
import { SSHKey } from '@/domain/ssh'
import { useRequestInstances } from '@/hooks/common/useRequestEntity/useRequestInstances'
import { DefaultTheme, useTheme } from 'styled-components'
import {
  UseExecutableActionsReturn,
  useExecutableActions,
} from '@/hooks/common/useExecutableActions'

export type ManageInstance = UseExecutableActionsReturn & {
  instance?: Instance
  mappedKeys: (SSHKey | undefined)[]
  theme: DefaultTheme
  tabId: string
  setTabId: (tabId: string) => void
  handleBack: () => void
}

export function useManageInstance(): ManageInstance {
  const router = useRouter()
  const { hash } = router.query

  const { entities } = useRequestInstances({ ids: hash as string })
  const [instance] = entities || []

  const manager = useInstanceManager()

  const theme = useTheme()

  const [tabId, setTabId] = useState('detail')
  const subscribeLogs = tabId === 'log'

  const executableActions = useExecutableActions({
    executable: instance,
    manager,
    subscribeLogs,
  })

  const [mappedKeys, setMappedKeys] = useState<(SSHKey | undefined)[]>([])

  const sshKeyManager = useSSHKeyManager()

  useEffect(() => {
    if (!instance || !sshKeyManager) return
    const getMapped = async () => {
      const mapped = await sshKeyManager?.getByValues(
        instance.authorized_keys || [],
      )
      setMappedKeys(mapped)
    }

    getMapped()
  }, [sshKeyManager, instance])

  const handleBack = () => {
    router.push('.')
  }
  return {
    ...executableActions,
    instance,
    mappedKeys,
    theme,
    tabId,
    setTabId,
    handleBack,
  }
}
