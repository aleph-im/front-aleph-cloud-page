import React, { memo, useMemo, useState, useRef } from 'react'
import styled, { css } from 'styled-components'
import tw from 'twin.macro'
import { PermissionsDetailProps } from './types'
import {
  Button,
  Checkbox,
  Icon,
  NoisyContainer,
  ObjectImg,
  Tabs,
  TextInput,
  useClickOutside,
  useFloatPosition,
  useTransition,
  useWindowScroll,
  useWindowSize,
} from '@aleph-front/core'
import CopyToClipboard from '../CopyToClipboard'
import { MessageType } from '@aleph-sdk/message'
import {
  RowActionsButton,
  StyledPortal,
} from '@/components/pages/console/permissions/PermissionsRowActions/styles'
import StyledTable from '../Table'
import Form from '@/components/form/Form'
import { usePermissionsDetailForm } from './hook'
import { Portal } from '../Portal'
import { usePostTypes } from '@/hooks/common/usePostTypes'
import { useAppState } from '@/contexts/appState'

const StyledFooter = styled.div`
  ${({ theme }) => css`
    ${tw`sticky bottom-0 left-0 right-0 p-6`}

    background: ${theme.color.background}D5;
    animation: slideUp ${theme.transition.duration.normal}ms
      ${theme.transition.timing} forwards;

    @keyframes slideUp {
      from {
        transform: translateY(100%);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
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

  const handleSelectAll = () => {
    onSelectionChange([...availableItems])
  }

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
          '...'
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
                name="filter-search"
                placeholder="Search"
                icon={<Icon name="search" />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div tw="flex items-center justify-between w-full my-3">
                <Button variant="textOnly" onClick={handleSelectAll}>
                  Select all
                </Button>
                <Button variant="textOnly" onClick={handleClearAll}>
                  Clear all
                </Button>
              </div>
              <div tw="flex flex-col gap-y-3 max-h-52 overflow-y-auto">
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
                      <span className="fs-12">{item}</span>
                    </div>
                  ))
                ) : (
                  <div className="tp-info fs-12">
                    {searchQuery ? 'No matches found' : 'No items available'}
                  </div>
                )}
              </div>
            </div>
          </StyledPortal>
        )}
      </Portal>
    </>
  )
}

export const PermissionsDetail = ({
  permissions,
  onSubmit,
  onUpdate,
  onOpenChannelsPanel,
  onCancel,
}: PermissionsDetailProps) => {
  const [selectedTabId, setSelectedTabId] = useState<string>('messages')

  const { handleSubmit, errors, messageTypesCtrl } = usePermissionsDetailForm({
    permissions,
    onSubmitSuccess: onSubmit,
    onUpdate,
  })

  const authorizedChannels = useMemo(() => {
    if (!permissions.channels.length) return 'All'

    const maxchannelsToShow = 2

    const channelsToShow = permissions.channels
      .slice(0, maxchannelsToShow)
      .join(', ')

    return permissions.channels.length > maxchannelsToShow
      ? `${channelsToShow}, ...`
      : channelsToShow
  }, [permissions.channels])

  const handleToggleMessageType = (index: number) => {
    const currentTypes = messageTypesCtrl.field.value
    const updatedTypes = [...currentTypes]
    updatedTypes[index] = {
      ...updatedTypes[index],
      authorized: !updatedTypes[index].authorized,
    }
    messageTypesCtrl.field.onChange(updatedTypes)
  }

  const [appState] = useAppState()
  const { account } = appState.connection

  // Get currently connected account's address for fetching post types
  const connectedAccountAddress = account?.address

  const { postTypes: availablePostTypes, isLoading: isLoadingPostTypes } =
    usePostTypes(connectedAccountAddress)

  const handlePostTypesChange = (rowIndex: number, newPostTypes: string[]) => {
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
  }

  const handleAggregateKeysChange = (
    rowIndex: number,
    newAggregateKeys: string[],
  ) => {
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
  }

  return (
    <Form id="permissions-detail-form" onSubmit={handleSubmit} errors={errors}>
      <div tw="flex flex-col gap-y-12">
        <div tw="flex flex-col gap-y-2">
          <div className="tp-info fs-14">Recipient details</div>
          <NoisyContainer>
            <div tw="flex gap-x-4">
              <div>
                <ObjectImg id="Object12" size={90} color="main0" />
              </div>
              <div tw="flex flex-col gap-y-2">
                {/* <div>
                <div className="tp-info fs-10 text-main0">Created at</div>
                <div className="tp-body2">
                  {permissions.created_at || 'Unknown'}
                </div>
              </div> */}
                <div>
                  <div className="tp-info fs-10 text-main0">
                    Recipient account address
                  </div>
                  <div>
                    <CopyToClipboard
                      text={
                        <span className="tp-body1 fs-12">{permissions.id}</span>
                      }
                      textToCopy={permissions.id}
                    />
                  </div>
                </div>
                <div>
                  <div className="tp-info fs-10 text-main0">
                    Recipient alias
                  </div>
                  <div className="tp-body2">{permissions.alias || '-'}</div>
                </div>
              </div>
            </div>
          </NoisyContainer>
        </div>
        <div tw="flex flex-col gap-y-2">
          <div className="tp-info fs-14">Permissions details</div>
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
                  <div tw="flex justify-between">
                    <div className="tp-body1">
                      Channels:{' '}
                      <span className="tp-body2">{authorizedChannels}</span>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      kind="functional"
                      variant="warning"
                      onClick={onOpenChannelsPanel}
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
                                  availableItems={row.aggregateKeys}
                                  selectedItems={row.aggregateKeys}
                                  onSelectionChange={(items) =>
                                    handleAggregateKeysChange(rowIndex, items)
                                  }
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
        </div>
      </div>
      <StyledFooter>
        <div tw="flex justify-start gap-x-4">
          <Button
            type="submit"
            color="main0"
            kind="functional"
            variant="warning"
          >
            Continue
          </Button>
          <button
            type="button"
            onClick={onCancel}
            className="tp-header fs-14"
            tw="not-italic font-bold"
          >
            Cancel
          </button>
        </div>
      </StyledFooter>
    </Form>
  )
}
PermissionsDetail.displayName = 'PermissionsDetail'

export default memo(PermissionsDetail) as typeof PermissionsDetail
