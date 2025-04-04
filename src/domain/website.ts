import { Account } from '@aleph-sdk/account'
import { EntityManager } from './types'
import {
  CheckoutStepType,
  EntityType,
  PaymentMethod,
  WebsiteFrameworkId,
  defaultWebsiteAggregateKey,
  defaultWebsiteChannel,
} from '@/helpers/constants'
import { WebsiteFolderField } from '@/hooks/form/useAddWebsiteFolder'
import { websiteSchema, ipfsCIDSchema } from '@/helpers/schemas/website'
import { DomainField } from '@/hooks/form/useAddDomains'
import { NameAndTagsField } from '@/hooks/form/useAddNameAndTags'
import { WebsiteFrameworkField } from '@/hooks/form/useSelectWebsiteFramework'
import { FileManager } from './file'
import { Volume, VolumeManager } from './volume'
import { Domain, DomainManager } from './domain'
import { getDate, humanReadableSize } from '@/helpers/utils'
import Err from '@/helpers/errors'
import { ItemType, MessageCostLine } from '@aleph-sdk/message'
import { Blockchain } from '@aleph-sdk/core'
import {
  AlephHttpClient,
  AuthenticatedAlephHttpClient,
} from '@aleph-sdk/client'
import { CostLine, CostSummary } from './cost'
import { mockAccount } from './account'

export { WebsiteFrameworkId }

export type WebsiteFramework = {
  id: WebsiteFrameworkId
  name: string
  docs?: Array<{ type: 'text' | 'code'; value: string; height?: string }>
}

