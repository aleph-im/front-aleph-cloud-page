import { NodeDetails } from '@/hooks/common/useExecutableActions'

export type EntityHostingCRNProps = {
  nodeDetails?: NodeDetails
  termsAndConditionsHash?: string
}

export type TermsAndConditions = {
  cid: string
  name: string
  url: string
}
