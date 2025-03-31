import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
  downloadBlob,
  ellipseAddress,
  isVolumeEphemeral,
  isVolumePersistent,
} from '@/helpers/utils'
import { LabelVariant } from '@/components/common/Price/types'
import { useNotification } from '@aleph-front/core'

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
  isDownloadingLogs: boolean

  // Actions
  setTabId: (tabId: string) => void
  handleBack: () => void
  handleImmutableVolumeClick: (volume: any) => void
  handleSSHKeyClick: (sshKey: SSHKey) => void
  closeSidePanel: () => void
  handleDownloadLogs: () => void

  // Payment data
  paymentData: EntityPaymentProps
  paymentStreams: EntityPaymentProps[]
  hasStreams: boolean
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
  const noti = useNotification()

  // Tab state
  const [tabId, setTabId] = useState('detail')
  const [downloadingLogs, setDownloadingLogs] = useState(false)
  const subscribeLogs = tabId === 'log' || downloadingLogs

  // Executive actions
  const executableActions = useExecutableActions({
    executable: instance,
    manager,
    subscribeLogs,
  })

  const { streamDetails, isRunning, logs } = executableActions

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

    return instance.time < Date.now() - 1000 * 45 && isRunning
      ? 'success'
      : 'warning'
  }, [instance, isRunning])

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

  // Check if we have streams
  const hasStreams = useMemo(
    () => !!streamDetails?.streams.length,
    [streamDetails],
  )

  // Create individual payment props for each stream
  const paymentStreams: EntityPaymentProps[] = useMemo(() => {
    console.log('streams', streamDetails?.streams)
    if (!hasStreams) return []
    if (!streamDetails?.streams) return []

    return streamDetails.streams.map((stream) => ({
      cost: stream.flow / 3600, // Convert back from hourly rate to per-second rate
      paymentType: PaymentType.superfluid,
      runningTime,
      startTime: instance?.time,
      blockchain: instance?.payment?.chain,
      loading: false,
      receiver: stream.receiver,
    }))
  }, [
    streamDetails?.streams,
    runningTime,
    instance?.time,
    instance?.payment?.chain,
    hasStreams,
  ])

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

  // State for UI feedback during logs download
  const [isDownloadingLogs, setIsDownloadingLogs] = useState(false)
  const downloadTimeoutRef = useRef<NodeJS.Timeout>()

  // Clean up timeout when component unmounts
  useEffect(() => {
    return () => {
      if (downloadTimeoutRef.current) {
        clearTimeout(downloadTimeoutRef.current)
      }
    }
  }, [])

  // This effect handles downloading logs when they become available during download mode
  useEffect(() => {
    const downloadLogFiles = (
      instanceName: string,
      stdout: string,
      stderr: string,
    ) => {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const sanitizedName = instanceName.replace(/\s+/g, '_').toLowerCase()

      // Download stdout file
      if (stdout.trim()) {
        downloadBlob(
          new Blob([stdout], { type: 'text/plain' }),
          `stdout_${sanitizedName}_${timestamp}.log`,
        )
      }

      // Download stderr file
      if (stderr.trim()) {
        downloadBlob(
          new Blob([stderr], { type: 'text/plain' }),
          `stderr_${sanitizedName}_${timestamp}.log`,
        )
      }
    }

    if (downloadingLogs && logs) {
      const { stdout, stderr } = logs

      // If we have some content to download
      if (stdout.length > 0 || stderr.length > 0) {
        // Download the logs
        downloadLogFiles(name, stdout, stderr)

        // Clear the timeout
        if (downloadTimeoutRef.current) {
          clearTimeout(downloadTimeoutRef.current)
          downloadTimeoutRef.current = undefined
        }

        // Reset states
        setDownloadingLogs(false)
        setIsDownloadingLogs(false)
      }
    }
  }, [downloadingLogs, logs, name])

  // Logs download handler - this just activates the logs subscription without changing tab
  const handleDownloadLogs = useCallback(() => {
    // If already downloading, don't start another download
    if (isDownloadingLogs || downloadingLogs) return

    try {
      // Set UI feedback state
      setIsDownloadingLogs(true)

      // Set flag to trigger logs subscription without changing tab
      setDownloadingLogs(true)

      // Set a timeout to handle case where logs don't become available
      downloadTimeoutRef.current = setTimeout(() => {
        // If logs haven't been downloaded by this time, show error
        setDownloadingLogs(false)
        setIsDownloadingLogs(false)

        noti?.add({
          variant: 'warning',
          title: 'Download failed',
          text: 'Logs could not be retrieved in time. Please try again.',
        })
      }, 30000) // 30 second timeout to allow for wallet authentication
    } catch (e) {
      console.error('Error initiating logs download:', e)

      // Show error notification
      noti?.add({
        variant: 'error',
        title: 'Error downloading logs',
        text: (e as Error)?.message,
      })

      // Reset states
      setDownloadingLogs(false)
      setIsDownloadingLogs(false)

      // Clear timeout
      if (downloadTimeoutRef.current) {
        clearTimeout(downloadTimeoutRef.current)
        downloadTimeoutRef.current = undefined
      }
    }
  }, [isDownloadingLogs, downloadingLogs, noti])

  return {
    ...executableActions,
    instance,
    mappedKeys,
    theme,
    tabId,
    setTabId,
    handleBack,
    handleDownloadLogs,
    isDownloadingLogs,
    paymentData,
    paymentStreams,
    hasStreams,
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
