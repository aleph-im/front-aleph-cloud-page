import {
  ellipseAddress,
  humanReadableCurrency,
  convertBitUnits,
  getTotalProductCost,
} from '@/helpers/utils'
import { StyledHoldingSummaryLine } from './styles'
import { HoldingRequirementsProps, VolumeRequirements } from './types'
import { useMemo } from 'react'

export default function HoldingRequirements({
  address,
  reqs,
  storage,
  unlockedAmount,
}: HoldingRequirementsProps) {
  const totalProductCost = useMemo(
    () =>
      getTotalProductCost({
        cpu: reqs?.number || 0,
        volumes: storage,
        isPersistentStorage: reqs?.isPersistent || false,
        capabilities: {},
      }),
    [reqs, storage],
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
    <div tw="max-w-full overflow-auto">
      <StyledHoldingSummaryLine isHeader>
        <div tw="text-xs flex items-center">UNLOCKED</div>
        <div className="tp-body1">current wallet {ellipseAddress(address)}</div>
        <div>{humanReadableCurrency(unlockedAmount)} ALEPH</div>
      </StyledHoldingSummaryLine>

      {reqs && (
        <StyledHoldingSummaryLine>
          <div tw="text-xs flex items-center">{reqs.type.toUpperCase()}</div>
          <div>
            {reqs.number} x86 64bit {reqs.isPersistent && '(persistent)'}
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
              <div tw="text-xs flex items-center">STORAGE</div>
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
        <div tw="text-xs flex items-center justify-end">
          <strong>TOTAL</strong>
        </div>
        <div>
          <span className="text-main1">
            {humanReadableCurrency(totalProductCost.totalCost)} ALEPH
          </span>
        </div>
      </StyledHoldingSummaryLine>
    </div>
  )
}
