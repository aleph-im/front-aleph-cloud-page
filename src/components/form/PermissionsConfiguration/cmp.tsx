import React, { memo, useMemo, useState, useRef, useCallback } from 'react'
import styled, { css } from 'styled-components'
import tw from 'twin.macro'
import {
  Button,
  Checkbox,
  Icon,
  NoisyContainer,
  Spinner,
  Tabs,
  TextInput,
  useClickOutside,
  useFloatPosition,
  useTransition,
  useWindowScroll,
  useWindowSize,
} from '@aleph-front/core'
import { MessageType } from '@aleph-sdk/message'
import {
  RowActionsButton,
  StyledPortal,
} from '@/components/pages/console/permissions/PermissionsRowActions/styles'
import StyledTable from '@/components/common/Table'
import { Portal } from '@/components/common/Portal'
import SidePanel from '@/components/common/SidePanel'
import { usePermissionsConfiguration } from './hook'
import { PermissionsConfigurationProps } from './types'

const CollapsibleList = styled.div<{
  $isCollapsed: boolean
  $maxHeight?: string
}>`
  ${({ theme, $isCollapsed, $maxHeight = '13rem' }) => css`
    ${tw`flex flex-col gap-y-3 overflow-y-auto`}
    max-height: ${$isCollapsed ? '0' : $maxHeight};
    opacity: ${$isCollapsed ? '0' : '1'};
    transition:
      max-height ${theme.transition.duration.normal}ms
        ${theme.transition.timing},
      opacity ${theme.transition.duration.normal}ms ${theme.transition.timing};
  `}
`

type FilterScopeButtonProps = {
  authorized: boolean
  availableItems: string[]
  selectedItems: string[]
  onSelectionChange: (items: string[]) => void
  isLoading?: boolean
}

const FilterScopeButton = ({
  authorized,
  availableItems,
  selectedItems,
  onSelectionChange,
  isLoading = false,
}: FilterScopeButtonProps) => {
  const [showPortal, setShowPortal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [allSelected, setAllSelected] = useState(selectedItems.length === 0)

  const buttonRef = useRef<HTMLButtonElement>(null)
  const portalRef = useRef<HTMLDivElement>(null)

  const windowSize = useWindowSize(0)
  const windowScroll = useWindowScroll(0)

  const { shouldMount, stage } = useTransition(showPortal, 250)

  const isOpen = stage === 'enter'

  const {
    myRef: floatRef,
    atRef: triggerRef,
    position: portalPosition,
  } = useFloatPosition({
    my: 'top-right',
    at: 'bottom-right',
    myRef: portalRef,
    atRef: buttonRef,
    deps: [windowSize, windowScroll, shouldMount],
  })

  useClickOutside(() => {
    if (showPortal) setShowPortal(false)
  }, [floatRef, triggerRef])

  const filteredItems = useMemo(() => {
    if (!searchQuery) return availableItems
    return availableItems.filter((item) =>
      item.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }, [availableItems, searchQuery])

  const handleToggleItem = (item: string) => {
    const isSelected = selectedItems.includes(item)
    if (isSelected) {
      onSelectionChange(selectedItems.filter((i) => i !== item))
    } else {
      onSelectionChange([...selectedItems, item])
    }
  }

  const handleClearAll = () => {
    onSelectionChange([])
  }

  const handleSelectAll = useCallback(
    (isAllSelected: boolean) => {
      isAllSelected
        ? onSelectionChange([...availableItems])
        : onSelectionChange([])

      setAllSelected(!isAllSelected)
    },
    [availableItems, onSelectionChange],
  )

  const count = selectedItems.length

  return (
    <>
      <RowActionsButton
        type="button"
        ref={buttonRef}
        disabled={!authorized || isLoading}
        onClick={() => setShowPortal(!showPortal)}
      >
        {!authorized ? (
          <Icon name="ellipsis" />
        ) : isLoading ? (
          <Spinner size="xs" tw="-mt-1" color="black" />
        ) : count > 0 ? (
          count
        ) : (
          'All'
        )}
      </RowActionsButton>
      <Portal>
        {shouldMount && (
          <StyledPortal
            $isOpen={isOpen}
            $position={portalPosition}
            ref={floatRef}
          >
            <div tw="p-3">
              <TextInput
                disabled={allSelected}
                name="filter-search"
                placeholder="Search"
                icon={<Icon name="search" />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div tw="flex items-center justify-between w-full my-3">
                <div tw="flex items-center gap-x-2.5">
                  <Checkbox
                    label="Select all"
                    checked={allSelected}
                    onChange={() => handleSelectAll(allSelected)}
                    size="sm"
                  />
                </div>
                <Button
                  variant="textOnly"
                  onClick={handleClearAll}
                  size="sm"
                  disabled={allSelected}
                >
                  Clear all
                </Button>
              </div>
              <CollapsibleList $isCollapsed={allSelected}>
                {isLoading ? (
                  <div className="tp-info fs-12">Loading...</div>
                ) : filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <div key={item} tw="flex items-center gap-x-2.5">
                      <Checkbox
                        checked={selectedItems.includes(item)}
                        onChange={() => handleToggleItem(item)}
                        size="sm"
                      />
                      <span className="fs-14">{item}</span>
                    </div>
                  ))
                ) : (
                  <div className="tp-info fs-12">
                    {searchQuery ? 'No matches found' : 'No items available'}
                  </div>
                )}
              </CollapsibleList>
            </div>
          </StyledPortal>
        )}
      </Portal>
    </>
  )
}

