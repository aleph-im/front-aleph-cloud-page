import { MachineVolume } from '@aleph-sdk/message'

export type VolumeWithDetails = MachineVolume & {
  id?: string
  size?: number
}

export type InstanceVolumesCellProps = {
  volumes: VolumeWithDetails[]
  onVolumeClick: (volume: VolumeWithDetails) => void
}
