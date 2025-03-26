import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
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
import { EntityPaymentProps } from '@/components/common/entityData/EntityPayment'

export type ManageInstance = UseExecutableActionsReturn & {
  instance?: Instance
  mappedKeys: (SSHKey | undefined)[]
  theme: DefaultTheme
  tabId: string
  setTabId: (tabId: string) => void
  handleBack: () => void
  paymentData: EntityPaymentProps
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
  const [cost, setCost] = useState<number>()
  const [loading, setLoading] = useState<boolean>(false)

  const sshKeyManager = useSSHKeyManager()

  // Fetch SSH keys
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

  // Fetch cost data
  useEffect(() => {
    const fetchCost = async () => {
      if (!instance?.payment || !manager) return

      setLoading(true)

      try {
        const fetchedCost = await manager.getTotalCostByHash(
          instance.payment.type,
          instance.id,
        )
        setCost(fetchedCost)
      } catch (error) {
        console.error('Error fetching cost:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCost()
  }, [instance, manager])

  // Calculate running time in seconds
  const runningTime = useMemo(() => {
    return instance?.time
      ? Math.floor(Date.now() - instance.time * 1000) / 1000
      : undefined
  }, [instance?.time])

  // Payment data for EntityPayment component (raw data, formatting happens in the component)
  const paymentData: EntityPaymentProps = useMemo(
    () => ({
      cost,
      paymentType: instance?.payment?.type || 'hold',
      runningTime,
      startTime: instance?.time,
      blockchain: instance?.payment?.chain,
      loading,
    }),
    [
      cost,
      instance?.payment?.type,
      runningTime,
      instance?.time,
      instance?.payment?.chain,
      loading,
    ],
  )

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
    paymentData,
  }
}
