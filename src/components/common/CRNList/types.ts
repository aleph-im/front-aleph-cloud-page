import {
  CRNSpecs,
  ReducedCRNSpecs,
  StreamNotSupportedIssue,
} from '@/domain/node'

export type CRNItem = CRNSpecs & {
  isActive: boolean
  isLoading: boolean
  disabled?: boolean
  issue?: StreamNotSupportedIssue
}

export type CRNListProps = {
  enableGpu?: boolean
  selected?: CRNSpecs
  onSelectedChange: (selected: CRNSpecs) => void
  filterBySpecs?: ReducedCRNSpecs
}
