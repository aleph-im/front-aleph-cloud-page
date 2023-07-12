import {
  ellipseAddress,
  humanReadableCurrency,
  getTotalProductCost,
  convertBitUnits,
} from '@/helpers/utils'
import { StyledHoldingSummaryLine } from './styles'
import {
  HoldingRequirementsDomainLineProps,
  HoldingRequirementsProps,
  HoldingRequirementsVolumeLineProps,
} from './types'
import { useMemo } from 'react'
import React from 'react'
import { EntityType } from '@/helpers/constants'

const HoldingRequirementsVolumeLine = React.memo(
  ({ volume, price }: HoldingRequirementsVolumeLineProps) => {
    const size = useMemo(
      () =>
        convertBitUnits(volume.size || 0, {
          from: 'mb',
          to: 'gb',
          displayUnit: false,
        }),
      [volume],
    )

    return (
      <StyledHoldingSummaryLine>
        <div tw="text-xs flex items-center">STORAGE</div>
        <div>
          {volume.volumeType === 'persistent' ? 'Persistent' : 'Immutable'}{' '}
          {size} GB
        </div>
        <div>{humanReadableCurrency(price)} ALEPH</div>
      </StyledHoldingSummaryLine>
    )
  },
)
HoldingRequirementsVolumeLine.displayName = 'HoldingRequirementsVolumeLine'

const HoldingRequirementsDomainLine = React.memo(
  ({ domain }: HoldingRequirementsDomainLineProps) => {
    return (
      <StyledHoldingSummaryLine>
        <div tw="text-xs flex items-center">CUSTOM DOMAIN</div>
        <div>{domain.name}</div>
        <div>0 ALEPH</div>
      </StyledHoldingSummaryLine>
    )
  },
)
HoldingRequirementsDomainLine.displayName = 'HoldingRequirementsDomainLine'

export default function HoldingRequirements({
  address,
  unlockedAmount,
  type,
  specs,
  volumes,
  domains,
  isPersistentVM = type === EntityType.Instance,
}: HoldingRequirementsProps) {
  const { computeTotalCost, perVolumeCost, totalCost } = useMemo(
    () =>
      getTotalProductCost({
        cpu: specs?.cpu,
        isPersistentVM,
        volumes,
        capabilities: {},
      }),
    [isPersistentVM, specs, volumes],
  )

  return (
    <div tw="max-w-full overflow-auto">
      <StyledHoldingSummaryLine isHeader>
        <div tw="text-xs flex items-center">UNLOCKED</div>
        <div className="tp-body1">current wallet {ellipseAddress(address)}</div>
        <div>{humanReadableCurrency(unlockedAmount)} ALEPH</div>
      </StyledHoldingSummaryLine>

      {specs?.cpu && (
        <StyledHoldingSummaryLine>
          <div tw="text-xs flex items-center">{type.toUpperCase()}</div>
          <div>
            {specs?.cpu} x86 64bit {isPersistentVM && '(persistent)'}
          </div>
          <div>{humanReadableCurrency(computeTotalCost)} ALEPH</div>
        </StyledHoldingSummaryLine>
      )}

      {volumes &&
        volumes.map((volume, i) => {
          return (
            <HoldingRequirementsVolumeLine
              key={volume.id}
              volume={volume}
              price={perVolumeCost[i]}
            />
          )
        })}

      {domains &&
        domains.map((domain) => {
          return (
            <HoldingRequirementsDomainLine key={domain.id} domain={domain} />
          )
        })}

      <StyledHoldingSummaryLine>
        <div></div>
        <div tw="text-xs flex items-center justify-end">
          <strong>TOTAL</strong>
        </div>
        <div>
          <span className="text-main1">
            {humanReadableCurrency(totalCost)} ALEPH
          </span>
        </div>
      </StyledHoldingSummaryLine>
    </div>
  )
}
