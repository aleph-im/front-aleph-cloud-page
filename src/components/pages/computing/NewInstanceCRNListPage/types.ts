import { CRN, StreamNotSupportedIssue } from '@/domain/node'

export type CRNItem = CRN & {
  isActive: boolean
  isLoading: boolean
  disabled?: boolean
  issue?: StreamNotSupportedIssue
}
