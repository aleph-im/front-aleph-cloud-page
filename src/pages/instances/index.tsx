import { useContext, useMemo } from 'react'
import Head from 'next/head'
import { Button, Icon, Navbar, Table, Tabs, TextGradient } from '@aleph-front/aleph-core'
import { Chain, ProgramMessage } from "aleph-sdk-ts/dist/messages/message";
import Container from '@/components/Container'
import { AppStateContext } from '@/pages/_app'
import { getAccountBalance, getAccountProducts, web3Connect } from '@/helpers/aleph'
import { ActionTypes } from '@/helpers/store'
import { ellipseAddress } from '@/helpers/utils'


export default function Home() {
  const { state, dispatch } = useContext(AppStateContext)

  const allProducts = useMemo(() => Object.values(state.products).flat(), [state])
  
  const login = async () => {
    const account = await web3Connect(Chain.ETH, window?.ethereum)
    dispatch({ type: ActionTypes.connect, payload: {account} })

    const balance = await getAccountBalance(account)
    dispatch({ type: ActionTypes.setAccountBalance, payload: {balance} })

    const products = await getAccountProducts(account)
    dispatch({ type: ActionTypes.setProducts, payload: {products} })
  }

  const ConnectionButton = ({address}: {address?: string}) =>  address !== undefined ? 
    <Button as="button" variant="secondary" color="main1" kind="neon" size="regular" >
      {ellipseAddress(address)} <Icon name="meteor" size="lg" className="ml-xs" />
    </Button> 
    :
    <Button onClick={login} as="button" variant="secondary" color="main0" kind="neon" size="regular" >
      Connect <Icon name="meteor" size="lg" className="ml-xs" />  
    </Button>

  const TabContent = ({data}) => (
    <div>
      <Table data={data} columns={[
        {
          label: "Name",
          selector: (row) => (row?.content?.metadata?.name || row?.item_hash),
          sortable: true,
        },
        {
          label: "vCPUs",
          selector: (row) => (row?.content?.resources?.vcpus || 0),
          sortable: true,
        },
        {
          label: "Has Volume?",
          selector: (row) => (row?.content?.volumes?.length > 0 ? 'Yes' : 'No'),
          sortable: true,
        },
      ]} />
    </div>
  )

  return (
    <>
      <Head>
        <title>Aleph.im Cloud Solution</title>
        <meta name="description" content="Aleph.im Cloud Solution" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Navbar />
        <Container>
          <TextGradient type='h1' color='main1'>Instances</TextGradient>
          <ConnectionButton address={state.account?.address} />
          { state.account?.address &&
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
                label: `(${state.products.instances?.length || 0})`,
                labelPosition: 'bottom'
              },
              { 
                name: 'Database', 
                component: <TabContent data={state.products.databases} />,
                disabled: true,
              },
            ]
          } />
        }
        </Container>
      </main>
    </>
  )
}
