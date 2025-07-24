import React, { memo } from 'react'
import { Icon, NoisyContainer } from '@aleph-front/core'
import { Text } from '@/components/pages/console/common'
import FunctionalButton from '@/components/common/FunctionalButton'
import { EntityLogsControlProps } from './types'
import InfoTitle from '../../InfoTitle'

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
            <InfoTitle>INFO</InfoTitle>
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
