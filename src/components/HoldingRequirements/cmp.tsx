import {
  ellipseAddress,
  humanReadableCurrency,
  getFunctionCost,
  convertBitUnits,
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
  const functionCost = useMemo(() => {
    if (computeUnits) {
      return getFunctionCost({
        computeUnits: computeUnits.number,
        isPersistent: computeUnits?.isPersistent || false,
        storage: 0,
        capabilities: {},
      })
    }
  }, [computeUnits, storage])

  const getVolumeSize = (volume: VolumeRequirements) => {
    if (volume.type === 'new')
      return convertBitUnits(volume?.src?.size || 0, {
        from: 'b',
        to: 'gb',
        displayUnit: false,
      }) as number
    return volume.size
  }

  const displayedVolumes: (VolumeRequirements & { price: number })[] =
    useMemo(() => {
      const onlyNewVolumes =
        storage?.filter((volume) => volume.type !== 'existing') || []
      if (!computeUnits) {
        return onlyNewVolumes.map((volume) => ({
          ...volume,
          price: (getVolumeSize(volume) || 0) * 1000 * 20,
        }))
      }

      let remainingAllowance = functionCost?.storageAllowance || 0
      return onlyNewVolumes.map((volume) => {
        let size = getVolumeSize(volume) || 0
        if (remainingAllowance > 0) {
          if (size <= remainingAllowance) {
            remainingAllowance -= size
            size = 0
          } else {
            size -= remainingAllowance
            remainingAllowance = 0
          }
        }

        return {
          ...volume,
          price: size * 1000 * 20,
        }
      })
    }, [storage, computeUnits])

  const totalCost = useMemo(() => {
    const volumeCost = displayedVolumes.reduce(
      (acc, volume) => acc + volume.price,
      0,
    )
    return (functionCost?.compute || 0) + volumeCost
  }, [displayedVolumes, functionCost])

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
          <div>{humanReadableCurrency(functionCost?.compute)} ALEPH</div>
        </StyledHoldingSummaryLine>
      )}

      {storage &&
        displayedVolumes.map((volume, iVolume) => {
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
            {humanReadableCurrency(totalCost)} ALEPH
          </TextGradient>
        </div>
      </StyledHoldingSummaryLine>
    </>
  )
}
