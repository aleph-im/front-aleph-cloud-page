import React, { memo, useMemo, useEffect, useState, useRef } from 'react'
import { PermissionsDetailProps } from './types'
import {
  Button,
  Checkbox,
  Icon,
  NoisyContainer,
  ObjectImg,
  Tabs,
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

type FilterScopeButtonProps = {
  authorized: boolean
  count: number
  onClick?: () => void
}

const FilterScopeButton = ({ authorized, count }: FilterScopeButtonProps) => {
  const [showPortal, setShowPortal] = useState(false)

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

  return (
    <>
      <RowActionsButton
        type="button"
        ref={buttonRef}
        disabled={!authorized}
        onClick={() => setShowPortal(!showPortal)}
      >
        {!authorized ? <Icon name="ellipsis" /> : count ? count : 'All'}
      </RowActionsButton>
      <Portal>
        {shouldMount && (
          <StyledPortal
            $isOpen={isOpen}
            $position={portalPosition}
            ref={floatRef}
          >
            <div tw="p-4">TEST</div>
          </StyledPortal>
        )}
      </Portal>
    </>
  )
}

export const PermissionsDetail = ({
  permissions,
  onDirtyChange,
  onSubmitSuccess,
  onOpenChannelsPanel,
}: PermissionsDetailProps) => {
  const [selectedTabId, setSelectedTabId] = useState<string>('messages')

  const { handleSubmit, errors, isDirty, messageTypesCtrl } =
    usePermissionsDetailForm({
      permissions,
      onSubmitSuccess,
    })

  useEffect(() => {
    onDirtyChange?.(isDirty)
  }, [isDirty, onDirtyChange])

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
                          render: (row) => {
                            if (row.type === MessageType.post) {
                              return (
                                <FilterScopeButton
                                  authorized={row.authorized}
                                  count={row.postTypes.length}
                                />
                              )
                            } else if (row.type === MessageType.aggregate) {
                              return (
                                <FilterScopeButton
                                  authorized={row.authorized}
                                  count={row.aggregateKeys.length}
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
    </Form>
  )
}
PermissionsDetail.displayName = 'PermissionsDetail'

export default memo(PermissionsDetail) as typeof PermissionsDetail
