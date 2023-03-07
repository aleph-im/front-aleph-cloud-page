import { useContext, useMemo } from 'react'
import { Col, Row, Table, Tabs, TextGradient } from '@aleph-front/aleph-core'

import useConnected from '@/helpers/hooks/useConnected'
import { AppStateContext } from '@/pages/_app'
import ButtonLink from '@/components/ButtonLink'
import CenteredSection from '@/components/CenteredSection'
import AutoBreadcrumb from '@/components/AutoBreadcrumb'
import { ISODate } from '@/helpers/utils'

export default function Home(){
    useConnected()
    const { state, dispatch } = useContext(AppStateContext)
    const allProducts = useMemo(() => Object.values(state.products).flat(), [state])

    const TabContent = ({data}) => (
      <div className="pt-md">
        <Table border="none" oddRowNoise data={data} columns={[
          {
            label: "Type",
            selector: (row) => (row?.content?.on?.persistent ? 'Instance' : 'Function'),
            sortable: true,
          },
          {
            label: "Name",
            selector: (row) => (row?.content?.metadata?.name || row?.item_hash),
            sortable: true,
          },
          {
            label: "Cores",
            selector: (row) => (row?.content?.resources?.vcpus || 0),
            sortable: true,
          },
          {
            label: "Memory",
            selector: (row) => (row?.content?.resources?.memory || 0),
            sortable: true,
          },
          {
            label: "Size",
            selector: (row) => (row.content?.volumes.length || 0),
            cell: () => 'n/a',
            sortable: true,
          },
          {
            label: "Date",
            selector: (row) => ISODate(row?.content?.time),
            sortable: true,
          }
        ]} />
      </div>
    )

    return (
    <>
      <section className="p-lg">
        <AutoBreadcrumb /> 
      </section>

      <CenteredSection className="p-lg">
        <Tabs tabs={
            [
              { 
                name: 'All', 
                component: <TabContent data={allProducts} />,
                label: `(${allProducts.length || 0})`,
                labelPosition: 'bottom'
              },
              { 
                name: 'Functions', 
                component: <TabContent data={state.products.functions} />,
                label: `(${state.products.functions?.length || 0})`,
                labelPosition: 'bottom'
              },
              { 
                name: 'Instance', 
                component: <TabContent data={state.products.instances} />,
                disabled: true,
                label: '(Soon)'
              },
              { 
                name: 'Database', 
                component: <TabContent data={state.products.databases} />,
                disabled: true,
                label: '(Soon)'
              },
            ]
          } />
      </CenteredSection>

      <section className="fx-noise-light p-lg">
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