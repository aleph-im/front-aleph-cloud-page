import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { Program } from '@/domain/program'
import { useProgramManager } from '@/hooks/common/useManager/useProgramManager'
import { useRequestPrograms } from '@/hooks/common/useRequestEntity/useRequestPrograms'
import Err from '@/helpers/errors'
import {
  UseExecutableActionsReturn,
  useExecutableActions,
} from '@/hooks/common/useExecutableActions'
import { ellipseAddress } from '@/helpers/utils'
import useDownloadLogs from '@/hooks/common/useDownloadLogs'
import {
  HoldingPaymentData,
  PaymentData,
} from '@/components/common/entityData/EntityPayment/types'
import {
  ImmutableVolume,
  PaymentType,
  PersistentVolume,
} from '@aleph-sdk/message'
import useClassifyMachineVolumes from '@/hooks/common/useClassifyMachineVolumes'
import useEntityCustomDomains from '@/hooks/common/useEntityCustomDomains'
import { Domain } from '@/domain/domain'
import { DomainWithStatus } from '@/components/common/entityData/EntityCustomDomains/types'

// Type for side panel content
type SidePanelContent = {
  title: string
  isOpen: boolean
  type?: 'volume' | 'domain'
  selectedVolumeId?: string
  selectedDomain?: Domain
}

export type ManageFunction = UseExecutableActionsReturn & {
  // Basic data
  program?: Program
  name: string
  isPersistent: boolean

  // Volumes data
  immutableVolumes: ImmutableVolume[]
  persistentVolumes: PersistentVolume[]

  // Custom domains
  customDomains: DomainWithStatus[]
  handleCustomDomainClick: (domain: Domain) => void

  // UI State
  sliderActiveIndex: number
  isDownloadingLogs: boolean
  sidePanel: SidePanelContent

  // Payment data
  paymentData: PaymentData[]

  logsDisabled: boolean

  // Actions
  setTabId: (tabId: string) => void
  handleDownload: () => void
  downloadDisabled: boolean
  handleDownloadLogs: () => void
  handleRuntimeVolumeClick: (id: string) => void
  handleCodebaseVolumeClick: (id: string) => void
  handleImmutableVolumeClick: (id: string) => void
  closeSidePanel: () => void
  handleBack: () => void
}

