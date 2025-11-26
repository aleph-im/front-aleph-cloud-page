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

export const PermissionsDetail = ({ permissions }: PermissionsDetailProps) => {
  const [selectedTabId, setSelectedTabId] = React.useState<string>('credits')

  const authorizedChannels = useMemo(() => {
    if (!permissions.channels?.length) return 'All'

    const maxchannelsToShow = 2

    const channelsToShow = permissions.channels
      .slice(0, maxchannelsToShow)
      .join(', ')

    return permissions.channels.length > maxchannelsToShow
      ? `${channelsToShow}, ...`
      : channelsToShow
  }, [permissions.channels])

  const messagesPermissionsData = useMemo(() => {
    // This is a placeholder. Replace with actual permissions data structure.
    return [
      {
        type: 'Type A',
        isAllowed: true,
        canFilter: true,
        scope: ['Channel 1', 'Channel 2'],
      },
      {
        type: 'Type B',
        isAllowed: false,
        canFilter: false,
        scope: [],
      },
    ]
  }, [])

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
                      <span className="tp-body1 fs-12">
                        {permissions.address}
                      </span>
                    }
                    textToCopy={permissions.address}
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
                    rowKey={({ type }: unknown) => type}
                    data={messagesPermissionsData}
                    columns={[
                      {
                        label: 'Message type',
                        render: ({ type }: unknown) => type,
                      },
                      {
                        label: 'Allowed',
                        render: ({ isAllowed }: unknown) => (
                          <Checkbox checked={isAllowed} readOnly />
                        ),
                      },
                      {
                        label: 'Filters / scope',
                        render: ({ isAllowed, canFilter, scope }: unknown) => {
                          if (!canFilter) return 'N/A'

                          if (!isAllowed) return '...'

                          return scope?.length || 'All'
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
