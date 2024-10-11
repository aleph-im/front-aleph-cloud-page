import { RefObject } from 'react'
import type {
  SendOptions,
  Transaction,
  TransactionSignature,
  VersionedTransaction,
} from '@solana/web3.js'
import EventEmitter from 'events'

export type PageProps = {
  mainRef: RefObject<HTMLElement>
  contentRef: RefObject<HTMLElement>
}

export interface WindowPhantomProvider extends EventEmitter {
  isPhantom?: boolean
  publicKey?: { toBytes(): Uint8Array }
  isConnected: boolean
  signTransaction<T extends Transaction | VersionedTransaction>(
    transaction: T,
  ): Promise<T>
  signAllTransactions<T extends Transaction | VersionedTransaction>(
    transactions: T[],
  ): Promise<T[]>
  signAndSendTransaction<T extends Transaction | VersionedTransaction>(
    transaction: T,
    options?: SendOptions,
  ): Promise<{ signature: TransactionSignature }>
  signMessage(message: Uint8Array): Promise<{ signature: Uint8Array }>
  connect(): Promise<void>
  disconnect(): Promise<void>
  request(): Promise<void>
}
