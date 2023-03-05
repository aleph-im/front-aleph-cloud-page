import Head from 'next/head'
import styled, { css } from 'styled-components'
import { Button, Card, Col, Row, TextGradient, Tag } from '@aleph-front/aleph-core'
import Container from '@/components/Container'
import { IndexingImg } from '@/components/Imgs/IndexingImg'

const StyledSection = styled.section`
  padding: 82px 0;
`

const StyledCard = styled(Card).attrs(props => {
  return {
    ...props,
    variant: "block",
    buttonColor: "main0",
    buttonVariant: "secondary",
    buttonHref: "#",
    buttonOnClick: () => { },
  }
})``

const StyledTag = styled(Tag).attrs(props => {
  return {
    ...props,
    className: `${props.className} mt-md mr-sm`
  }
})``

export default function Home() {
  return (
    <>
      <Head>
        <title>Aleph.im Cloud Solutions</title>
        <meta name="description" content="Aleph.im Cloud Solution" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon-32x32.png" />
      </Head>
      <main>
        <StyledSection className='pb-0'>
          <Container>
            <TextGradient type='h1' color='main1'>Computing</TextGradient>
            <p className='fs-md'>With Aleph.im&apos;s computing services, you can process data quickly and securely using on-demand and persistent functions, virtual machine instances, and confidential VMs.</p>
          </Container>
        </StyledSection>
        <StyledSection>
          <Container>
            <Row count={4}>
              <Col>
                <StyledCard
                  title="Function"
                  text="An isolated environment  created for a  function to execute in response to an event and can run in two modes: on-demand or persistent."
                  buttonLabel="Setup function"
                  headerImg="Object1"
                />
              </Col>
              <Col>
                <StyledCard
                  title="Instance"
                  text="A virtual machine that runs on a Aleph.im's infrastructure that can be configured with CPUs, memory, storage, and networking."
                  buttonLabel="Setup instance"
                  headerImg="Object3"
                />
              </Col>
              <Col>
                <StyledCard
                  title="Confidential VM"
                  text="A virtual machine running for an extended period with their memory, storage, and execution fully encrypted and isolated from the host."
                  buttonLabel="Create Confidential VM"
                  headerImg="Object7"
                />
              </Col>
            </Row>
          </Container>
        </StyledSection>
        <StyledSection className='fx-noise-light'>
          <Container>
            <Row count={2}>
              <Col><IndexingImg /></Col>
              <Col>
                <span className="tp-info mb-0">SOLANA - ETHEREUM - BINANCE SMART CHAIN</span>
                <TextGradient type='h3' as='h1' color='main0'>Indexing framework</TextGradient>
                <p className='fs-md mb-xxl'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris convallis, quam quis vehicula pulvinar, nisl elit finibus sem.</p>
                <Button kind='neon' variant='primary' size='big' color='main0' className='my-lg'>Get in touch with us</Button>
                <p className='fs-xs m-0'>By clicking the button you confirming that you’re agree with our following  .</p>
              </Col>
            </Row>
          </Container>
        </StyledSection>
        <StyledSection className='pb-0'>
          <Container>
            <TextGradient type='h1' color='main1'>Storage</TextGradient>
            <p className='fs-md'>With support for immutable, temporary, and persistent volumes, as well as databases using key-value pairs, Aleph.im provides a flexible and powerful storage solution for a wide range of use cases.</p>
          </Container>
        </StyledSection>
        <StyledSection>
          <Container>
            <Row count={4}>
              <Col>
                <StyledCard
                  title="Immutable volume"
                  text="Immutable volumes store unchangeable data on IPFS, pinned to multiple nodes for reliable access."
                  buttonLabel="Create volume"
                  headerImg="Object6"
                />
              </Col>
              <Col>
                <StyledCard
                  title="Persistent volume"
                  text="Designed to hold data or files over an extended period of time and can also be mounted and accessed by multiple instances."
                  buttonLabel="Create volume"
                  headerImg="Object7"
                />
              </Col>
              <Col>
                <StyledCard
                  title="Database"
                  text="The network enables the use of databases that store data as key-value pairs for easy data retrieval and management."
                  buttonLabel="Create database"
                  headerImg="Object2"
                />
              </Col>
              <Col>
                <StyledCard
                  title="Temporarily volume"
                  text="A volume that is created temporarily to hold data or files for a short period of time. After this time the volume is deleted."
                  buttonLabel="Create volume"
                  headerImg="Object5"
                />
              </Col>
            </Row>
          </Container>
        </StyledSection>
        <StyledSection>
          <Container>
            <h1 className='tp-h3 mb-lg'>Put it to work</h1>
            <Row count={2}>
              <Col>
                <h2 className='tp-h6 my-xxl'>How-to’s</h2>
                <Button className="d-block my-lg" kind='neon' variant='text-only' size='big' color='main0'>Host a website</Button>
                <Button className="d-block my-lg" kind='neon' variant='text-only' size='big' color='main0'>Store files now</Button>
                <Button className="d-block my-lg" kind='neon' variant='text-only' size='big' color='main0'>Pin a file</Button>
                <Button className="d-block my-lg" kind='neon' variant='text-only' size='big' color='main0'>Local VM’s for testing</Button>
                <Button className="d-block my-lg" kind='neon' variant='text-only' size='big' color='main0'>Start indexing</Button>
              </Col>
              <Col>
                <h2 className='tp-h6 my-xxl'>Learn best practice</h2>
                <Button className="d-block my-lg" kind='neon' variant='text-only' size='big' color='main0'>Trigger your VM</Button>
                <Button className="d-block my-lg" kind='neon' variant='text-only' size='big' color='main0'>Aggregates vs posts</Button>
                <Button className="d-block my-lg" kind='neon' variant='text-only' size='big' color='main0'>Encrypt your data</Button>
              </Col>
            </Row>
          </Container>
        </StyledSection>
        <StyledSection className='fx-noise-light'>
          <Container>
            <h1 className='tp-h3 mb-lg'>Resources</h1>
            <Row count={12}>
              <Col span={8}>
                <h2 className='tp-h6 mb-sm'>Documentation</h2>
                <StyledTag>VMs</StyledTag>
                <StyledTag>Functions</StyledTag>
                <StyledTag>Native storage</StyledTag>
                <StyledTag>IPFS</StyledTag>
                <StyledTag>Databases</StyledTag>
                <StyledTag>Persistent VMs</StyledTag>
                <StyledTag>Persistent storage</StyledTag>
                <StyledTag>Use cases</StyledTag>
              </Col>
              <Col span={4}>
                <h2 className='tp-h6 mb-sm'>Indexing Framework</h2>
                <StyledTag>Ethereum</StyledTag>
                <StyledTag>Solana</StyledTag>
                <StyledTag>Tezos</StyledTag>
                <StyledTag>Binance Smart Chain</StyledTag>
              </Col>
            </Row>
          </Container>
        </StyledSection>
      </main>
    </>
  )
}
