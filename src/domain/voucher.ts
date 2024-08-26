import { Account } from '@aleph-sdk/account'
import {
  AlephHttpClient,
  AuthenticatedAlephHttpClient,
} from '@aleph-sdk/client'

export type Voucher = {
  id: string
  metadataId: string
  name: string
  description: string
  externalUrl: string
  image: string
  icon: string
  attributes: {
    value: string | number
    traitType: string
    displayType?: string
  }
}

export class VoucherManager {
  constructor(
    protected account: Account,
    protected sdkClient: AlephHttpClient | AuthenticatedAlephHttpClient,
  ) {}

  async getAll(): Promise<Voucher[]> {
    if (!this.account) return []

    try {
      const { content } = await this.sdkClient.getPost({
        types: 'vouchers-update',
      })

      const vouchers: Voucher[] = []

      for (const voucherId in content.nft_vouchers) {
        const voucher = content.nft_vouchers[voucherId]

        if (voucher?.claimer === this.account.address) {
          const metadataId = voucher.metadata_id
          const metadata = content.metadata[metadataId]

          if (metadata) {
            const { name, description, external_url, image, icon, attributes } =
              metadata

            vouchers.push({
              id: voucherId,
              metadataId,
              name,
              description,
              externalUrl: external_url.replace('{id}', voucherId),
              image: image,
              icon: icon,
              attributes: attributes.map((attr: any) => ({
                value: attr.value,
                traitType: attr.trait_type,
                displayType: attr.display_type,
              })),
            })
          }
        }
      }

      return vouchers
    } catch (err) {
      return []
    }
  }
}
