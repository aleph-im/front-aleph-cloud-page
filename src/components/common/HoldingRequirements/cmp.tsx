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
import { VolumeManager, VolumeType } from '@/domain/volume'

const HoldingRequirementsVolumeLine = React.memo(
  ({ volume, cost }: HoldingRequirementsVolumeLineProps) => {
    if (!cost) return <></>

    return (
      <StyledHoldingSummaryLine>
        <div>STORAGE</div>
        <div>
          <div>
            {convertBitUnits(volume.size || 0, {
              from: 'mb',
              to: 'gb',
              displayUnit: true,
            })}
            <span className="tp-info text-main0" tw="ml-2">
              {volume.volumeType === VolumeType.Persistent
                ? 'PERSISTENT'
                : 'IMMUTABLE'}
            </span>
          </div>
          {cost.discount > 0 && (
            <>
              <div>
                {convertBitUnits(cost.discount || 0, {
                  from: 'mb',
                  to: 'gb',
                  displayUnit: true,
                })}
                <span className="tp-info text-main1" tw="ml-2">
                  FREE
                </span>
              </div>
            </>
          )}
        </div>
        <div>{humanReadableCurrency(cost.cost)} ALEPH</div>
      </StyledHoldingSummaryLine>
    )
  },
)
HoldingRequirementsVolumeLine.displayName = 'HoldingRequirementsVolumeLine'

const HoldingRequirementsDomainLine = React.memo(
  ({ domain }: HoldingRequirementsDomainLineProps) => {
    return (
      <StyledHoldingSummaryLine>
        <div>CUSTOM DOMAIN</div>
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
        <div>UNLOCKED</div>
        <div className="tp-body1">current wallet {ellipseAddress(address)}</div>
        <div>{humanReadableCurrency(unlockedAmount)} ALEPH</div>
      </StyledHoldingSummaryLine>

      {specs && (
        <>
          <StyledHoldingSummaryLine>
            <div>{type.toUpperCase()}</div>
            <div>
              <div>
                {specs.cpu} x86 64bit
                {type === EntityType.Program && isPersistent && '(persistent)'}
                <span className="tp-info text-main0" tw="ml-2">
                  CORES
                </span>
              </div>
              <div>
                {convertBitUnits(specs.ram, {
                  from: 'mb',
                  to: 'gb',
                  displayUnit: true,
                })}
                <span className="tp-info text-main0" tw="ml-2">
                  RAM
                </span>
              </div>
              {type === EntityType.Instance && (
                <div>
                  {convertBitUnits(specs.storage, {
                    from: 'mb',
                    to: 'gb',
                    displayUnit: true,
                  })}
                  <span className="tp-info text-main0" tw="ml-2">
                    STORAGE
                  </span>
                </div>
              )}
            </div>
            <div>{humanReadableCurrency(computeTotalCost)} ALEPH</div>
          </StyledHoldingSummaryLine>
        </>
      )}

      {volumes &&
        volumes.map((volume) => {
          return (
            <HoldingRequirementsVolumeLine
              key={volume.id}
              volume={volume}
              cost={perVolumeCost[volume.id]}
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
