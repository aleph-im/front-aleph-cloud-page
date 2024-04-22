import { Account } from '@superfluid-finance/sdk-core'
import { EntityManager } from './types'
import { NewVolume, VolumeManager } from './volume'
import {
  CheckoutStepType,
  PaymentMethod,
  VolumeType,
  WebsiteFrameworkId,
} from '@/helpers/constants'
import { WebsiteFileField } from '@/hooks/form/useAddWebsiteFile'
import { StreamDurationField } from '@/hooks/form/useSelectStreamDuration'
import { websiteSchema } from '@/helpers/schemas/website'
import { DomainField } from '@/hooks/form/useAddDomains'
import { NameAndTagsField } from '@/hooks/form/useAddNameAndTags'
import { WebsiteFrameworkField } from '@/hooks/form/useSelectWebsiteFramework'

export { WebsiteFrameworkId }

export type WebsiteFramework = {
  id: WebsiteFrameworkId
  name: string
  docs: Array<{ type: 'text' | 'code'; value: string; height?: string }>
}

export const WebsiteFrameworks: Record<WebsiteFrameworkId, WebsiteFramework> = {
  [WebsiteFrameworkId.none]: {
    id: WebsiteFrameworkId.none,
    name: 'No framework',
    docs: [
      { type: 'text', value: 'Zip the folder that includes the static files' },
      { type: 'code', value: `zip -r website.zip .` },
    ],
  },
  [WebsiteFrameworkId.react]: {
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
  [WebsiteFrameworkId.nextjs]: {
    id: WebsiteFrameworkId.nextjs,
    name: 'React + Next.js',
    docs: [
      {
        type: 'text',
        value: 'Install Next.js and create the project',
      },
      {
        type: 'code',
        value: `npx create-next-app@latest
cd my-app`,
      },
      {
        type: 'text',
        value: 'Edit the config file next.config.mjs to build static files',
      },
      {
        type: 'code',
        height: '15rem',
        value: `// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export' 
};

export default nextConfig;`,
      },
      { type: 'text', value: 'Build the static files and zip them' },
      {
        type: 'code',
        value: `npm run build
(cd out; zip -r ../website.zip .)`,
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
  },
}

export type CustomWebsiteFrameworkField = string

export type WebsiteCost = {
  totalCost: number
  totalStreamCost: number
}

export type WebsiteCostProps = WebsiteFileField & {
  paymentMethod?: PaymentMethod
  streamDuration?: StreamDurationField
}

export type Website = Omit<NewVolume, 'mountPath' | 'useLatest'>

export type AddWebsite = NameAndTagsField &
  WebsiteFrameworkField &
  WebsiteFileField & {
    domains?: DomainField[]
    paymentMethod: PaymentMethod
  }

export class WebsiteManager implements EntityManager<Website, AddWebsite> {
  static addSchema = websiteSchema

  static async getWebsiteSize(website: Website | AddWebsite): Promise<number> {
    return VolumeManager.getVolumeSize({
      volumeType: VolumeType.New,
      ...website,
    })
  }

  static async getCost(props: WebsiteCostProps): Promise<WebsiteCost> {
    const { file } = props

    const { totalCost, totalStreamCost } = await VolumeManager.getCost({
      ...props,
      sizeDiscount: 0,
      volumes: [
        {
          volumeType: VolumeType.New,
          file,
        },
      ],
    })

    return { totalCost, totalStreamCost }
  }

  constructor(
    protected account: Account,
    protected volumeManager: VolumeManager,
  ) {}

  getSteps(website: AddWebsite | AddWebsite[]): Promise<CheckoutStepType[]> {
    return this.volumeManager.getSteps({
      volumeType: VolumeType.New,
      ...website,
    })
  }

  getAll(): Promise<Website[]> {
    throw new Error('Method not implemented.')
  }

  get(id: string): Promise<Website | undefined> {
    throw new Error('Method not implemented.')
  }

  async add(website: AddWebsite): Promise<Website[]> {
    const volumes = await this.volumeManager.add({
      volumeType: VolumeType.New,
      ...website,
    })

    return volumes as Website[]
  }

  async *addSteps(website: AddWebsite): AsyncGenerator<void, Website[], void> {
    const gen = this.volumeManager.addSteps({
      volumeType: VolumeType.New,
      ...website,
    })

    return yield* gen as AsyncGenerator<void, Website[], void>
  }

  del(entityOrId: string | Website): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
