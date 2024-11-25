import axios from 'axios'
import { Account } from '@aleph-sdk/account'
import {
  AlephHttpClient,
  AuthenticatedAlephHttpClient,
} from '@aleph-sdk/client'
import { Blockchain } from '@aleph-sdk/core'

export type VoucherAttribute = {
  value: string | number
  traitType: string
  displayType?: string
}

export type Voucher = {
  id: string
  metadataId: string
  name: string
  description: string
  externalUrl: string
  image: string
  icon: string
  attributes: VoucherAttribute[]
}

export class VoucherManager {
  constructor(
    protected account: Account,
    protected sdkClient: AlephHttpClient | AuthenticatedAlephHttpClient,
  ) {}

  async getAll(): Promise<Voucher[]> {
    if (!this.account) return []

    try {
      if (this.account.getChain() === Blockchain.SOL) {
        return await this.fetchSolanaVouchers()
      } else {
        return await this.fetchEVMVouchers()
      }
    } catch (error) {
      console.error('Error fetching vouchers:', error)
      return []
    }
  }

  private async fetchSolanaVouchers(): Promise<Voucher[]> {
    const vouchers: Voucher[] = []
    const apiUrl = 'https://api.claim.twentysix.cloud/v1/registry/sol'

    try {
      const response = await axios.get(apiUrl)

      if (response.status !== 200) return vouchers

      const { claimed_tickets: claimedTickets, batches } = response.data

      for (const voucherId in claimedTickets) {
        const { claimer, batch_id: batchId } = claimedTickets[voucherId]

        if (claimer === this.account.address) {
          const { metadata_id: metadataId } = batches[batchId]
          const metadata = await this.fetchMetadata(metadataId)

          if (metadata) {
            vouchers.push(this.createVoucher(voucherId, metadataId, metadata))
          }
        }
      }

      return vouchers
    } catch (error) {
      console.error('Error fetching Solana vouchers:', error)
      return vouchers
    }
  }

  private async fetchEVMVouchers(): Promise<Voucher[]> {
    const vouchers: Voucher[] = []
    const { content } = await this.sdkClient.getPost({
      types: 'vouchers-update',
    })

    for (const voucherId in content.nft_vouchers) {
      const voucher = content.nft_vouchers[voucherId]

      if (voucher?.claimer === this.account.address) {
        const metadataId = voucher.metadata_id
        const metadata = content.metadata[metadataId]

        if (metadata) {
          vouchers.push(this.createVoucher(voucherId, metadataId, metadata))
        }
      }
    }

    return vouchers
  }

  private async fetchMetadata(metadataId: string) {
    try {
      const metadataUrl = `https://claim.twentysix.cloud/sbt/metadata/${metadataId}.json`
      const response = await axios.get(metadataUrl)

      if (response.status !== 200) return null

      return response.data
    } catch (error) {
      console.error('Error fetching metadata:', error)
      return null
    }
  }

  private createVoucher(
    voucherId: string,
    metadataId: string,
    metadata: any,
  ): Voucher {
    const {
      name,
      description,
      external_url: externalUrl,
      image,
      icon,
      attributes,
    } = metadata

    return {
      id: voucherId,
      metadataId,
      name,
      description,
      externalUrl: externalUrl.replace('{id}', voucherId),
      image,
      icon,
      attributes: attributes.map((attr: any) => ({
        value: attr.value,
        traitType: attr.trait_type,
        displayType: attr.display_type,
      })),
    }
  }
}
