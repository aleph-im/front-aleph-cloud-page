import { Account } from '@aleph-sdk/account'
import { EntityManager } from './types'
import {
  CheckoutStepType,
  EntityType,
  PaymentMethod,
  WebsiteFrameworkId,
  defaultWebsiteChannel,
} from '@/helpers/constants'
import { WebsiteFolderField } from '@/hooks/form/useAddWebsiteFolder'
import { StreamDurationField } from '@/hooks/form/useSelectStreamDuration'
import { websiteDataSchema, websiteSchema } from '@/helpers/schemas/website'
import { DomainField } from '@/hooks/form/useAddDomains'
import { NameAndTagsField } from '@/hooks/form/useAddNameAndTags'
import { WebsiteFrameworkField } from '@/hooks/form/useSelectWebsiteFramework'
import { FileManager } from './file'
import { BaseVolume } from './volume'
import { getDate, getExplorerURL } from '@/helpers/utils'
import Err from '../helpers/errors'
import { ItemType, MessageType } from '@aleph-sdk/message'
import { AddDomain, DomainManager } from './domain'
import { ipfsCIDSchema } from '@/helpers/schemas/base'
import {
  AlephHttpClient,
  AuthenticatedAlephHttpClient,
} from '@aleph-sdk/client'

export { WebsiteFrameworkId }

export type WebsiteFramework = {
  id: WebsiteFrameworkId
  name: string
  docs?: Array<{ type: 'text' | 'code'; value: string; height?: string }>
}

