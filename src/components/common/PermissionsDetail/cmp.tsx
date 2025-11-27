import React, { memo, useMemo, useEffect } from 'react'
import { PermissionsDetailProps } from './types'
import {
  Button,
  Checkbox,
  Icon,
  NoisyContainer,
  ObjectImg,
  Tabs,
} from '@aleph-front/core'
import CopyToClipboard from '../CopyToClipboard'
import { MessageType } from '@aleph-sdk/message'
import { RowActionsButton } from '@/components/pages/console/permissions/PermissionsRowActions/styles'
import StyledTable from '../Table'
import Form from '@/components/form/Form'
import { usePermissionsDetailForm } from './hook'

export const PermissionsDetail = ({
  permissions,
  renderFooter,
  onDirtyChange,
}: PermissionsDetailProps) => {
  const [selectedTabId, setSelectedTabId] = React.useState<string>('credits')

  const { handleSubmit, errors, isDirty, messageTypesCtrl } =
    usePermissionsDetailForm({
      permissions,
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
              tabs={[
                { id: 'credits', name: 'Credits' },
                { id: 'messages', name: 'Messages' },
              ]}
              selected={selectedTabId}
              onTabChange={(id) => setSelectedTabId(id)}
              align="left"
            />
            <div role="tabpanel" tw="mt-6 p-6" className="bg-background">
              {selectedTabId === 'credits' ? (
                <Checkbox
                  checked={false}
                  readOnly
                  size="sm"
                  label="Allow this account to spend credits on my behalf"
                />
              ) : selectedTabId === 'messages' ? (
                <div tw="flex flex-col gap-y-8">
                  <div tw="flex justify-between">
                    <div className="tp-body1">
                      Channels:{' '}
                      <span className="tp-body2">{authorizedChannels}</span>
                    </div>
                    <Button
                      size="sm"
                      kind="functional"
                      variant="warning"
                      onClick={() =>
                        // @todo: should open another side panel to filter channels
                        null
                      }
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
                                <RowActionsButton
                                  disabled={!row.authorized}
                                  onClick={() => {
                                    // @todo: open Portal with list to filter
                                    return null
                                  }}
                                >
                                  {!row.authorized ? (
                                    <Icon name="ellipsis" />
                                  ) : row.postTypes.length ? (
                                    row.postTypes.length
                                  ) : (
                                    'All'
                                  )}
                                </RowActionsButton>
                              )
                            } else if (row.type === MessageType.aggregate) {
                              return (
                                <RowActionsButton
                                  disabled={!row.authorized}
                                  onClick={() => {
                                    // @todo: open Portal with list to filter
                                    return null
                                  }}
                                >
                                  {!row.authorized ? (
                                    <Icon name="ellipsis" />
                                  ) : row.aggregateKeys.length ? (
                                    row.aggregateKeys.length
                                  ) : (
                                    'All'
                                  )}
                                </RowActionsButton>
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
        {!renderFooter && (
          <div tw="flex justify-end gap-x-4">
            <Button type="submit" color="main0" variant="primary">
              Save Changes
            </Button>
          </div>
        )}
      </div>
    </Form>
  )
}
PermissionsDetail.displayName = 'PermissionsDetail'

export default memo(PermissionsDetail) as typeof PermissionsDetail