export const WebsiteFrameworks: Record<WebsiteFrameworkId, WebsiteFramework> = {
  [WebsiteFrameworkId.none]: {
    id: WebsiteFrameworkId.none,
    name: 'Not Specified',
    docs: [
      {
        type: 'text',
        value:
          "Select this option if you don't use any framework or if you are using one that isn't listed. In the next step, your static folder must contain at least an index.html file, it will be the entrypoint of your website.",
      },
    ],
  },
  [WebsiteFrameworkId.nextjs]: {
    id: WebsiteFrameworkId.nextjs,
    name: 'Next.js',
    docs: [
      {
        type: 'text',
        value: 'Create a Next.js project',
      },
      {
        type: 'code',
        value: `npx create-next-app@latest
cd my-app`,
      },
      {
        type: 'text',
        value: 'Add the following parameters to nextConfig in next.config.js',
      },
      {
        type: 'code',
        height: '8rem',
        value: `output: "export",
trailingSlash: true,
images: { unoptimized: true },`,
      },
      { type: 'text', value: 'Build the static website' },
      {
        type: 'code',
        value: `npm install
npm run build`,
      },
    ],
  },
  [WebsiteFrameworkId.react]: {
    id: WebsiteFrameworkId.react,
    name: 'React',
    docs: [
      {
        type: 'text',
        value: 'Create a React project',
      },
      {
        type: 'code',
        value: `npx create-react-app@latest my-react-app
cd my-react-app`,
      },
      { type: 'text', value: 'Build the static website' },
      {
        type: 'code',
        value: `npm install
npm run build`,
      },
    ],
  },
  [WebsiteFrameworkId.vue]: {
    id: WebsiteFrameworkId.vue,
    name: 'Vue.js',
    docs: [
      {
        type: 'text',
        value: 'Create a Vue.js project',
      },
      {
        type: 'code',
        value: `npm create vue@latest
cd vue-project`,
      },
      { type: 'text', value: 'Build the static website' },
      {
        type: 'code',
        value: `npm install
npm run build`,
      },
    ],
  },
  /* [WebsiteFrameworkId.gatsby]: {
    id: WebsiteFrameworkId.gatsby,
    name: 'React + Gatsby',
    docs: [
      {
        type: 'text',
        value: 'Install Gatsby and create the project',
      },
      {
        type: 'code',
        value: `npm init gatsby
cd my-gatsby-site`,
      },
      { type: 'text', value: 'Build the static files and zip them' },
      {
        type: 'code',
        value: `npm run build
(cd public; zip -r ../website.zip .)`,
      },
    ],
  },
  [WebsiteFrameworkId.svelte]: {
    id: WebsiteFrameworkId.svelte,
    name: 'Svelte',
    docs: [
      {
        type: 'text',
        value: 'Install Svelte Kit and create the project',
      },
      {
        type: 'code',
        height: '8rem',
        value: `npm create svelte@latest my-app
cd my-app
npm install`,
      },
      {
        type: 'text',
        value: 'Install the adapter-static to generate static files',
      },
      {
        type: 'code',
        value: 'npm i -D @sveltejs/adapter-static',
      },
      {
        type: 'text',
        value: 'Add the adapter to your svelte.config.js',
      },
      {
        type: 'code',
        height: '30rem',
        value: `// svelte.config.js

import adapter from '@sveltejs/adapter-static';

export default {
  kit: {
    adapter: adapter({
      // default options are shown. On some platforms
      // these options are set automatically — see below
      pages: 'build',
      assets: 'build',
      fallback: undefined,
      precompress: false,
      strict: true
    })
  }
};`,
      },
      {
        type: 'text',
        value: 'Add the prerender option to your root layout',
      },
      {
        type: 'code',
        height: '10rem',
        value: `// src/routes/+layout.js

// This can be false if you're using a fallback (i.e. SPA mode)
export const prerender = true;`,
      },
      { type: 'text', value: 'Build the static files and zip them' },
      {
        type: 'code',
        value: `npm run build
(cd build; zip -r ../website.zip .)`,
      },
    ],
  },
  [WebsiteFrameworkId.nuxt]: {
    id: WebsiteFrameworkId.nuxt,
    name: 'Vue + Nuxt',
    docs: [
      {
        type: 'text',
        value: 'Install Nuxt and create the project',
      },
      {
        type: 'code',
        value: `npx nuxi@latest init
cd nuxt-app`,
      },
      { type: 'text', value: 'Build the static files and zip them' },
      {
        type: 'code',
        value: `npx nuxi generate
(cd dist; zip -r ../website.zip .)`,
      },
    ],
  },
  [WebsiteFrameworkId.angular]: {
    id: WebsiteFrameworkId.angular,
    name: 'Angular',
    docs: [
      {
        type: 'text',
        value: 'Install Angular cli and create the project',
      },
      {
        type: 'code',
        height: '8rem',
        value: `npm install -g @angular/cli
ng new my-app
cd my-app`,
      },
      { type: 'text', value: 'Build the static files and zip them' },
      {
        type: 'code',
        value: `npm run build
(cd dist/my-app/browser; zip -r ../../../website.zip .)`,
      },
    ],
  } */
}

export type WebsitePayment = {
  chain: Blockchain
  type: PaymentMethod
}

export type WebsiteCostProps = {
  website?: WebsiteFolderField
  paymentMethod?: PaymentMethod
}

export type WebsiteCost = CostSummary

export type AddWebsite = NameAndTagsField &
  WebsiteFrameworkField & {
    website: WebsiteFolderField
    payment?: WebsitePayment
    domains?: Omit<DomainField, 'ref'>[]
    ens?: string[]
  }

export type WebsiteMetadata = NameAndTagsField & WebsiteFrameworkField

export type WebsiteAggregateItem = {
  metadata: WebsiteMetadata
  payment: WebsitePayment
  version: number
  volume_id: string
  history?: Record<string, string>
  ens?: string[]
  created_at: string
  updated_at: string
}

export type WebsiteAggregate = Record<string, WebsiteAggregateItem | null>

export type Website = WebsiteAggregateItem & {
  id: string
  type: EntityType.Website
  name: string
  date: string
  size: number
  refUrl: string
  confirmed: boolean
}

