import Head from 'next/head'
import { Navbar, TextGradient } from '@aleph-front/aleph-core'
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
        <Navbar />
        <Container>
          <TextGradient type='h1' color='main1'>Instances</TextGradient>
        </Container>
      </main>
    </>
  )
}
