import { useRouter } from 'next/router'
import { useCallback, useMemo, useState } from 'react'
import { SSHKey } from '@/domain/ssh'
import {
  UseExecutableActionsReturn,
  useExecutableActions,
} from '@/hooks/common/useExecutableActions'
import { useRequestGpuInstances } from '@/hooks/common/useRequestEntity/useRequestGpuInstances'
import { useGpuInstanceManager } from '@/hooks/common/useManager/useGpuInstanceManager'
import { GpuInstance, GpuInstanceManager } from '@/domain/gpuInstance'
import { ellipseAddress } from '@/helpers/utils'
import useDownloadLogs from '@/hooks/common/useDownloadLogs'
import {
  ImmutableVolume,
  PaymentType,
  PersistentVolume,
} from '@aleph-sdk/message'
import { DomainWithStatus } from '@/components/common/entityData/EntityCustomDomains/types'
import {
  PaymentData,
  StreamPaymentData,
} from '@/components/common/entityData/EntityPayment/types'
import useClassifyMachineVolumes from '@/hooks/common/useClassifyMachineVolumes'
import useEntityCustomDomains from '@/hooks/common/useEntityCustomDomains'
import { Domain } from '@/domain/domain'
import { useRequestSSHKeys } from '@/hooks/common/useRequestEntity/useRequestSSHKeys'

// Type for side panel content
type SidePanelContent = {
  isOpen: boolean
  type?: 'sshKey' | 'volume' | 'domain'
  selectedDomain?: Domain
  selectedVolume?: any
  selectedSSHKey?: SSHKey
}

// All the data and functions needed for the ManageInstance component
export type ManageGpuInstance = UseExecutableActionsReturn & {
  // Basic data
  gpuInstance?: GpuInstance
  manager?: GpuInstanceManager
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

export function useManageGpuInstance(): ManageGpuInstance {
  const router = useRouter()
  const { hash } = router.query

  const { entities } = useRequestGpuInstances({ ids: hash as string })
  const [gpuInstance] = entities || []

  const gpuInstanceManager = useGpuInstanceManager()

  // Tab state
  const [tabId, setTabId] = useState('detail')
  const subscribeLogs = tabId === 'log'

  // Executable actions
  const executableActions = useExecutableActions({
    executable: gpuInstance,
    manager: gpuInstanceManager,
    subscribeLogs,
  })

  const { streamDetails, logs } = executableActions

  // === UTILS ===
  // Format GPU Instance name
  const name = useMemo(() => {
    if (!gpuInstance) return ''
    return (
      (gpuInstance?.metadata?.name as string) || ellipseAddress(gpuInstance.id)
    )
  }, [gpuInstance])

  // Calculate running time in seconds
  const runningTime = useMemo(() => {
    return gpuInstance?.time
      ? Math.floor(Date.now() - gpuInstance.time * 1000) / 1000
      : undefined
  }, [gpuInstance?.time])

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

  const { entities: sshKeys } = useRequestSSHKeys()

  const mappedKeys = useMemo(() => {
    if (!gpuInstance?.authorized_keys || !sshKeys) return []

    return gpuInstance.authorized_keys.map((value) =>
      sshKeys.find((d) => d.key === value),
    )
  }, [gpuInstance, sshKeys])

  // -----------------

  // === VOLUMES ===

  const { persistentVolumes, immutableVolumes } = useClassifyMachineVolumes({
    volumes: gpuInstance?.volumes,
  })

  // === CUSTOM DOMAINS ===

  // Use the custom hook and override the handleCustomDomainClick function
  const { customDomains } = useEntityCustomDomains({
    entityId: gpuInstance?.id,
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

  // Create payment data array based on payment type
  const paymentData: PaymentData[] = useMemo(() => {
    switch (gpuInstance?.payment?.type) {
      case PaymentType.superfluid:
        if (streamDetails?.streams?.length) {
          return streamDetails.streams.map(
            (stream) =>
              ({
                cost: stream.flow,
                paymentType: PaymentType.superfluid,
                runningTime,
                startTime: gpuInstance?.time,
                blockchain: gpuInstance?.payment?.chain,
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
    gpuInstance?.payment,
    runningTime,
    gpuInstance?.time,
    streamDetails?.streams,
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
    gpuInstance,
    manager: gpuInstanceManager,
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
