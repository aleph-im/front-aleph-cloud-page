import { Col, Row, Table, Tabs, TextGradient } from '@aleph-front/aleph-core'
import ButtonLink from '@/components/ButtonLink'
import CenteredSection from '@/components/CenteredSection'
import AutoBreadcrumb from '@/components/AutoBreadcrumb'
import { convertBitUnits, ellipseAddress, humanReadableSize, isVolume, unixToISODateString } from '@/helpers/utils'
import { ProgramMessage, StoreMessage } from 'aleph-sdk-ts/dist/messages/message'
import { useHomePage } from '@/hooks/pages/useDashboardHomePage'
import { useMemo } from 'react'

export default function DashboardHome() {
  const { products, functions, volumes } = useHomePage()

  // FIXME: Selector function signature
  const TabContent = ({ data }: { data: (ProgramMessage | StoreMessage)[] }) => {
    const flattenedSizeData = useMemo(
      () => data.map(
        product => {
          if (isVolume(product)) {
            return {
              ...product,
              size: (product as StoreMessage).size
            }
          }
          return {
            ...product,
            size: (product as ProgramMessage).content?.volumes
                  .reduce((ac, cv) => (
                    // FIXME: Volume is not properly defined in aleph-sdk-ts
                    // @ts-ignore
                    ac += (cv?.size_mib || 0)
                  ), 0)
          }
        }
      ), [data]
    )

    return (
      <div className="py-md">
        <Table
          border="none"
          oddRowNoise
          //@ts-ignore
          keySelector={(row: ProgramMessage) => row?.item_hash}
          data={flattenedSizeData}
          columns={[
            {
              label: "Type",
              // @ts-ignore 
              selector: (row) => isVolume(row) ? 'Volume' : 'Function',
              sortable: true,
            },
            {
              label: "Name",
              // @ts-ignore 
              selector: (row: ProgramMessage) => (row?.content?.metadata?.name || ellipseAddress(row?.item_hash || '')),
              sortable: true,
            },
            {
              label: "Cores",
              // @ts-ignore 
              selector: (row: ProgramMessage) => (row?.content?.resources?.vcpus || 0),
              sortable: true,
            },
            {
              label: "Memory",
              // @ts-ignore 
              selector: (row: ProgramMessage) => convertBitUnits(row?.content?.resources?.memory || 0, { from: 'mb', to: 'gb' }),
              sortable: true,
            },
            {
              label: "Size",
              // @ts-ignore 
              selector: (row: ProgramMessage) => (humanReadableSize(row.size)),
              sortable: true,
            },
            {
              label: "Date",
              // @ts-ignore 
              selector: (row: ProgramMessage) => unixToISODateString(row?.content?.time),
              sortable: true,
            },
            {
              label: "",
              selector: () => '',
              // @ts-ignore 
              cell: (row: ProgramMessage) => (
                <ButtonLink href={`/solutions/dashboard/manage?hash=${row?.item_hash}`}>
                  &gt;
                </ButtonLink>
              )
            }
          ]} />
      </div>
    )
  }

  return (
    <>
      <section className="py-lg">
        <AutoBreadcrumb />
      </section>

      <CenteredSection className="py-lg">
        <Tabs tabs={
          [
            {
              name: 'All',
              component: <TabContent data={products} />,
              label: `(${products.length || 0})`,
              labelPosition: 'bottom'
            },
            {
              name: 'Functions',
              component: <TabContent data={functions || []} />,
              label: `(${functions?.length || 0})`,
              labelPosition: 'bottom'
            },
            {
              name: 'Volumes',
              component: <TabContent data={volumes || []} />,
              label: `(${volumes?.length || 0})`,
              labelPosition: 'bottom'
            }
          ]
        } />

        <p>Acquire aleph.im tokens for versatile access to resources within a defined duration. These tokens remain in your wallet without being locked or consumed, providing you with flexibility in utilizing aleph.im&apos;s infrastructure. If you choose to remove the tokens from your wallet, the allocated resources will be efficiently reclaimed. Feel free to use or hold the tokens according to your needs, even when not actively using Aleph.im&apos;s resources.</p>
      </CenteredSection>
    </>
  )
}