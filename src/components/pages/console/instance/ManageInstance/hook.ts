import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Instance } from '@/domain/instance'
import { useInstanceManager } from '@/hooks/common/useManager/useInstanceManager'
import { InstanceManager } from '@/domain/instance'
import { useSSHKeyManager } from '@/hooks/common/useManager/useSSHKeyManager'
import { SSHKey } from '@/domain/ssh'
import { useRequestInstances } from '@/hooks/common/useRequestEntity/useRequestInstances'
import {
  UseExecutableActionsReturn,
  useExecutableActions,
} from '@/hooks/common/useExecutableActions'
import {
  HoldingPaymentData,
  PaymentData,
  StreamPaymentData,
} from '@/components/common/entityData/EntityPayment/types'
import {
  ImmutableVolume,
  PaymentType,
  PersistentVolume,
} from '@aleph-sdk/message'
import { ellipseAddress } from '@/helpers/utils'
import useDownloadLogs from '@/hooks/common/useDownloadLogs'
import useClassifyMachineVolumes from '@/hooks/common/useClassifyMachineVolumes'
import useEntityCustomDomains from '@/hooks/common/useEntityCustomDomains'
import { Domain } from '@/domain/domain'
import { DomainWithStatus } from '@/components/common/entityData/EntityCustomDomains/types'

// Type for side panel content
type SidePanelContent = {
  isOpen: boolean
  type?: 'sshKey' | 'volume' | 'domain'
  selectedDomain?: Domain
  selectedVolume?: any
  selectedSSHKey?: SSHKey
}

// All the data and functions needed for the ManageInstance component
export type ManageInstance = UseExecutableActionsReturn & {
  // Basic data
  instance?: Instance
  manager?: InstanceManager
  name: string

  // Volumes data
  immutableVolumes: ImmutableVolume[]
  persistentVolumes: PersistentVolume[]

  // Custom domains
  customDomains: DomainWithStatus[]
  handleCustomDomainClick: (domain: Domain) => void

  // UI state
  mappedKeys: (SSHKey | undefined)[]
  sliderActiveIndex: number
  sidePanel: SidePanelContent
  isDownloadingLogs: boolean

  // Actions
  setTabId: (tabId: string) => void
  handleBack: () => void
  handleImmutableVolumeClick: (volume: any) => void
  handleSSHKeyClick: (sshKey: SSHKey) => void
  closeSidePanel: () => void
  handleDownloadLogs: () => void

  // Payment data
  paymentData: PaymentData[]
}

export function useManageInstance(): ManageInstance {
  const router = useRouter()
  const { hash } = router.query

  const { entities } = useRequestInstances({ ids: hash as string })
  const [instance] = entities || []

  const instanceManager = useInstanceManager()

  // Tab state
  const [tabId, setTabId] = useState('detail')
  const subscribeLogs = tabId === 'log'

  // Executable actions
  const executableActions = useExecutableActions({
    executable: instance,
    manager: instanceManager,
    subscribeLogs,
  })

  const { streamDetails, logs } = executableActions

  // === UTILS ===
  // Format instance name
  const name = useMemo(() => {
    if (!instance) return ''
    return (instance?.metadata?.name as string) || ellipseAddress(instance.id)
  }, [instance])

  // Calculate running time in seconds
  const runningTime = useMemo(() => {
    return instance?.time
      ? Math.floor(Date.now() - instance.time * 1000) / 1000
      : undefined
  }, [instance?.time])

  // Download logs handler
  const { handleDownloadLogs, isDownloadingLogs } = useDownloadLogs({
    fileName: name,
    logs,
  })

  // Navigation handler
  const handleBack = useCallback(() => {
    router.push('.')
  }, [router])

  // -----------------

  // === SSH KEYS ===

  const [mappedKeys, setMappedKeys] = useState<(SSHKey | undefined)[]>([])
  const sshKeyManager = useSSHKeyManager()

  // Fetch
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

  // -----------------

  // === VOLUMES ===

  const { persistentVolumes, immutableVolumes } = useClassifyMachineVolumes({
    volumes: instance?.volumes,
  })

  // === CUSTOM DOMAINS ===

  // Use the custom hook and override the handleCustomDomainClick function
  const { customDomains } = useEntityCustomDomains({
    entityId: instance?.id,
  })

  const handleCustomDomainClick = useCallback((domain: Domain) => {
    setSidePanel({
      isOpen: true,
      type: 'domain',
      selectedDomain: domain,
    })
  }, [])

  // -----------------

  // === PAYMENT DATA ===
  const [cost, setCost] = useState<number>()
  const [loadingPaymentData, setLoadingPaymentData] = useState<boolean>(false)

  // Fetch cost
  useEffect(() => {
    const fetchCost = async () => {
      if (!instance?.payment || !instanceManager) return

      setLoadingPaymentData(true)

      try {
        const fetchedCost = await instanceManager.getTotalCostByHash(
          instance.payment.type,
          instance.id,
        )
        setCost(fetchedCost)
      } catch (error) {
        console.error('Error fetching cost:', error)
      } finally {
        setLoadingPaymentData(false)
      }
    }

    fetchCost()
  }, [instance, instanceManager])

  // Create payment data array based on payment type
  const paymentData: PaymentData[] = useMemo(() => {
    switch (instance?.payment?.type) {
      case PaymentType.hold:
        return [
          {
            cost,
            paymentType: PaymentType.hold,
            runningTime,
            startTime: instance.time,
            blockchain: instance.payment.chain,
            loading: loadingPaymentData,
          } as HoldingPaymentData,
        ]
      case PaymentType.superfluid:
        if (streamDetails?.streams?.length) {
          return streamDetails.streams.map(
            (stream) =>
              ({
                cost: stream.flow,
                paymentType: PaymentType.superfluid,
                runningTime,
                startTime: instance?.time,
                blockchain: instance?.payment?.chain,
                loading: false,
                receiver: stream.receiver,
              }) as StreamPaymentData,
          )
        }
      default:
        return [
          {
            paymentType: PaymentType.hold,
            loading: true,
          } as PaymentData,
        ]
    }
  }, [
    cost,
    instance?.payment,
    runningTime,
    instance?.time,
    streamDetails?.streams,
    loadingPaymentData,
  ])

  // -----------------

  // === SIDE PANEL ===

  const [sidePanel, setSidePanel] = useState<SidePanelContent>({
    isOpen: false,
  })

  // Handlers
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

  // -----------------

  // === SLIDER ===

  const sliderActiveIndex = useMemo(() => {
    return tabId === 'log' ? 1 : 0
  }, [tabId])

  // -----------------

  return {
    ...executableActions,
    instance,
    manager: instanceManager,
    mappedKeys,
    customDomains,
    handleCustomDomainClick,
    setTabId,
    handleBack,
    handleDownloadLogs,
    isDownloadingLogs,
    paymentData,
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
