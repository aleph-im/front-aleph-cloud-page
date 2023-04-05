import { Col, Row, Table, Tabs, TextGradient } from '@aleph-front/aleph-core'
import ButtonLink from '@/components/ButtonLink'
import CenteredSection from '@/components/CenteredSection'
import AutoBreadcrumb from '@/components/AutoBreadcrumb'
import { convertBitUnits, ellipseAddress, humanReadableSize, isVolume, unixToISODateString } from '@/helpers/utils'
import { ProgramMessage } from 'aleph-sdk-ts/dist/messages/message'
import { useHomePage } from '@/hooks/pages/useHomePage'

export default function Home() {
  const { products, functions, volumes } = useHomePage()

  // FIXME: Selector function signature
  const TabContent = ({ data }: { data: ProgramMessage[] }) => (
    <div className="py-md">
      {products.length > 0 ?
        <Table
          border="none"
          oddRowNoise
          //@ts-ignore
          keySelector={(row: ProgramMessage) => row?.item_hash}
          data={data}
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
              selector: (row: ProgramMessage) => (
                isVolume(row)
                ? humanReadableSize(row.size)
                : convertBitUnits(
                  row.content?.volumes.reduce((ac, cv) => (ac += (cv?.size_mib || 0)), 0),
                  {
                    from: 'mb',
                    to: 'gb',
                    displayUnit: true
                  }
                )
              ),
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

        : <p>No products yet</p>
      }
    </div>
  )

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
          ]
        } />
      </CenteredSection>

      <section className="fx-noise-light py-lg">
        <TextGradient type="h3">Setup a new service</TextGradient>
        <Row count={4}>
          <Col>
            <div className="p-lg">
              <h5>Function</h5>
              <ButtonLink href="/solutions/dashboard/function">Setup Function</ButtonLink>
            </div>
          </Col>

          <Col>
            <div className="unavailable-content p-lg">
              <h5>Instance</h5>
              <ButtonLink href="/solutions/dashboard/instance">Setup Instance</ButtonLink>
            </div>
          </Col>
        </Row>

        <Row count={4}>
          <Col>
            <div className="unavailable-content p-lg">
              <h5>Immutable Volume</h5>
              <ButtonLink href="/solutions/dashboard/immutable-volume">Create volume</ButtonLink>
            </div>
          </Col>

          <Col>
            <div className="unavailable-content p-lg">
              <h5>Persistent Volume</h5>
              <ButtonLink href="/solutions/dashboard/persistent-volume">Create volume</ButtonLink>
            </div>
          </Col>

          <Col>
            <div className="unavailable-content p-lg">
              <h5>Distributed database</h5>
              <ButtonLink href="/solutions/dashboard/database">Create database</ButtonLink>
            </div>
          </Col>
        </Row>
      </section>
    </>
  )
}