export const PermissionsConfiguration = ({
  control,
  name = 'permissions',
  channelsPanelOrder = 1,
}: PermissionsConfigurationProps) => {
  const {
    messageTypesCtrl,
    authorizedChannels,
    isChannelsPanelOpen,
    channelsSearchQuery,
    setChannelsSearchQuery,
    selectedChannels,
    isLoadingChannels,
    filteredChannels,
    availablePostTypes,
    isLoadingPostTypes,
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
  } = usePermissionsConfiguration({ control, name })

  const [allChannelsSelected, setAllChannelsSelected] = useState(
    selectedChannels.length === 0,
  )

  const handleSelectAllChannelsToggle = useCallback(
    (isAllSelected: boolean) => {
      if (isAllSelected) {
        handleSelectAllChannels()
      } else {
        handleClearAllChannels()
      }
      setAllChannelsSelected(!isAllSelected)
    },
    [handleSelectAllChannels, handleClearAllChannels],
  )

  const channelsPanelFooter = (
    <div tw="flex justify-start gap-x-4">
      <Button
        type="button"
        color="main0"
        kind="functional"
        variant="warning"
        onClick={handleApplyChannels}
      >
        <Icon name="arrow-left" />
        Continue
      </Button>
      <button
        type="button"
        onClick={handleCancelChannels}
        className="tp-header fs-14"
        tw="not-italic font-bold"
      >
        Cancel
      </button>
    </div>
  )

  return (
    <>
      <NoisyContainer>
        <Tabs
          tabs={[{ id: 'messages', name: 'Messages' }]}
          selected={selectedTabId}
          onTabChange={(id) => setSelectedTabId(id)}
          align="left"
        />
        <div role="tabpanel" tw="mt-6 p-6" className="bg-background">
          {selectedTabId === 'messages' ? (
            <div tw="flex flex-col gap-y-8">
              <div tw="flex justify-between items-center gap-x-4">
                <div
                  className="tp-body1"
                  tw="flex-1 flex items-center min-w-[3rem]"
                >
                  Channels:
                  <span
                    className="tp-body2"
                    tw="inline-block max-w-full overflow-hidden whitespace-nowrap text-ellipsis px-1"
                  >
                    {authorizedChannels}
                  </span>
                </div>
                <Button
                  type="button"
                  size="sm"
                  kind="functional"
                  variant="warning"
                  onClick={handleOpenChannelsPanel}
                >
                  Filter channels
                </Button>
              </div>
              <div>
                <StyledTable
                  borderType="none"
                  rowNoise
                  rowKey={(row) => row.type}
                  rowBackgroundColors={['purple2', 'purple3']}
                  hoverHighlight={false}
                  clickableRows={false}
                  data={messageTypesCtrl.field.value}
                  columns={[
                    {
                      label: 'Message type',
                      render: (row) => (
                        <span className="fs-12">{row.type}</span>
                      ),
                    },
                    {
                      label: 'Allowed',
                      render: (row, _col, rowIndex) => (
                        <Checkbox
                          checked={row.authorized}
                          onChange={() => handleToggleMessageType(rowIndex)}
                          size="sm"
                        />
                      ),
                    },
                    {
                      label: 'Filters / scope',
                      render: (row, _col, rowIndex) => {
                        if (row.type === MessageType.post) {
                          return (
                            <FilterScopeButton
                              authorized={row.authorized}
                              availableItems={availablePostTypes}
                              selectedItems={row.postTypes}
                              onSelectionChange={(items) =>
                                handlePostTypesChange(rowIndex, items)
                              }
                              isLoading={isLoadingPostTypes}
                            />
                          )
                        } else if (row.type === MessageType.aggregate) {
                          return (
                            <FilterScopeButton
                              authorized={row.authorized}
                              availableItems={getAllAggregateKeysForRow(
                                row.aggregateKeys,
                              )}
                              selectedItems={row.aggregateKeys}
                              onSelectionChange={(items) =>
                                handleAggregateKeysChange(rowIndex, items)
                              }
                              isLoading={isLoadingAggregateKeys}
                            />
                          )
                        } else {
                          return (
                            <span tw="opacity-40 ml-3" className="fs-12">
                              N/A
                            </span>
                          )
                        }
                      },
                    },
                  ]}
                  rowProps={() => ({
                    className: 'tp-info',
                  })}
                />
              </div>
            </div>
          ) : null}
        </div>
      </NoisyContainer>

      <Portal>
        <SidePanel
          isOpen={isChannelsPanelOpen}
          onClose={handleCloseChannelsPanel}
          title="Channels"
          order={channelsPanelOrder}
          footer={channelsPanelFooter}
        >
          <div tw="flex flex-col gap-y-2.5">
            <div className="tp-info fs-14">Permissions details</div>
            <NoisyContainer>
              <TextInput
                disabled={allChannelsSelected}
                name="channels-search"
                placeholder="Search"
                icon={<Icon name="search" />}
                value={channelsSearchQuery}
                onChange={(e) => setChannelsSearchQuery(e.target.value)}
              />
              <div tw="flex items-center justify-between w-full my-3">
                <div tw="flex items-center gap-x-2.5">
                  <Checkbox
                    label="Select all"
                    checked={allChannelsSelected}
                    onChange={() =>
                      handleSelectAllChannelsToggle(allChannelsSelected)
                    }
                    size="sm"
                  />
                </div>
                <Button
                  variant="textOnly"
                  onClick={handleClearAllChannels}
                  size="sm"
                  disabled={allChannelsSelected}
                >
                  Clear all
                </Button>
              </div>
              <CollapsibleList
                $isCollapsed={allChannelsSelected}
                $maxHeight="500vh"
              >
                {isLoadingChannels ? (
                  <div className="tp-info fs-12">Loading...</div>
                ) : filteredChannels.length > 0 ? (
                  filteredChannels.map((channel) => (
                    <div key={channel} tw="flex items-center gap-x-2.5">
                      <Checkbox
                        checked={selectedChannels.includes(channel)}
                        onChange={() => handleToggleChannel(channel)}
                        size="sm"
                      />
                      <span className="fs-14">{channel}</span>
                    </div>
                  ))
                ) : (
                  <div className="tp-info fs-12">
                    {channelsSearchQuery
                      ? 'No matches found'
                      : 'No channels available'}
                  </div>
                )}
              </CollapsibleList>
            </NoisyContainer>
          </div>
        </SidePanel>
      </Portal>
    </>
  )
}
PermissionsConfiguration.displayName = 'PermissionsConfiguration'

export default memo(PermissionsConfiguration) as typeof PermissionsConfiguration
