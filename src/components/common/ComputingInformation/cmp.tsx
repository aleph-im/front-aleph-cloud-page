import React, { memo } from 'react'
import { ComputingInformationProps } from './types'
import ComputingEntityDataPill from '../ComputingEntityDataPill'

export const ComputingInformation = ({
  running = 0,
  paused = 0,
  booting = 0,
}: ComputingInformationProps = {}) => (
  <div tw="flex justify-end gap-x-2.5 rounded-xl">
    <ComputingEntityDataPill value={running} icon="play" />
    <ComputingEntityDataPill value={paused} icon="pause" />
    <ComputingEntityDataPill value={booting} icon="loader" />
  </div>
)

ComputingInformation.displayName = 'ComputingInformation'

export default memo(ComputingInformation) as typeof ComputingInformation
