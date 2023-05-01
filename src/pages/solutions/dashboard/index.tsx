import { Table, Tabs } from '@aleph-front/aleph-core'
import ButtonLink from '@/components/ButtonLink'
import CenteredSection from '@/components/CenteredSection'
import AutoBreadcrumb from '@/components/AutoBreadcrumb'
import {
  convertBitUnits,
  ellipseAddress,
  humanReadableSize,
  isVolume,
  isVolumePersistent,
  unixToISODateString,
} from '@/helpers/utils'
import {
  ProgramMessage,
  StoreMessage,
} from 'aleph-sdk-ts/dist/messages/message'
import { useHomePage } from '@/hooks/pages/useDashboardHomePage'
import { useMemo, useState } from 'react'
import {
  ImmutableVolume,
  PersistentVolume,
} from 'aleph-sdk-ts/dist/messages/program/programModel'

export default function DashboardHome() {
  const { products, functions, volumes } = useHomePage()
  const [tabId, setTabId] = useState('all')

  // FIXME: Selector function signature
  const TabContent = ({
    data,
  }: {
    data: (ProgramMessage | StoreMessage)[]
  }) => {
    const flattenedSizeData: ProgramMessage[] = useMemo(
      () =>
        data.map((product) => {
          if (!product?.type) return product

          if (isVolume(product)) {
            return {
              ...product,
              size: 0,
            }
          }
          return {
            ...product,
            size: (product as ProgramMessage).content?.volumes.reduce(
              (ac, cv) => {
                if(isVolumePersistent(cv)){
                  const persistentVolume = (cv as PersistentVolume)?.size_mib
                  return ac + persistentVolume * 10 ** 3
                }

                return ac
              },
              0,
            ),
          }
        }) as ProgramMessage[],
      [data],
    )

    return (
      <div tw="py-5">
        <Table
          borderType="none"
          oddRowNoise
          keySelector={(row: ProgramMessage) => row?.item_hash}
          data={flattenedSizeData}
          columns={[
            {
              label: 'Type',
              selector: (row: ProgramMessage) =>
                isVolume(row) ? 'Volume' : 'Function',
              sortable: true,
            },
            {
              label: 'Name',
              selector: (row: ProgramMessage) =>
                row?.content?.metadata?.name ||
                ellipseAddress(row?.item_hash || ''),
              sortable: true,
            },
            {
              label: 'Cores',
              selector: (row: ProgramMessage) =>
                row?.content?.resources?.vcpus || 0,
              sortable: true,
            },
            {
              label: 'Memory',
              selector: (row: ProgramMessage) =>
                convertBitUnits(row?.content?.resources?.memory || 0, {
                  from: 'mb',
                  to: 'gb',
                }),
              sortable: true,
            },
            {
              label: 'Size',
              selector: (row: ProgramMessage) => humanReadableSize(row.size),
              sortable: true,
            },
            {
              label: 'Date',
              selector: (row: ProgramMessage) =>
                unixToISODateString(row?.content?.time),
              sortable: true,
            },
            {
              label: '',
              selector: () => '',
              cell: (row: ProgramMessage) => (
                <ButtonLink
                  href={`/solutions/dashboard/manage?hash=${row?.item_hash}`}
                >
                  &gt;
                </ButtonLink>
              ),
            },
          ]}
        />
      </div>
    )
  }

  return (
    <>
      <section tw="py-6">
        <AutoBreadcrumb />
      </section>

      <CenteredSection tw="py-6">
        <Tabs
          selected={tabId}
          tabs={[
            {
              id: 'all',
              name: 'All',
              label: `(${products.length || 0})`,
              labelPosition: 'bottom',
            },
            {
              id: 'function',
              name: 'Functions',
              label: `(${functions?.length || 0})`,
              labelPosition: 'bottom',
            },
            {
              id: 'volume',
              name: 'Immutable Volumes',
              label: `(${volumes?.length || 0})`,
              labelPosition: 'bottom',
            },
          ]}
          onTabChange={setTabId}
        />
        <div role="tabpanel" tw="p-10">
          {tabId === 'all' ? (
            <TabContent data={products} />
          ) : tabId === 'function' ? (
            <>
              <TabContent data={functions || []} />
              <div tw="my-7 text-center">
                <ButtonLink
                  variant="primary"
                  href="/solutions/dashboard/function"
                >
                  Create function
                </ButtonLink>
              </div>
            </>
          ) : tabId === 'volume' ? (
            <>
              <TabContent data={volumes || []} />
              <div tw="my-7 text-center">
                <ButtonLink
                  variant="primary"
                  href="/solutions/dashboard/volume"
                >
                  Create volume
                </ButtonLink>
              </div>
            </>
          ) : (
            <></>
          )}
        </div>

        <p>
          Acquire aleph.im tokens for versatile access to resources within a
          defined duration. These tokens remain in your wallet without being
          locked or consumed, providing you with flexibility in utilizing
          aleph.im&apos;s infrastructure. If you choose to remove the tokens
          from your wallet, the allocated resources will be efficiently
          reclaimed. Feel free to use or hold the tokens according to your
          needs, even when not actively using Aleph.im&apos;s resources.
        </p>
      </CenteredSection>
    </>
  )
}
