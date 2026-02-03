import { Confidential } from '@/domain/confidential'
import { Domain } from '@/domain/domain'
import { Instance } from '@/domain/instance'
import { Program } from '@/domain/program'
import { Volume } from '@/domain/volume'

export type DomainLinkedResourceProps = {
  domain?: Domain
  refEntity?: Program | Instance | Volume | Confidential
}
