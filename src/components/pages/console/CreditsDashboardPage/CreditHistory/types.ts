export type CreditHistoryProps = {
  isConnected: boolean
  accountAddress?: string
  knownCrnHashes: Set<string>
  handleOpenTransferModal: () => void
}