export function useManageFunction(): ManageFunction {
  const router = useRouter()
  const { hash } = router.query

  const { entities } = useRequestPrograms({ ids: hash as string })
  const [program] = entities || []

  const programManager = useProgramManager()

  // Tab state
  const [tabId, setTabId] = useState('detail')
  const subscribeLogs = tabId === 'log'

  // Executable actions
  const executableActions = useExecutableActions({
    executable: program,
    manager: programManager,
    subscribeLogs,
  })

  const { logs, logsDisabled: executableLogsDisabled } = executableActions

  const isPersistent = useMemo(() => !!program?.on.persistent, [program])

  const isAllocated = useMemo(
    () => (isPersistent ? executableActions.isAllocated : !!program?.confirmed),
    [executableActions, program, isPersistent],
  )

  const logsDisabled = useMemo(() => {
    if (!program) return true
    if (!isAllocated) return true

    return executableLogsDisabled
  }, [isAllocated, executableLogsDisabled, program])

  // === CUSTOM DOMAINS ===

  // Use the custom hook and override the handleCustomDomainClick function
  const { customDomains } = useEntityCustomDomains({
    entityId: program?.id,
  })

  const handleCustomDomainClick = useCallback((domain: Domain) => {
    setSidePanel({
      title: 'Custom Domain',
      isOpen: true,
      type: 'domain',
      selectedDomain: domain,
    })
  }, [])

  // -----------------

  // Side panel state
  const [sidePanel, setSidePanel] = useState<SidePanelContent>({
    title: '',
    isOpen: false,
  })

  // Format program name
  const name = useMemo(() => {
    if (!program) return ''
    return (program?.metadata?.name as string) || ellipseAddress(program.id)
  }, [program])

  // Calculate slider active index
  const sliderActiveIndex = useMemo(() => {
    return tabId === 'log' ? 1 : 0
  }, [tabId])

  // Extract program volumes
  const { persistentVolumes, immutableVolumes } = useClassifyMachineVolumes({
    volumes: program?.volumes,
  })

  // Payment data
  const [cost, setCost] = useState<number>()
  const [loading, setLoading] = useState<boolean>(false)

  // Fetch cost data
  useEffect(() => {
    const fetchCost = async () => {
      if (!program?.payment || !programManager) return

      setLoading(true)

      try {
        const fetchedCost = await programManager.getTotalCostByHash(
          program.payment.type,
          program.id,
        )
        setCost(fetchedCost)
      } catch (error) {
        console.error('Error fetching cost:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCost()
  }, [program, programManager])

  // Calculate running time in seconds
  const runningTime = useMemo(() => {
    return program?.time
      ? Math.floor(Date.now() - program.time * 1000) / 1000
      : undefined
  }, [program?.time])

  // Create payment data array based on payment type
  const paymentData: PaymentData[] = useMemo(() => {
    switch (program?.payment?.type) {
      case PaymentType.hold:
        return [
          {
            cost,
            paymentType: PaymentType.hold,
            runningTime,
            startTime: program.time,
            blockchain: program.payment.chain,
            loading,
          } as HoldingPaymentData,
        ]
      default:
        return [
          {
            paymentType: PaymentType.hold,
            loading: true,
          } as PaymentData,
        ]
    }
  }, [cost, program?.payment, runningTime, program?.time, loading])

  const handleDownload = useCallback(async () => {
    if (!programManager) throw Err.ConnectYourWallet
    if (!program) throw Err.FunctionNotFound

    await programManager.download(program)
  }, [programManager, program])

  const downloadDisabled = useMemo(() => {
    if (!programManager) return true
    if (!program) return true

    return false
  }, [program, programManager])

  // Side panel handlers
  const openVolumeSidePanel = useCallback(
    ({ title, id }: { title: string; id: string }) => {
      setSidePanel({
        title,
        isOpen: true,
        type: 'volume',
        selectedVolumeId: id,
      })
    },
    [setSidePanel],
  )

  const handleRuntimeVolumeClick = useCallback(
    (id: string) => {
      openVolumeSidePanel({ title: 'Runtime Volume', id })
    },
    [openVolumeSidePanel],
  )

  const handleCodebaseVolumeClick = useCallback(
    (id: string) => {
      openVolumeSidePanel({ title: 'Codebase Volume', id })
    },
    [openVolumeSidePanel],
  )

  const handleImmutableVolumeClick = useCallback(
    (id: string) => {
      openVolumeSidePanel({ title: 'Immutable Volume', id })
    },
    [openVolumeSidePanel],
  )

  const closeSidePanel = useCallback(() => {
    setSidePanel((prev) => ({
      ...prev,
      isOpen: false,
    }))
  }, [])

  // Download logs handler
  const { handleDownloadLogs, isDownloadingLogs } = useDownloadLogs({
    fileName: name,
    logs,
  })

  const handleBack = () => {
    router.push('.')
  }

  return {
    ...executableActions,
    program,
    name,
    isPersistent,

    isAllocated,

    immutableVolumes,
    persistentVolumes,

    customDomains,
    handleCustomDomainClick,

    paymentData,

    logsDisabled,
    handleDownloadLogs,
    isDownloadingLogs,

    handleDownload,
    downloadDisabled,

    setTabId,
    sliderActiveIndex,
    sidePanel,
    closeSidePanel,
    handleRuntimeVolumeClick,
    handleCodebaseVolumeClick,
    handleImmutableVolumeClick,

    handleBack,
  }
}
