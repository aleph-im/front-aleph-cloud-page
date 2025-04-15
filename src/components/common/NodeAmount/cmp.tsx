import { memo } from 'react'
import Price from '../Price'

// https://github.com/aleph-im/aleph-account/blob/main/src/components/NodesTable.vue#L258
export const NodeAmount = ({ amount }: { amount: number }) => {
  return <Price value={amount} />
}
NodeAmount.displayName = 'NodeAmount'

export default memo(NodeAmount)
