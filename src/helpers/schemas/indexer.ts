import { z } from 'zod'
import { IndexerBlockchain } from '../constants'
import {
  requiredStringSchema,
  urlSchema,
  optionalString,
  ethereumAddressSchema,
  tokenSupplySchema,
} from './base'
import { addNameAndTagsSchema } from './execution'

// INDEXER

export const indexerBlockchainSchema = z.enum([
  IndexerBlockchain.Ethereum,
  IndexerBlockchain.Bsc,
])

export const indexerNetworkIdSchema = requiredStringSchema.regex(
  /^[0-9a-z-]+$/,
  { message: 'Network id should be provided in kebab-case-format' },
)

export const abiUrlSchema = urlSchema.includes('$ADDRESS', {
  message:
    'The url must contain the token "$ADDRESS" that will be replaced in runtime with token contract addresses',
})

export const indexerNetworkSchema = z.object({
  id: indexerNetworkIdSchema,
  blockchain: indexerBlockchainSchema,
  rpcUrl: urlSchema,
  abiUrl: optionalString(abiUrlSchema),
})

export const indexerNetworksSchema = z.array(indexerNetworkSchema)

export const IndexerTokenAccountSchema = z.object({
  network: requiredStringSchema,
  contract: ethereumAddressSchema,
  deployer: ethereumAddressSchema,
  supply: tokenSupplySchema,
  decimals: z.number().gte(0),
})

export const IndexerTokenAccountsSchema = z.array(IndexerTokenAccountSchema)

export const indexerSchema = z
  .object({
    networks: indexerNetworksSchema.min(1),
    accounts: IndexerTokenAccountsSchema.min(1),
  })
  .merge(addNameAndTagsSchema)
  .superRefine(async ({ networks, accounts }, ctx) => {
    for (const [i, account] of Object.entries(accounts)) {
      const j = networks.findIndex((network) => network.id === account.network)
      const accountNetwork = networks[j]

      if (!accountNetwork) {
        ctx.addIssue({
          fatal: true,
          code: z.ZodIssueCode.custom,
          message:
            'Invalid network. It should be one of the defined blockchain networks ids',
          path: [`accounts.${i}.network`],
        })

        return z.NEVER
      }

      if (!account.contract) return z.NEVER
      if (!accountNetwork.abiUrl) return z.NEVER
      if (!accountNetwork.abiUrl.includes('$ADDRESS')) return z.NEVER

      const abiAddress = accountNetwork.abiUrl.replace(
        '$ADDRESS',
        account.contract,
      )

      const query = await fetch(abiAddress)
      const response = await query.json()

      let abi = undefined

      try {
        abi = JSON.parse(response?.result)
      } catch {
        // @note: Skip getting stuck in rate limit scenarios
        if (response?.result.includes('rate limit')) return z.NEVER
      }

      if (!abi) {
        ctx.addIssue({
          fatal: true,
          code: z.ZodIssueCode.custom,
          message:
            'Invalid ABI url. It should return a valid ABI json inside response.body.result field',
          path: [`networks.${j}.abiUrl`],
        })

        return z.NEVER
      }
    }
  })
