import { CRNSpecs, StreamNotSupportedIssue } from '@/domain/node'

export type CRNItem = CRNSpecs & {
  isActive: boolean
  isLoading: boolean
  disabled?: boolean
  issue?: StreamNotSupportedIssue
}

export type CRNListProps = {
  selected?: string
  onSelectedChange: (selected: string) => void
}
