import { CRN } from '@/domain/node'

export type CRNItem = CRN & {
  isActive: boolean
  isLoading: boolean
  disabled?: boolean
}
