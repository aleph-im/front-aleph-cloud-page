export type HiddenFileInputProps = {
  onChange: (files?: File) => void
  accept?: string
  children: React.ReactNode
  value?: File
}
