export type EntityLinkedRuntimeProps = {
  loading: boolean
  runtimeVolumeId?: string
  comment?: string
  onRuntimeVolumeClick: (id: string) => void
}
