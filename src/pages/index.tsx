import Head from 'next/head'
import { Button, Icon, Navbar, TextGradient } from '@aleph-front/aleph-core'
import Container from '@/components/Container'

export default function Home() {
  return (
    <>
      <Head>
        <title>Aleph.im Cloud Solution</title>
        <meta name="description" content="Aleph.im Cloud Solution" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Container>
          <Navbar
            navLinks={[
              <a key="solutions" href="#">Solutions</a>,
              <a key="dashboard" href="#">Dashboard</a>,
            ]}
            navButtons={[
              <Button key="link" as="a" color="main0" kind="neon" size="regular" variant="tertiary" disabled><Icon name="link-simple-slash" /></Button>,
              <Button key="connect" as="a" color="main0" kind="neon" size="regular" variant="tertiary">Connect <Icon name="meteor" size='lg' className='ml-xs' /></Button>
            ]}
          />
        </Container>
        <Container>
          <TextGradient type='h1' color='main1'>Computing</TextGradient>
          <p>With Aleph.im&apos;s computing services, you can process data quickly and securely using on-demand and persistent functions, virtual machine instances, and confidential VMs.</p>
        </Container>
      </main>
    </>
  )
}