export type HistoryVolumes = Record<string, Volume>

export class WebsiteManager implements EntityManager<Website, AddWebsite> {
  static addSchema = websiteSchema
  static updateCid = ipfsCIDSchema

  static async getWebsiteSize(
    props: AddWebsite | WebsiteCostProps,
  ): Promise<number> {
    return FileManager.getFolderSize(props.website?.folder)
  }

  constructor(
    protected account: Account | undefined,
    protected sdkClient: AlephHttpClient | AuthenticatedAlephHttpClient,
    protected volumeManager: VolumeManager,
    protected domainManager: DomainManager,
    protected key = defaultWebsiteAggregateKey,
    protected channel = defaultWebsiteChannel,
  ) {}

  async getAll(): Promise<Website[]> {
    if (!this.account) return []

    try {
      const response: Record<string, unknown> =
        await this.sdkClient.fetchAggregate(this.account.address, this.key)

      return this.parseAggregate(response)
    } catch (err) {
      return []
    }
  }

  async get(id: string): Promise<Website | undefined> {
    const entities = await this.getAll()
    return entities.find((entity) => entity.id === id)
  }

  async add(website: AddWebsite): Promise<Website> {
    const steps = this.addSteps(website)

    while (true) {
      const { value, done } = await steps.next()
      if (done) return value
    }
  }

  async *addSteps(newWebsite: AddWebsite): AsyncGenerator<void, Website, void> {
    const { website, name, tags, framework, payment, domains, ens } =
      await this.parseNewWebsite(newWebsite)

    try {
      if (!(this.sdkClient instanceof AuthenticatedAlephHttpClient))
        throw Err.InvalidAccount

      // Publish volume
      yield
      const volume = await (
        this.sdkClient as AuthenticatedAlephHttpClient
      ).createStore({
        channel: this.channel,
        fileHash: website.cid as string,
        storageEngine: ItemType.ipfs,
      })
      const volumeEntity = (await this.volumeManager.parseMessages([volume]))[0]

      // Publish website
      const date = Date.now() / 1000
      const content: Record<string, any> = {
        [name]: {
          metadata: {
            name,
            tags,
            framework,
          },
          payment,
          version: 1,
          volume_id: volume.item_hash,
          ens,
          created_at: date,
          updated_at: date,
        },
      }
      yield
      const websiteEntity = await this.sdkClient.createAggregate({
        key: this.key,
        channel: this.channel,
        content,
      })
      const entity = (await this.parseNewAggregate(websiteEntity))[0]

      // Publish domains
      if (domains && domains.length > 0)
        yield* this.parseDomainsSteps(volumeEntity.id, domains)

      return entity
    } catch (err) {
      throw Err.RequestFailed(err)
    }
  }

