import {
  ellipseAddress,
  humanReadableCurrency,
  convertBitUnits,
  getTotalProductCost,
} from '@/helpers/utils'
import { StyledHoldingSummaryLine } from './styles'
import { HoldingRequirementsProps, VolumeRequirements } from './types'
import { useMemo } from 'react'
import { TextGradient } from '@aleph-front/aleph-core'

export default function HoldingSummary({
  address,
  computeUnits,
  storage,
  unlockedAmount,
}: HoldingRequirementsProps) {
  const totalProductCost = useMemo(
    () =>
      getTotalProductCost({
        computeUnits: computeUnits?.number || 0,
        volumes: storage,
        isPersistent: computeUnits?.isPersistent || false,
        capabilities: {},
      }),
    [computeUnits, storage],
  )

  const getVolumeSize = (volume: VolumeRequirements) => {
    if (volume.type === 'new')
      return convertBitUnits(volume?.src?.size || 0, {
        from: 'b',
        to: 'gb',
        displayUnit: false,
      }) as number
    return volume.size
  }

  return (
    <>
      <StyledHoldingSummaryLine isHeader>
        <div>BALANCE</div>
        <div>current wallet {ellipseAddress(address)}</div>
        <div>{humanReadableCurrency(unlockedAmount)} ALEPH</div>
      </StyledHoldingSummaryLine>

      {computeUnits && (
        <StyledHoldingSummaryLine>
          <div>{computeUnits.type.toUpperCase()}</div>
          <div>
            {computeUnits.number} x86 64bit{' '}
            {computeUnits.isPersistent && '(persistent)'}
          </div>
          <div>{humanReadableCurrency(totalProductCost?.compute)} ALEPH</div>
        </StyledHoldingSummaryLine>
      )}

      {storage &&
        totalProductCost.volumeCosts.map((volume, iVolume) => {
          return (
            <StyledHoldingSummaryLine
              key={iVolume} // note: this key is meant to avoid a warning, and should work since the array is not reordered
            >
              <div>STORAGE</div>
              <div>
                {volume.type === 'persistent' ? 'Persistent' : 'Immutable'}{' '}
                {getVolumeSize(volume)} GB
              </div>
              <div>{humanReadableCurrency(volume.price)} ALEPH</div>
            </StyledHoldingSummaryLine>
          )
        })}

      <StyledHoldingSummaryLine>
        <div></div>
        <div>
          <strong>TOTAL</strong>
        </div>
        <div>
          <TextGradient type="body2" color="main1">
            {humanReadableCurrency(totalProductCost.totalCost)} ALEPH
          </TextGradient>
        </div>
      </StyledHoldingSummaryLine>
    </>
  )
}
