import Head from 'next/head'
import { Card, Col, Row, TextGradient } from '@aleph-front/aleph-core'
import Container from '@/components/Container'
import styled from 'styled-components'

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
            <p>With Aleph.im&apos;s computing services, you can process data quickly and securely using on-demand and persistent functions, virtual machine instances, and confidential VMs.</p>
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
        <StyledSection className='pb-0'>
          <Container>
            <TextGradient type='h1' color='main1'>Storage</TextGradient>
            <p>With support for immutable, temporary, and persistent volumes, as well as databases using key-value pairs, Aleph.im provides a flexible and powerful storage solution for a wide range of use cases.</p>
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
      </main>
    </>
  )
}
