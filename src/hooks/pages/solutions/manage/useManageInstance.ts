import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo, useState } from 'react'
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
import { useAppState } from '@/contexts/appState'
import { ImmutableVolume, PaymentType } from '@aleph-sdk/message'
import {
  ellipseAddress,
  isVolumeEphemeral,
  isVolumePersistent,
} from '@/helpers/utils'
import { LabelVariant } from '@/components/common/Price/types'

// Type for side panel content
export type SidePanelContent = {
  isOpen: boolean
  type?: 'sshKey' | 'volume'
  selectedVolume?: any
  selectedSSHKey?: SSHKey
}

// All the data and functions needed for the ManageInstance component
export type ManageInstance = UseExecutableActionsReturn & {
  // Basic data
  instance?: Instance
  name: string
  labelVariant: LabelVariant

  // Volumes data
  volumes: any[]
  immutableVolumes: any[]
  persistentVolumes: any[]

  // UI state
  mappedKeys: (SSHKey | undefined)[]
  theme: DefaultTheme
  tabId: string
  sliderActiveIndex: number
  sidePanel: SidePanelContent

  // Actions
  setTabId: (tabId: string) => void
  handleBack: () => void
  handleImmutableVolumeClick: (volume: any) => void
  handleSSHKeyClick: (sshKey: SSHKey) => void
  closeSidePanel: () => void

  // Payment data
  paymentData: EntityPaymentProps
}

export function useManageInstance(): ManageInstance {
  const router = useRouter()
  const { hash } = router.query

  const { entities } = useRequestInstances({ ids: hash as string })
  const [instance] = entities || []

  const manager = useInstanceManager()
  const theme = useTheme()
  const [state] = useAppState()
  const {
    manager: { volumeManager },
  } = state

  // Tab state
  const [tabId, setTabId] = useState('detail')
  const subscribeLogs = tabId === 'log'

  // Executive actions
  const executableActions = useExecutableActions({
    executable: instance,
    manager,
    subscribeLogs,
  })

  // SSH keys
  const [mappedKeys, setMappedKeys] = useState<(SSHKey | undefined)[]>([])
  const sshKeyManager = useSSHKeyManager()

  // Payment data
  const [cost, setCost] = useState<number>()
  const [loading, setLoading] = useState<boolean>(false)

  // Volumes data
  const [immutableVolumes, setImmutableVolumes] = useState<any[]>([])

  // Side panel state
  const [sidePanel, setSidePanel] = useState<SidePanelContent>({
    isOpen: false,
  })

  // Calculate label variant
  const labelVariant = useMemo(() => {
    if (!instance) return 'warning'

    return instance.time < Date.now() - 1000 * 45 && executableActions.isRunning
      ? 'success'
      : 'warning'
  }, [instance, executableActions.isRunning])

  // Extract instance volumes
  const volumes = useMemo(() => {
    if (!instance) return []
    return instance.volumes
  }, [instance])

  // Filter persistent volumes
  const persistentVolumes = useMemo(() => {
    if (!volumes) return []
    return volumes.filter((volume) => isVolumePersistent(volume))
  }, [volumes])

  // Format instance name
  const name = useMemo(() => {
    if (!instance) return ''
    return (instance?.metadata?.name as string) || ellipseAddress(instance.id)
  }, [instance])

  // Calculate slider active index
  const sliderActiveIndex = useMemo(() => {
    return tabId === 'log' ? 1 : 0
  }, [tabId])

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

  // Fetch immutable volumes
  useEffect(() => {
    if (!volumes || !volumeManager) return

    const buildVolumes = async () => {
      const rawVolumes = volumes.filter(
        (volume) => !isVolumePersistent(volume) && !isVolumeEphemeral(volume),
      ) as ImmutableVolume[]

      const decoratedVolumes = await Promise.all(
        rawVolumes.map(async (rawVolume) => {
          const extraInfo = await volumeManager.get(rawVolume.ref)

          return {
            ...rawVolume,
            ...extraInfo,
          }
        }),
      )

      setImmutableVolumes(decoratedVolumes)
    }

    buildVolumes()
  }, [volumes, volumeManager])

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

  // Payment data for EntityPayment component
  const paymentData: EntityPaymentProps = useMemo(
    () => ({
      cost,
      paymentType: instance?.payment?.type || PaymentType.hold,
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

  // Side panel handlers
  const handleImmutableVolumeClick = useCallback((volume: any) => {
    setSidePanel({
      isOpen: true,
      type: 'volume',
      selectedVolume: volume,
    })
  }, [])

  const handleSSHKeyClick = useCallback((sshKey: SSHKey) => {
    setSidePanel({
      isOpen: true,
      type: 'sshKey',
      selectedSSHKey: sshKey,
    })
  }, [])

  const closeSidePanel = useCallback(() => {
    setSidePanel((prev) => ({
      ...prev,
      isOpen: false,
    }))
  }, [])

  // Navigation handler
  const handleBack = useCallback(() => {
    router.push('.')
  }, [router])

  return {
    ...executableActions,
    instance,
    mappedKeys,
    theme,
    tabId,
    setTabId,
    handleBack,
    paymentData,
    labelVariant,
    volumes,
    immutableVolumes,
    persistentVolumes,
    name,
    sliderActiveIndex,
    sidePanel,
    handleImmutableVolumeClick,
    handleSSHKeyClick,
    closeSidePanel,
  }
}
