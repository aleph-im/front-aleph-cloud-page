export type HiddenFileInputProps = {
  onChange: (files?: File) => void
  accept?: string
  value?: File
  children: React.ReactNode
}
