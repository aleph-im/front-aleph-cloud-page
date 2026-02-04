import React, { memo } from 'react'
import { DomainDetailProps } from './types'
import { useDomainDetail } from './hook'
import DomainNameSection from '../entityData/DomainNameSection'
import DomainDnsConfiguration from '../entityData/DomainDnsConfiguration'

export const DomainDetail = ({ domainId }: DomainDetailProps) => {
  const { domain, status, account, handleRetry, handleSaveName } =
    useDomainDetail({ domainId })

  return (
    <div tw="flex flex-col gap-6">
      <DomainNameSection
        domain={domain}
        status={status}
        onSave={handleSaveName}
      />
      <DomainDnsConfiguration
        domain={domain}
        status={status}
        account={account}
        onRetry={handleRetry}
      />
    </div>
  )
}
DomainDetail.displayName = 'DomainDetail'

export default memo(DomainDetail) as typeof DomainDetail
