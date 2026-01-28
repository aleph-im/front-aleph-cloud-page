import React, { memo, useRef } from 'react'
import { InstanceVolumesCellProps, VolumeWithDetails } from './types'
import { StyledPortal, VolumesButton, VolumeRow } from './styles'
import {
  ObjectImg,
  useClickOutside,
  useFloatPosition,
  useTransition,
  useWindowScroll,
  useWindowSize,
} from '@aleph-front/core'
import { Portal } from '@/components/common/Portal'
import { EntityType, EntityTypeObject } from '@/helpers/constants'
import InfoTitle from '@/components/common/entityData/InfoTitle'
import { humanReadableSize } from '@/helpers/utils'

export const InstanceVolumesCell = ({
  volumes,
  onVolumeClick,
}: InstanceVolumesCellProps) => {
  const [showDropdown, setShowDropdown] = React.useState(false)

  const dropdownElementRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const windowSize = useWindowSize(0)
  const windowScroll = useWindowScroll(0)

  const { shouldMount, stage } = useTransition(showDropdown, 250)

  const isOpen = stage === 'enter'

  const {
    myRef: dropdownRef,
    atRef: triggerRef,
    position: dropdownPosition,
  } = useFloatPosition({
    my: 'top-right',
    at: 'bottom-right',
    myRef: dropdownElementRef,
    atRef: buttonRef,
    deps: [windowSize, windowScroll, shouldMount],
  })

  useClickOutside(() => {
    if (showDropdown) setShowDropdown(false)
  }, [dropdownRef, triggerRef])

  const handleVolumeClick = (volume: VolumeWithDetails) => {
    // Only allow click for immutable volumes (those with id/ref)
    if (!volume.id) return
    setShowDropdown(false)
    onVolumeClick(volume)
  }

  // Get volume size - either from size_mib (persistent) or from fetched size
  const getVolumeSize = (volume: VolumeWithDetails): string => {
    if ('size_mib' in volume && volume.size_mib) {
      return humanReadableSize(volume.size_mib, 'MiB')
    }
    if (volume.size) {
      return humanReadableSize(volume.size, 'MiB')
    }
    return '-'
  }

  if (volumes.length === 0) {
    return (
      <VolumesButton disabled>
        <ObjectImg
          id={EntityTypeObject[EntityType.Volume]}
          color="base2"
          size="1.5rem"
        />
      </VolumesButton>
    )
  }

  return (
    <span onClick={(e) => e.stopPropagation()}>
      <VolumesButton
        ref={buttonRef}
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <ObjectImg id="Object16" color="base2" size="1.5rem" />
      </VolumesButton>
      <Portal>
        {showDropdown && (
          <StyledPortal
            $isOpen={isOpen}
            $position={dropdownPosition}
            ref={dropdownRef}
          >
            <div tw="flex flex-col w-full">
              {volumes.map((volume, index) => {
                const isClickable = !!volume.id
                return (
                  <VolumeRow
                    key={volume.id || `volume-${index}`}
                    onClick={() => handleVolumeClick(volume)}
                    disabled={!isClickable}
                  >
                    <ObjectImg id="Object16" color="base2" size="1.5rem" />
                    <div>
                      <InfoTitle>{volume.mount}</InfoTitle>
                      <div className="tp-body1 fs-12">
                        {getVolumeSize(volume)}
                      </div>
                    </div>
                  </VolumeRow>
                )
              })}
            </div>
          </StyledPortal>
        )}
      </Portal>
    </span>
  )
}

InstanceVolumesCell.displayName = 'InstanceVolumesCell'

export default memo(InstanceVolumesCell) as typeof InstanceVolumesCell
