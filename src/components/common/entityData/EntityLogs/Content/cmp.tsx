import React, { memo } from 'react'
import LogsFeed from '@/components/common/LogsFeed'
import { EntityLogsContentProps } from './types'

export const EntityLogsContent = ({ logs }: EntityLogsContentProps) => {
  return (
    <>
      <div className="tp-h7" tw="w-full text-center">
        LOGS
      </div>
      <div tw="w-full max-w-3xl">
        Real-time logs of the of the virtual machine. Use this to debug any
        issue with the boot of your instance and to monitor the behavior of your
        instance while it is running.
      </div>
      <div tw="w-full">
        <LogsFeed logs={logs} />
      </div>
    </>
  )
}
EntityLogsContent.displayName = 'EntityLogsContent'

export default memo(EntityLogsContent) as typeof EntityLogsContent
