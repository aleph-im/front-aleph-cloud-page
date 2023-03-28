import { useContext, useEffect, useMemo } from 'react'
import { Col, Row, Table, Tabs, TextGradient } from '@aleph-front/aleph-core'

import useConnected from '@/helpers/hooks/useConnected'
import { AppStateContext } from '@/pages/_app'
import ButtonLink from '@/components/ButtonLink'
import CenteredSection from '@/components/CenteredSection'
import AutoBreadcrumb from '@/components/AutoBreadcrumb'
import { convertBitUnits, unixToISODateString } from '@/helpers/utils'
import { ProgramMessage } from 'aleph-sdk-ts/dist/messages/message'
import { getAccountProducts } from '@/helpers/aleph'
import { ActionTypes } from '@/helpers/store'

export default function Home(){
    useConnected()
    const [ state, dispatch ] = useContext(AppStateContext)
    const allProducts = useMemo(() => Object.values(state.products).flat(), [state])

    useEffect(() => {
      const dipatchMessages = async () => {
        // Account instanciation is protected by useConnected hook
        // @ts-ignore
        const products = await getAccountProducts(state.account)
        dispatch({ type: ActionTypes.setProducts, payload: {products} })
      }

      dipatchMessages()
    }, [])

    // FIXME: Selector function signature
    const TabContent = ({data}: { data: ProgramMessage[]}) => (
      <div className="pt-md">
        { allProducts.length > 0 ?
        <Table 
          border="none" 
          oddRowNoise data={data} 
          columns={[
          {
            label: "Type",
            // @ts-ignore 
            selector: (row: ProgramMessage) => (row?.content?.on?.persistent ? 'Instance' : 'Function'),
            sortable: true,
          },
          {
            label: "Name",
            // @ts-ignore 
            selector: (row: ProgramMessage) => (row?.content?.metadata?.name || row?.item_hash),
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
            selector: (row: ProgramMessage) => (row.content?.volumes.length || 0),
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
                component: <TabContent data={state.products.functions || []} />,
                label: `(${state.products.functions?.length || 0})`,
                labelPosition: 'bottom'
              },
              { 
                name: 'Instance', 
                component: <TabContent data={state.products.instances || []} />,
                disabled: true,
                label: '(Soon)'
              },
              { 
                name: 'Database', 
                component: <TabContent data={state.products.databases || []} />,
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