import { useCallback, useEffect, useMemo, useState } from 'react'
import { Control, useController, UseControllerReturn } from 'react-hook-form'
import { useAppState } from '@/contexts/appState'
import { useChannels } from '@/hooks/common/useChannels'
import { usePostTypes } from '@/hooks/common/usePostTypes'
import { useAggregateKeys } from '@/hooks/common/useAggregateKeys'
import { MessageType } from '@aleph-sdk/message'

export type UsePermissionsConfigurationProps = {
  control: Control<any>
  name?: string
}

export type UsePermissionsConfigurationReturn = {
  channelsCtrl: UseControllerReturn<any, any>
  messageTypesCtrl: UseControllerReturn<any, any>
  authorizedChannels: string
  isChannelsPanelOpen: boolean
  setIsChannelsPanelOpen: (open: boolean) => void
  channelsSearchQuery: string
  setChannelsSearchQuery: (query: string) => void
  selectedChannels: string[]
  availableChannels: string[]
  isLoadingChannels: boolean
  allChannels: string[]
  filteredChannels: string[]
  availablePostTypes: string[]
  isLoadingPostTypes: boolean
  availableAggregateKeys: string[]
  isLoadingAggregateKeys: boolean
  getAllAggregateKeysForRow: (rowAggregateKeys: string[]) => string[]
  selectedTabId: string
  setSelectedTabId: (id: string) => void
  handleToggleMessageType: (index: number) => void
  handlePostTypesChange: (rowIndex: number, items: string[]) => void
  handleAggregateKeysChange: (rowIndex: number, items: string[]) => void
  handleOpenChannelsPanel: () => void
  handleToggleChannel: (channel: string) => void
  handleClearAllChannels: () => void
  handleSelectAllChannels: () => void
  handleApplyChannels: () => void
  handleCancelChannels: () => void
  handleCloseChannelsPanel: () => void
}

