export type VolumeRequirements = {
  size?: number
  type: 'new' | 'persistent' | 'existing'
  src?: File
}

export type ComputeUnitsRequirements = {
  type: 'function' | 'instance'
  number: number
  isPersistent?: boolean
}

export type HoldingRequirementsProps = {
  reqs?: ComputeUnitsRequirements
  storage?: VolumeRequirements[]
  unlockedAmount: number
  address: string
}
