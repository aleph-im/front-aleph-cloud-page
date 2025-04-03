import React, { memo } from 'react'
import { Icon, NoisyContainer } from '@aleph-front/core'
import { Text } from '@/components/pages/console/dashboard/common'
import { FunctionalButton } from '@/components/pages/console/dashboard/ManageInstance/cmp'
import { EntityLogsControlProps } from './types'

export const EntityLogsControl = ({
  onViewLogs,
  onDownloadLogs,
  disabled = false,
  downloadingLogs = false,
}: EntityLogsControlProps) => {
  return (
    <>
      <div className="tp-h7 fs-24" tw="uppercase mb-2">
        LOGS
      </div>
      <NoisyContainer>
        <div tw="flex flex-col gap-4">
          <div>
            <div className="tp-info text-main0 fs-12">INFO</div>
            <Text>
              Real-time logs of the of the virtual machine. Use this to debug
              any issue with the boot of your instance and to monitor the
              behavior of your instance while it is running.
            </Text>
          </div>

          <div tw="flex flex-wrap gap-6">
            <FunctionalButton onClick={onViewLogs} disabled={disabled}>
              <Icon name="eye" />
              view
            </FunctionalButton>
            <FunctionalButton
              onClick={onDownloadLogs}
              disabled={disabled || downloadingLogs}
            >
              <Icon
                name={downloadingLogs ? 'spinner' : 'download'}
                spin={downloadingLogs}
              />
              {downloadingLogs ? 'downloading...' : 'download logs'}
            </FunctionalButton>
          </div>
        </div>
      </NoisyContainer>
    </>
  )
}
EntityLogsControl.displayName = 'EntityLogsControl'

export default memo(EntityLogsControl) as typeof EntityLogsControl