export const WebsiteFrameworks: Record<WebsiteFrameworkId, WebsiteFramework> = {
  [WebsiteFrameworkId.none]: {
    id: WebsiteFrameworkId.none,
    name: 'No framework',
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
  /* [WebsiteFrameworkId.react]: {
    id: WebsiteFrameworkId.react,
    name: 'React + CRA',
    docs: [
      {
        type: 'text',
        value: 'Install create-react-app and create the project',
      },
      {
        type: 'code',
        value: `npx create-react-app my-app
cd my-app`,
      },
      { type: 'text', value: 'Build the static files and zip them' },
      {
        type: 'code',
        value: `npm run build
(cd build; zip -r ../website.zip .)`,
      },
    ],
  },
  [WebsiteFrameworkId.gatsby]: {
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
  [WebsiteFrameworkId.vue]: {
    id: WebsiteFrameworkId.vue,
    name: 'Vue',
    docs: [
      {
        type: 'text',
        value: 'Install Vue and create the project',
      },
      {
        type: 'code',
        height: '8rem',
        value: `npm create vue@latest
cd vue-project
npm install
`,
      },
      { type: 'text', value: 'Build the static files and zip them' },
      {
        type: 'code',
        value: `npm run build
(cd dist; zip -r ../website.zip .)`,
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

export type CustomWebsiteFrameworkField = string

export type WebsiteCost = {
  totalCost: number
  totalStreamCost: number
}

export type WebsiteCostProps = {
  website?: WebsiteFolderField
  paymentMethod?: PaymentMethod
  streamDuration?: StreamDurationField
}

export type NewWebsite = BaseVolume &
  NameAndTagsField & {
    type: EntityType.Website
    fileHash: string
    useLatest: boolean
  }

export type Website = NewWebsite

export type AddWebsite = NameAndTagsField &
  WebsiteFrameworkField & {
    website: WebsiteFolderField
    domains?: Omit<DomainField, 'ref'>[]
    paymentMethod: PaymentMethod
  }

export class WebsiteManager implements EntityManager<Website, AddWebsite> {
  static addSchema = websiteSchema
  static addIPFSCIDSchema = ipfsCIDSchema
  static addWebsiteDataSchema = websiteDataSchema

  static async getWebsiteSize(
    props: AddWebsite | WebsiteCostProps,
  ): Promise<number> {
    return FileManager.getFolderSize(props.website?.folder)
  }

  static getStorageWebsiteMiBPrice(
    props: AddWebsite | WebsiteCostProps,
  ): number {
    return 0
  }

  static getExecutionWebsiteMiBPrice(
    props: AddWebsite | WebsiteCostProps,
  ): number {
    return props.paymentMethod === PaymentMethod.Hold ? 1 / 20 : 0.001 / 1024
  }

  static async getCost(props: WebsiteCostProps): Promise<WebsiteCost> {
    const size = await this.getWebsiteSize(props)
    const fixedCost = 50
    const mibStoragePrice = this.getStorageWebsiteMiBPrice(props)
    const mibExecutionPrice = this.getExecutionWebsiteMiBPrice(props)
    return {
      totalCost: props.website?.folder
        ? fixedCost + size * mibStoragePrice + size * mibExecutionPrice
        : 0,
      totalStreamCost: 0,
    }
  }

  constructor(
    protected account: Account,
    protected sdkClient: AlephHttpClient | AuthenticatedAlephHttpClient,
    protected domainManager: DomainManager,
    protected channel = defaultWebsiteChannel,
  ) {}

  async getAll(): Promise<Website[]> {
    try {
      const response = await this.sdkClient.getMessages({
        addresses: [this.account.address],
        messageTypes: [MessageType.store],
        channels: [this.channel],
      })

      return await this.parseMessages(response.messages)
    } catch (err) {
      return []
    }
  }

  async get(id: string): Promise<Website | undefined> {
    const message = await this.sdkClient.getMessage(id)

    const [entity] = await this.parseMessages([message])
    return entity
  }

  async add(website: AddWebsite): Promise<Website> {
    const steps = this.addSteps(website)

    while (true) {
      const { value, done } = await steps.next()
      if (done) return value
    }
  }

  async *addSteps(website: AddWebsite): AsyncGenerator<void, Website, void> {
    const {
      website: data,
      domains,
      name,
      tags,
      framework,
      paymentMethod,
    } = await this.parseNewWebsite(website)
    const metadata = this.parseMetadata(name, tags, {
      framework,
      paymentMethod,
    })
    try {
      yield
      const response = await (
        this.sdkClient as AuthenticatedAlephHttpClient
      ).createStore({
        channel: this.channel,
        fileHash: data.cid!,
        storageEngine: ItemType.ipfs,
        extraFields: metadata,
      })

      const entity = (await this.parseMessages([response]))[0]
      return entity
    } catch (err) {
      throw Err.RequestFailed(err)
    }
  }

  async del(websiteOrCid: string | Website): Promise<void> {
    websiteOrCid =
      typeof websiteOrCid === 'string' ? websiteOrCid : websiteOrCid.fileHash

    if (!(this.sdkClient instanceof AuthenticatedAlephHttpClient))
      throw Err.InvalidAccount

    try {
      await this.sdkClient.forget({
        channel: this.channel,
        hashes: [websiteOrCid],
      })
    } catch (err) {
      throw Err.RequestFailed(err)
    }
  }

  async download(websiteOrId: string | Website): Promise<void> {
    throw new Error('Method not implemented.')
  }

  protected async parseNewWebsite(website: AddWebsite): Promise<AddWebsite> {
    const { name, tags, framework, paymentMethod } = website
    const websiteData = await WebsiteManager.addWebsiteDataSchema.parseAsync(
      website.website,
    )
    const domains = await this.parseDomains(website.domains)
    return {
      website: websiteData,
      domains,
      name,
      tags,
      framework,
      paymentMethod,
    }
  }

  protected async parseDomains(
    domains?: Omit<DomainField, 'ref'>[],
  ): Promise<Omit<DomainField, 'ref'>[]> {
    if (!domains || domains.length === 0) return []
    return await DomainManager.addManySchema.parseAsync(domains)
  }

  protected parseMetadata(
    name = 'Untitled',
    tags?: string[],
    metadata?: Record<string, unknown>,
  ): Record<string, unknown> {
    const out: Record<string, unknown> = { name }
    if (tags && tags.length > 0) {
      out.tags = tags
    }
    return {
      ...metadata,
      ...out,
    }
  }

  async getSteps(newWebsite: AddWebsite): Promise<CheckoutStepType[]> {
    const steps: CheckoutStepType[] = []
    const valid = await this.parseNewWebsite(newWebsite)
    if (valid) steps.push('website')

    const domainSteps = await this.domainManager.getSteps(
      valid.domains as AddDomain[],
    )
    for (const step of domainSteps) steps.push(step)

    return steps
  }

  protected async parseMessages(messages: any[]): Promise<Website[]> {
    const tooOld = Date.now() - 3600 // 1h ago

    return (
      messages
        .filter(({ content }) => content !== undefined)
        // Fix: When forgetting/deleting a website, it still appears in the list
        .filter((message) => !!message.confirmed || tooOld < message.time)
        .map((message) => this.parseMessage(message, message.content))
    )
  }

  protected parseMessage(message: any, content: any): Website {
    return {
      id: message.item_hash,
      ...content,
      type: EntityType.Website,
      url: getExplorerURL(message),
      date: getDate(message.time),
      size: FileManager.getFileSize(message.item_hash),
      confirmed: !!message.confirmed,
    }
  }
}
