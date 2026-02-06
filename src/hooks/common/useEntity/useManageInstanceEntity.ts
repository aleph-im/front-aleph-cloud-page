import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { InstanceEntity } from '@/domain/instance'
import { SSHKey } from '@/domain/ssh'
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
import { ExecutableManager } from '@/domain/executable'
import { useRequestSSHKeys } from '../useRequestEntity/useRequestSSHKeys'

// Type for side panel content
type SidePanelContent = {
  isOpen: boolean
  type?: 'sshKey' | 'volume' | 'domain' | 'logs' | 'newDomain'
  selectedDomain?: Domain
  selectedVolume?: any
  selectedSSHKey?: SSHKey
}

export type UseManageInstanceEntityProps<
  Entity extends InstanceEntity,
  Manager extends ExecutableManager<Entity>,
> = {
  entity?: Entity
  entityManager?: Manager
}

export type UseManageInstanceEntityReturn = UseExecutableActionsReturn & {
  // Basic data
  name: string

  // Volumes data
  immutableVolumes: ImmutableVolume[]
  persistentVolumes: PersistentVolume[]

  // Custom domains
  customDomains: DomainWithStatus[]
  isLoadingCustomDomains: boolean
  handleCustomDomainClick: (domain: Domain) => void
  handleAddDomain: () => void
  refetchDomains: () => Promise<void>

  // UI state
  mappedKeys: (SSHKey | undefined)[]
  sidePanel: SidePanelContent
  isDownloadingLogs: boolean

  // Actions
  handleBack: () => void
  handleImmutableVolumeClick: (volume: any) => void
  handleSSHKeyClick: (sshKey: SSHKey) => void
  handleViewLogs: () => void
  closeSidePanel: () => void
  handleDownloadLogs: () => void

  // Payment data
  paymentData: PaymentData[]
}

export function useManageInstanceEntity<
  Entity extends InstanceEntity,
  Manager extends ExecutableManager<Entity>,
>({
  entity,
  entityManager,
}: UseManageInstanceEntityProps<
  Entity,
  Manager
>): UseManageInstanceEntityReturn {
  const router = useRouter()

  // Tab state
  const [tabId, setTabId] = useState('detail')
  const subscribeLogs = tabId === 'log'

  // Executable actions
  const executableActions = useExecutableActions({
    executable: entity,
    manager: entityManager,
    subscribeLogs,
  })

  const { streamDetails, logs } = executableActions

  // === UTILS ===
  // Format entity name
  const name = useMemo(() => {
    if (!entity) return ''
    return (entity?.metadata?.name as string) || ellipseAddress(entity.id)
  }, [entity])

  // Calculate running time in seconds
  const runningTime = useMemo(() => {
    return entity?.time
      ? Math.floor(Date.now() - entity.time * 1000) / 1000
      : undefined
  }, [entity?.time])

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
    if (!entity?.authorized_keys || !sshKeys) return []

    return entity.authorized_keys.map((value) =>
      sshKeys.find((d) => d.key === value),
    )
  }, [entity, sshKeys])

  // -----------------

  // === VOLUMES ===

  const { persistentVolumes, immutableVolumes } = useClassifyMachineVolumes({
    volumes: entity?.volumes,
  })

  // === CUSTOM DOMAINS ===

  // Use the custom hook and override the handleCustomDomainClick function
  const {
    customDomains,
    isLoading: isLoadingCustomDomains,
    refetchDomains,
  } = useEntityCustomDomains({
    entityId: entity?.id,
  })

  const handleCustomDomainClick = useCallback((domain: Domain) => {
    setSidePanel({
      isOpen: true,
      type: 'domain',
      selectedDomain: domain,
    })
  }, [])

  const handleAddDomain = useCallback(() => {
    setSidePanel({
      isOpen: true,
      type: 'newDomain',
    })
  }, [])

  // -----------------

  // === PAYMENT DATA ===
  const [cost, setCost] = useState<number>()
  const [loadingPaymentData, setLoadingPaymentData] = useState<boolean>(false)

  // Fetch cost
  useEffect(() => {
    const fetchCost = async () => {
      if (!entity?.payment || !entityManager) return

      setLoadingPaymentData(true)

      try {
        const fetchedCost = await entityManager.getTotalCostByHash(
          entity.payment.type,
          entity.id,
        )
        setCost(fetchedCost)
      } catch (error) {
        console.error('Error fetching cost:', error)
      } finally {
        setLoadingPaymentData(false)
      }
    }

    fetchCost()
  }, [entity, entityManager])

  // Create payment data array based on payment type
  const paymentData: PaymentData[] = useMemo(() => {
    switch (entity?.payment?.type) {
      case PaymentType.hold:
        return [
          {
            cost,
            paymentType: PaymentType.hold,
            runningTime,
            startTime: entity.time,
            blockchain: entity.payment.chain,
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
                startTime: entity?.time,
                blockchain: entity?.payment?.chain,
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
    entity?.payment,
    runningTime,
    entity?.time,
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

  const handleViewLogs = useCallback(() => {
    setTabId('log')
    setSidePanel({
      isOpen: true,
      type: 'logs',
    })
  }, [])

  const closeSidePanel = useCallback(() => {
    setSidePanel((prev) => ({
      ...prev,
      isOpen: false,
    }))
  }, [])

  // -----------------

  return {
    ...executableActions,
    mappedKeys,
    customDomains,
    isLoadingCustomDomains,
    handleCustomDomainClick,
    handleAddDomain,
    refetchDomains,
    handleBack,
    handleDownloadLogs,
    isDownloadingLogs,
    paymentData,
    immutableVolumes,
    persistentVolumes,
    name,
    sidePanel,
    handleImmutableVolumeClick,
    handleSSHKeyClick,
    handleViewLogs,
    closeSidePanel,
  }
}
