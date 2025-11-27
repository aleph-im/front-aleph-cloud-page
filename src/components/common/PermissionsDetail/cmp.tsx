import React, { memo, useMemo } from 'react'
import { PermissionsDetailProps } from './types'
import {
  Button,
  Checkbox,
  Icon,
  NoisyContainer,
  ObjectImg,
  Table,
  Tabs,
} from '@aleph-front/core'
import CopyToClipboard from '../CopyToClipboard'
import { MessageType } from '@aleph-sdk/message'
import { RowActionsButton } from '@/components/pages/console/permissions/PermissionsRowActions/styles'
import StyledTable from '../Table'

export const PermissionsDetail = ({ permissions }: PermissionsDetailProps) => {
  const [selectedTabId, setSelectedTabId] = React.useState<string>('credits')

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

  return (
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
                <div className="tp-info fs-10 text-main0">Recipient alias</div>
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
                    data={permissions.messageTypes}
                    columns={[
                      {
                        label: 'Message type',
                        render: (row) => row.type,
                      },
                      {
                        label: 'Allowed',
                        render: (row) => (
                          <Checkbox
                            checked={row.authorized}
                            readOnly
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
                                // disabled={!row.authorized}
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
                                // disabled={!row.authorized}
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
                            return <span tw="opacity-40 ml-2">N/A</span>
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
      <div tw="flex flex-col gap-y-2"></div>
    </div>
  )
}
PermissionsDetail.displayName = 'PermissionsDetail'

export default memo(PermissionsDetail) as typeof PermissionsDetail
