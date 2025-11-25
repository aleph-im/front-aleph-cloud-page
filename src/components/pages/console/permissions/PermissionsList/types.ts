import { MessageType } from '@aleph-sdk/message'

export type PermissionsListProps = {
  types?: MessageType[]
  postTypesCount: number
  aggregateKeysCount: number
}
