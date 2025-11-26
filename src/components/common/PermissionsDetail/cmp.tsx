import React, { memo, useMemo } from 'react'
import { PermissionsDetailProps } from './types'
import {
  Button,
  Checkbox,
  NoisyContainer,
  ObjectImg,
  Table,
  Tabs,
} from '@aleph-front/core'
import CopyToClipboard from '../CopyToClipboard'
import { MessageType } from '@aleph-sdk/message'

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

  const messagesPermissionsData = useMemo(() => {
    return permissions.messageTypes.map((mt) => {
      let scope: string | number = 'N/A'
      const canFilter =
        mt.type === MessageType.post || mt.type === MessageType.aggregate

      if (mt.authorized && canFilter) {
        if (mt.type === MessageType.post) {
          scope = mt.postTypes.length || 'All'
        } else if (mt.type === MessageType.aggregate) {
          scope = mt.aggregateKeys.length || 'All'
        } else {
          scope = 'All'
        }
      }

      return {
        type: mt.type.toUpperCase(),
        isAllowed: mt.authorized,
        canFilter,
        scope,
      }
    })
  }, [permissions.messageTypes])

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
              // this should be a checkbox in the real implementation
              <div>Allow this account to spend credits on my behalf</div>
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
                      // should open another side panel to filter channels
                      null
                    }
                  >
                    Filter channels
                  </Button>
                </div>
                <div>
                  <Table
                    borderType="none"
                    rowNoise
                    rowKey={(row: {
                      type: string
                      isAllowed: boolean
                      canFilter: boolean
                      scope: string | number
                    }) => row.type}
                    data={messagesPermissionsData}
                    columns={[
                      {
                        label: 'Message type',
                        render: (row: {
                          type: string
                          isAllowed: boolean
                          canFilter: boolean
                          scope: string | number
                        }) => row.type,
                      },
                      {
                        label: 'Allowed',
                        render: (row: {
                          type: string
                          isAllowed: boolean
                          canFilter: boolean
                          scope: string | number
                        }) => <Checkbox checked={row.isAllowed} readOnly />,
                      },
                      {
                        label: 'Filters / scope',
                        render: (row: {
                          type: string
                          isAllowed: boolean
                          canFilter: boolean
                          scope: string | number
                        }) => {
                          if (!row.canFilter) return 'N/A'

                          if (!row.isAllowed) return '...'

                          return row.scope
                        },
                      },
                    ]}
                    rowProps={() => ({
                      className: 'tp-info fs-12',
                      // onClick: () => handleRowClick(row, i),
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