  async del(websiteOrCid: string | Website): Promise<void> {
    websiteOrCid =
      typeof websiteOrCid === 'string' ? websiteOrCid : websiteOrCid.id

    if (!(this.sdkClient instanceof AuthenticatedAlephHttpClient))
      throw Err.InvalidAccount

    const content: WebsiteAggregate = {
      [websiteOrCid]: null,
    }

    try {
      await this.sdkClient.createAggregate({
        key: this.key,
        channel: this.channel,
        content,
      })
    } catch (err) {
      throw Err.RequestFailed(err)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async download(websiteOrId: string | Website): Promise<void> {
    throw Err.MethodNotImplemented
  }

  async getAddSteps(newWebsite: AddWebsite): Promise<CheckoutStepType[]> {
    const steps: CheckoutStepType[] = []
    const valid = await this.parseNewWebsite(newWebsite)
    if (valid) {
      steps.push('volume')
      steps.push('website')
      // @note: Aggregate all signatures in 1 step
      if (valid.domains && valid.domains.length > 0) steps.push('domain')
    }
    return steps
  }

  async getDelSteps(
    websitesOrIds: string | Website | (string | Website)[],
  ): Promise<CheckoutStepType[]> {
    const steps: CheckoutStepType[] = []
    websitesOrIds = Array.isArray(websitesOrIds)
      ? websitesOrIds
      : [websitesOrIds]
    websitesOrIds.forEach(() => {
      steps.push('volumeDel')
      steps.push('websiteDel')
    })
    return steps
  }

  async *delSteps(
    websitesOrIds: string | Website | (string | Website)[],
  ): AsyncGenerator<void> {
    if (!(this.sdkClient instanceof AuthenticatedAlephHttpClient))
      throw Err.InvalidAccount

    websitesOrIds = Array.isArray(websitesOrIds)
      ? websitesOrIds
      : [websitesOrIds]
    if (websitesOrIds.length === 0) return

    try {
      for (const websiteOrId of websitesOrIds) {
        if (typeof websiteOrId !== 'string') {
          yield
          await this.volumeManager.del((websiteOrId as Website).volume_id)
          // Delete history volumes as well
          if (websiteOrId.history) {
            const uniqueVolumes = await Array.from(
              new Set(Object.values(websiteOrId.history)),
            )
            await Promise.all(
              uniqueVolumes.map(
                async (volume_id) => await this.volumeManager.del(volume_id),
              ),
            )
          }
        }
        yield
        await this.del(websiteOrId)
      }
    } catch (err) {
      throw Err.RequestFailed(err)
    }
  }

  async getUpdateSteps(
    cid?: string,
    version?: string,
    domains?: Domain[],
  ): Promise<CheckoutStepType[]> {
    const steps: CheckoutStepType[] = []
    if (!cid && !version) throw Err.MissingVolumeData
    else if (cid) steps.push('volumeUp')
    steps.push('websiteUp')
    // @note: Aggregate all signatures in 1 step
    if (domains && domains.length > 0) steps.push('domainUp')
    return steps
  }

  async *updateSteps(
    website: Website,
    cid?: string,
    version?: string,
    domains?: Domain[],
    history?: HistoryVolumes,
  ): AsyncGenerator<void, Website, void> {
    try {
      if (!(this.sdkClient instanceof AuthenticatedAlephHttpClient))
        throw Err.InvalidAccount

      let volumeId = ''
      if (cid) {
        cid = await WebsiteManager.updateCid.parseAsync(cid)
        // Publish volume
        yield
        const volume = await (
          this.sdkClient as AuthenticatedAlephHttpClient
        ).createStore({
          channel: this.channel,
          fileHash: cid,
          storageEngine: ItemType.ipfs,
        })
        const volumeEntity = (
          await this.volumeManager.parseMessages([volume])
        )[0]
        volumeId = volumeEntity.id
      }
      if (version) {
        // Select volume from history
        volumeId = website.history?.[version] || ''
        if (volumeId) await this.volumeManager.get(volumeId)
      }
      if (!volumeId) throw Err.MissingVolumeData

      // Publish website
      const recentHistory =
        (history &&
          Object.fromEntries(
            Object.entries(history).map((item) => [item[0], item[1].id]),
          )) ||
        {}
      const date = Date.now() / 1000
      const content: Record<string, any> = {
        [website.id]: {
          metadata: website.metadata,
          payment: website.payment,
          version: website.version + 1,
          volume_id: volumeId,
          history: {
            [website.version.toString()]: website.volume_id,
            ...recentHistory,
          },
          ens: website.ens,
          created_at: website.created_at,
          updated_at: date,
        },
      }
      yield
      const websiteEntity = await this.sdkClient.createAggregate({
        key: this.key,
        channel: this.channel,
        content,
      })
      const entity = (await this.parseNewAggregate(websiteEntity))[0]

      // Publish domains
      if (domains && domains.length > 0)
        yield* this.parseDomainsSteps(volumeId, domains)

      return entity
    } catch (err) {
      throw Err.RequestFailed(err)
    }
  }

  async getDomains(website: Website): Promise<Domain[]> {
    const domains = await this.domainManager.getAll()
    return domains.filter((domain) => domain.ref === website.volume_id)
  }

  async getHistoryVolumes(
    website?: Website,
  ): Promise<HistoryVolumes | undefined> {
    if (website?.history) {
      const history: [string, string][] = Object.entries(website.history)
        .sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
        .slice(0, 10)

      if (history.length > 0) {
        const volumes = await this.volumeManager.getAll({
          ids: history.map((item) => item[1]),
          page: 1,
          pagination: 10,
        })
        return Object.fromEntries(
          history
            .map((item) => [
              item[0],
              volumes.find((volume) => volume.id === item[1]),
            ])
            .filter(([, volume]) => !!volume),
        )
      }
    }
  }

  async getCost(props: WebsiteCostProps): Promise<WebsiteCost> {
    let totalCost = Number.POSITIVE_INFINITY

    const { website, paymentMethod = PaymentMethod.Hold } = props

    const emptyCost: WebsiteCost = {
      paymentMethod,
      cost: totalCost,
      lines: [],
    }

    if (!website) return emptyCost
    if (!website.folder) return emptyCost

    const fileObject = new Blob(website.folder)

    const { account = mockAccount } = this

    const costs = await this.sdkClient.storeClient.getEstimatedCost({
      account,
      fileObject,
    })

    totalCost = Number(costs.cost)

    const lines = this.getCostLines(fileObject, paymentMethod, costs.detail)

    return {
      paymentMethod,
      cost: totalCost,
      lines,
    }
  }

  protected getCostLines(
    fileObject: Blob,
    paymentMethod: PaymentMethod,
    costDetailLines: MessageCostLine[],
  ): CostLine[] {
    fileObject.name
    return costDetailLines.map((line) => ({
      id: 'New website folder',
      name: line.name,
      detail: humanReadableSize(fileObject.size),
      cost:
        paymentMethod === PaymentMethod.Hold
          ? +line.cost_hold
          : +line.cost_stream,
    }))
  }

  protected async parseNewWebsite(website: AddWebsite): Promise<AddWebsite> {
    return await WebsiteManager.addSchema.parseAsync(website)
  }

  protected async *parseDomainsSteps(
    ref: string,
    domains?: Omit<DomainField, 'ref'>[],
  ): AsyncGenerator<void, Domain[], void> {
    if (!domains || domains.length === 0) return []
    const parsedDomains = domains.map((domain) => ({
      ...domain,
      ref,
    }))
    return yield* this.domainManager.addSteps(parsedDomains, 'override')
  }

  protected async parseNewAggregate(response: any): Promise<Website[]> {
    const websites = response.content.content as WebsiteAggregate
    return await this.parseAggregateItems(websites)
  }

  protected async parseAggregate(response: any): Promise<Website[]> {
    return await this.parseAggregateItems(response as WebsiteAggregate)
  }

  protected async parseAggregateItems(
    aggregate: WebsiteAggregate,
  ): Promise<Website[]> {
    return Promise.all(
      Object.entries(aggregate)
        .filter(([, value]) => value !== null)
        .map(
          async ([key, value]) =>
            await this.parseAggregateItem(key, value as WebsiteAggregateItem),
        ),
    )
  }

  protected async parseAggregateItem(
    name: string,
    content: WebsiteAggregateItem,
  ): Promise<Website> {
    const {
      metadata,
      payment,
      version,
      volume_id,
      history,
      ens,
      created_at,
      updated_at,
    } = content
    const date = getDate(updated_at)
    return {
      id: name,
      name,
      type: EntityType.Website,
      metadata,
      payment,
      version,
      volume_id,
      history,
      ens,
      created_at: created_at,
      updated_at: date,
      date,
      size: 0,
      refUrl: `/storage/volume/${volume_id}`,
      confirmed: true,
    }
  }
}