export function usePermissionsConfiguration({
  control,
  name = 'permissions',
}: UsePermissionsConfigurationProps): UsePermissionsConfigurationReturn {
  const channelsCtrl = useController({
    control,
    name: `${name}.channels`,
  })

  const messageTypesCtrl = useController({
    control,
    name: `${name}.messageTypes`,
  })

  const [appState] = useAppState()
  const { account } = appState.connection

  const connectedAccountAddress = account?.address

  const { postTypes: availablePostTypes, isLoading: isLoadingPostTypes } =
    usePostTypes(connectedAccountAddress)

  const { channels: availableChannels, isLoading: isLoadingChannels } =
    useChannels(connectedAccountAddress)

  const {
    aggregateKeys: availableAggregateKeys,
    isLoading: isLoadingAggregateKeys,
  } = useAggregateKeys(connectedAccountAddress)

  const [isChannelsPanelOpen, setIsChannelsPanelOpen] = useState(false)
  const [channelsSearchQuery, setChannelsSearchQuery] = useState('')
  const [selectedChannels, setSelectedChannels] = useState<string[]>([])
  const [originalChannels, setOriginalChannels] = useState<string[]>([])

  const [selectedTabId, setSelectedTabId] = useState<string>('messages')

  const authorizedChannels = useMemo(() => {
    const currentChannels = channelsCtrl.field.value
    if (!currentChannels?.length) return 'All'
    return currentChannels.join(', ')
  }, [channelsCtrl.field.value])

  const allChannels = useMemo(() => {
    const permissionChannels = channelsCtrl.field.value || []
    const merged = Array.from(
      new Set([...availableChannels, ...permissionChannels]),
    )
    return merged.sort()
  }, [availableChannels, channelsCtrl.field.value])

  const filteredChannels = useMemo(() => {
    if (!channelsSearchQuery) return allChannels
    return allChannels.filter((channel) =>
      channel.toLowerCase().includes(channelsSearchQuery.toLowerCase()),
    )
  }, [allChannels, channelsSearchQuery])

  const getAllAggregateKeysForRow = useCallback(
    (rowAggregateKeys: string[]) => {
      const merged = Array.from(
        new Set([...availableAggregateKeys, ...(rowAggregateKeys || [])]),
      )
      return merged.sort()
    },
    [availableAggregateKeys],
  )

  useEffect(() => {
    if (isChannelsPanelOpen) {
      const currentChannels = channelsCtrl.field.value
      setSelectedChannels(currentChannels)
      setOriginalChannels(currentChannels)
    }
  }, [isChannelsPanelOpen, channelsCtrl.field.value])

  const handleToggleMessageType = useCallback(
    (index: number) => {
      const currentTypes = messageTypesCtrl.field.value
      const updatedTypes = [...currentTypes]

      const newAuthorized = !updatedTypes[index].authorized

      updatedTypes[index] = {
        ...updatedTypes[index],
        authorized: newAuthorized,
      }

      // If deauthorizing, clear specific filters/scopes
      if (!newAuthorized) {
        switch (updatedTypes[index].type) {
          case MessageType.post:
            updatedTypes[index].postTypes = []
            break
          case MessageType.aggregate:
            updatedTypes[index].aggregateKeys = []
            break
        }
      }

      messageTypesCtrl.field.onChange(updatedTypes)
    },
    [messageTypesCtrl],
  )

  const handlePostTypesChange = useCallback(
    (rowIndex: number, newPostTypes: string[]) => {
      const currentTypes = messageTypesCtrl.field.value
      const updatedTypes = [...currentTypes]
      const currentRow = updatedTypes[rowIndex]
      if (currentRow.type === MessageType.post) {
        updatedTypes[rowIndex] = {
          ...currentRow,
          postTypes: newPostTypes,
        }
        messageTypesCtrl.field.onChange(updatedTypes)
      }
    },
    [messageTypesCtrl],
  )

  const handleAggregateKeysChange = useCallback(
    (rowIndex: number, newAggregateKeys: string[]) => {
      const currentTypes = messageTypesCtrl.field.value
      const updatedTypes = [...currentTypes]
      const currentRow = updatedTypes[rowIndex]
      if (currentRow.type === MessageType.aggregate) {
        updatedTypes[rowIndex] = {
          ...currentRow,
          aggregateKeys: newAggregateKeys,
        }
        messageTypesCtrl.field.onChange(updatedTypes)
      }
    },
    [messageTypesCtrl],
  )

  const handleOpenChannelsPanel = useCallback(() => {
    setIsChannelsPanelOpen(true)
  }, [])

  const handleToggleChannel = useCallback((channel: string) => {
    setSelectedChannels((prev) =>
      prev.includes(channel)
        ? prev.filter((c) => c !== channel)
        : [...prev, channel],
    )
  }, [])

  const handleClearAllChannels = useCallback(() => {
    setSelectedChannels([])
  }, [])

  const handleSelectAllChannels = useCallback(() => {
    setSelectedChannels([...allChannels])
  }, [allChannels])

  const handleApplyChannels = useCallback(() => {
    channelsCtrl.field.onChange(selectedChannels)
    setIsChannelsPanelOpen(false)
    setChannelsSearchQuery('')
  }, [selectedChannels, channelsCtrl])

  const handleCancelChannels = useCallback(() => {
    setSelectedChannels(originalChannels)
    setIsChannelsPanelOpen(false)
    setChannelsSearchQuery('')
  }, [originalChannels])

  const handleCloseChannelsPanel = useCallback(() => {
    handleApplyChannels()
  }, [handleApplyChannels])

  return {
    channelsCtrl,
    messageTypesCtrl,
    authorizedChannels,
    isChannelsPanelOpen,
    setIsChannelsPanelOpen,
    channelsSearchQuery,
    setChannelsSearchQuery,
    selectedChannels,
    availableChannels,
    isLoadingChannels,
    allChannels,
    filteredChannels,
    availablePostTypes,
    isLoadingPostTypes,
    availableAggregateKeys,
    isLoadingAggregateKeys,
    getAllAggregateKeysForRow,
    selectedTabId,
    setSelectedTabId,
    handleToggleMessageType,
    handlePostTypesChange,
    handleAggregateKeysChange,
    handleOpenChannelsPanel,
    handleToggleChannel,
    handleClearAllChannels,
    handleSelectAllChannels,
    handleApplyChannels,
    handleCancelChannels,
    handleCloseChannelsPanel,
  }
}
