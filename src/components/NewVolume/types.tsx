export type RemoveVolumeProps = {
  removeCallback: () => void
}

export type NewVolumeProps = {
  volumeName?: string
  handleNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  volumeMountpoint?: string
  handleMountpointChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  volumeSize?: number
  handleSizeChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  volumeUseLatest?: boolean
  handleUseLatestChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  volumeSrc?: File
  handleSrcChange: (f: File | undefined) => void
  volumeRefHash?: string
  handleRefHashChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  volumeType?: number
  handleVolumeType: (t: number) => void
  isStandAlone?: boolean
} & Partial<RemoveVolumeProps>