import {
  ellipseAddress,
  humanReadableCurrency,
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
import { InstanceManager } from '@/domain/instance'
import { ProgramManager } from '@/domain/program'
import { VolumeManager } from '@/domain/volume'

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
  isPersistent = type === EntityType.Instance,
}: HoldingRequirementsProps) {
  const { computeTotalCost, perVolumeCost, totalCost } = useMemo(() => {
    switch (type) {
      case EntityType.Program:
        return ProgramManager.getCost({
          specs,
          volumes,
          isPersistent,
        })
      case EntityType.Instance:
        return InstanceManager.getCost({
          specs,
          volumes,
        })
      case EntityType.Volume:
        return {
          ...VolumeManager.getCost({
            volumes,
          }),
          computeTotalCost: 0,
        }
    }
  }, [isPersistent, specs, type, volumes])

  return (
    <div tw="max-w-full overflow-auto">
      <StyledHoldingSummaryLine isHeader>
        <div tw="text-xs flex items-center">UNLOCKED</div>
        <div className="tp-body1">current wallet {ellipseAddress(address)}</div>
        <div>{humanReadableCurrency(unlockedAmount)} ALEPH</div>
      </StyledHoldingSummaryLine>

      {specs && (
        <StyledHoldingSummaryLine>
          <div tw="text-xs flex items-center">{type.toUpperCase()}</div>
          <div>
            {specs.cpu} x86 64bit {isPersistent && '(persistent)'}
          </div>
          <div>{humanReadableCurrency(computeTotalCost)} ALEPH</div>
        </StyledHoldingSummaryLine>
      )}

      {volumes &&
        volumes.map((volume) => {
          return (
            <HoldingRequirementsVolumeLine
              key={volume.id}
              volume={volume}
              price={perVolumeCost[volume.id]?.cost || 0}
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
