export type EntityLinkedCodebaseProps = {
  loading: boolean
  codebaseVolumeId?: string
  entrypoint?: string
  onCodebaseVolumeClick: (id: string) => void
}
