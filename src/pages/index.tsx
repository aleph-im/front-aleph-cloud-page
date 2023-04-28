import Head from 'next/head'
import styled from 'styled-components'
import {
  Button,
  Col,
  Row,
  TextGradient,
  Tag,
  Icon,
  addClasses,
} from '@aleph-front/aleph-core'
import Container from '@/components/Container'
import { IndexingImg } from '@/components/Imgs/IndexingImg'
import FeatureCard from '@/components/FeatureCard'
import H1 from '@/components/H1'
import H2 from '@/components/H2'
import Strong from '@/components/Strong'
import { useScrollTo } from '@/hooks/useScrollTo'
import tw from 'twin.macro'

const StyledH1Button = styled(Button).attrs((props) => {
  return {
    ...props,
    variant: 'secondary',
    size: 'big',
    kind: 'neon',
    color: 'main0',
  }
})``

const StyledLinkItem = styled.li<{ last?: boolean }>`
  ${({ last }) => (last ? tw`mt-6` : tw`my-6`)}
  ${tw`p-0`}
  line-height: 0;
`

const StyledLink = styled(Button).attrs((props) => {
  return {
    ...props,
    forwardedAs: 'a',
    kind: 'neon',
    variant: 'text-only',
    size: 'regular',
    color: 'main0',
    onClick: (e: MouseEvent) => {
      if (!(e.currentTarget as HTMLAnchorElement).href) {
        alert('href not implemented')
        e.preventDefault()
      }
    },
  }
})``

const StyledTagContainer = styled.div(() => [
  tw`flex flex-wrap gap-y-4 gap-x-2.5`,
])

const StyledTag = styled(Tag).attrs(addClasses('tp-body1 fs-lg'))(() => [
  tw`m-0`,
])

export default function Home() {
  const [ref1, handleScroll1] = useScrollTo()
  const [ref2, handleScroll2] = useScrollTo()

  return (
    <>
      <Head>
        <title>Aleph.im Cloud Solutions</title>
        <meta name="description" content="Aleph.im Cloud Solution" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon-32x32.png" />
      </Head>
      <section tw="p-0">
        <Container>
          <Row xs={1} md={4} gap="1.5rem">
            <Col xs={1} md={3}>
              <div tw="flex flex-col md:block">
                <div tw="py-12">
                  <H1 tw="mb-12 md:mb-6">Infrastructure solutions</H1>
                  <p className="tp-body fs-lg" tw="my-0">
                    Aleph.im offers cutting-edge <Strong>computing</Strong> and{' '}
                    <Strong>storage</Strong> solutions for your web3 needs. Our
                    unique payment model supports the holder tier, allowing you
                    to use our services simply by holding ALEPH tokens in your
                    wallet.{' '}
                    <Strong>
                      The longer you hold the tokens, the longer you can enjoy
                      our services without any additional payment.
                    </Strong>{' '}
                    Discover the power of Aleph.im’s solutions today and
                    experience cost-effective and reliable web3 cloud services
                    like never before.
                  </p>
                </div>
                <div tw="flex flex-col md:flex-row gap-6 py-6 order-first items-start">
                  <StyledH1Button onClick={handleScroll1}>
                    Storage solutions
                    <Icon name="arrow-right-long" tw="ml-4" />
                  </StyledH1Button>
                  <StyledH1Button onClick={handleScroll2}>
                    Computing solutions
                    <Icon name="arrow-right-long" tw="ml-4" />
                  </StyledH1Button>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <section tw="px-0 py-6 md:pb-0 md:pt-20" ref={ref2}>
        <Container>
          <Row xs={1} md={4} gap="1.5rem">
            <Col xs={1} md={3}>
              <H2 label="Solutions">Computing</H2>
              <p className="fs-md" tw="mt-0">
                With Aleph.im&apos;s computing services, you can process data
                quickly and securely using on-demand and persistent functions,
                virtual machine instances, and confidential VMs.
              </p>
            </Col>
          </Row>
        </Container>
      </section>
      <section tw="px-0 py-12 md:py-20">
        <Container>
          <Row xs={1} md={4} gap="1.5rem">
            <Col>
              <FeatureCard
                title="Function"
                text="An isolated environment  created for a  function to execute in response to an event and can run in two modes: on-demand or persistent."
                buttonLabel="Create function"
                headerImg="Object10"
              />
            </Col>
            <Col>
              <FeatureCard
                title="Instance"
                text="A virtual machine that runs on a Aleph.im's infrastructure and can be configured with CPUs, memory, storage, and networking."
                buttonLabel="Create instance"
                headerImg="Object11"
                disabled
              />
            </Col>
            <Col>
              <FeatureCard
                title="Confidential VM"
                text="A virtual machine running for an extended period with their memory, storage, and execution fully encrypted and isolated from the host."
                buttonLabel="Create confidential VM"
                headerImg="Object9"
                disabled
              />
            </Col>
          </Row>
        </Container>
      </section>
      <section className="fx-noise-light" tw="px-0 pt-20 pb-12 md:py-20">
        <Container>
          <Row xs={1} md={2} gap="1.5rem">
            <Col>
              <IndexingImg />
            </Col>
            <Col>
              <span className="tp-info" tw="mb-0">
                SOLANA - ETHEREUM - BINANCE SMART CHAIN
              </span>
              <TextGradient type="h3" as="h2" color="main0">
                Indexing framework
              </TextGradient>
              <p className="fs-md" tw="mb-12">
                Consider using the Aleph Indexer Framework for indexing
                blockchain data. It&apos;s open-source, multi-chain, and
                provides an easy-to-use solution for building high-performance,
                decentralized indexers on Aleph.im&apos;s infrastructure.
              </p>
              <Button
                forwardedAs="a"
                href="https://forms.clickup.com/f/q8g62-81/GW7WSGW5BUC0P2HRBE"
                target="_blank"
                kind="neon"
                variant="primary"
                size="big"
                color="main0"
                tw="my-6"
              >
                Get in touch with us
              </Button>
            </Col>
          </Row>
        </Container>
      </section>
      <section tw="px-0 pt-12 pb-6 md:pt-20 md:pb-0" ref={ref1}>
        <Container>
          <Row xs={1} md={4} gap="1.5rem">
            <Col xs={1} md={3}>
              <H2 label="Solutions">Storage</H2>
              <p className="fs-md">
                With support for immutable, temporary, and persistent volumes,
                as well as databases using key-value pairs, Aleph.im provides a
                flexible and powerful storage solution for a wide range of use
                cases.
              </p>
            </Col>
          </Row>
        </Container>
      </section>
      <section tw="px-0 py-12 md:py-20">
        <Container>
          <Row xs={1} md={4} gap="1.5rem">
            <Col>
              <FeatureCard
                title="Immutable volume"
                text="Immutable volumes store unchangeable data on IPFS, pinned to multiple nodes for reliable access and reproducible execution."
                buttonLabel="Create volume"
                headerImg="Object15"
              />
            </Col>
            <Col>
              <FeatureCard
                title="Dependencies volume"
                text="Package your dependencies to an immutable volume upfront to reference it easily and speed up creation time of an instance or function."
                buttonLabel="Create volume"
                headerImg="Object13"
              />
            </Col>
            <Col>
              <FeatureCard
                title="Temporarily volume"
                text="A volume that is created temporarily to hold data or files for a short period of time. After this time the volume is deleted."
                buttonLabel="Create volume"
                headerImg="Object12"
                disabled
              />
            </Col>
          </Row>
        </Container>
      </section>
      <section tw="px-0 py-20">
        <Container>
          <h1 className="tp-h3" tw="mb-6 md:mb-16">
            Put your code to work
          </h1>
          <Row xs={1} md={2} xsGap="2.625rem" mdGap="1.5rem">
            <Col>
              <TextGradient as="h2" type="h7" color="main0" tw="mb-6">
                How-to’s
              </TextGradient>
              <ul>
                <StyledLinkItem>
                  <StyledLink>Host a website</StyledLink>
                </StyledLinkItem>
                <StyledLinkItem>
                  <StyledLink>Store files now</StyledLink>
                </StyledLinkItem>
                <StyledLinkItem>
                  <StyledLink>Pin a file</StyledLink>
                </StyledLinkItem>
                <StyledLinkItem>
                  <StyledLink>Local VM&apos;s for testing</StyledLink>
                </StyledLinkItem>
                <StyledLinkItem last>
                  <StyledLink>Start indexing</StyledLink>
                </StyledLinkItem>
              </ul>
            </Col>
            <Col>
              <TextGradient as="h2" type="h7" color="main0" tw="mb-6">
                Learn best practice
              </TextGradient>
              <ul>
                <StyledLinkItem>
                  <StyledLink>Trigger your VM</StyledLink>
                </StyledLinkItem>
                <StyledLinkItem>
                  <StyledLink>Aggregates vs posts</StyledLink>
                </StyledLinkItem>
                <StyledLinkItem last>
                  <StyledLink>Encrypt your data</StyledLink>
                </StyledLinkItem>
              </ul>
            </Col>
          </Row>
        </Container>
      </section>
      <section className="fx-noise-light" tw="px-0 py-20">
        <Container>
          <h1 className="tp-h4" tw="mb-12 md:mb-6">
            More resources
          </h1>
          <Row xs={1} md={6} xsGap="2.625rem" mdGap="1.5rem">
            <Col xs={1} md={3}>
              <h2 className="tp-h7" tw="mb-4">
                Documentation
              </h2>
              <StyledTagContainer>
                <StyledTag>VMs</StyledTag>
                <StyledTag>Functions</StyledTag>
                <StyledTag>Native storage</StyledTag>
                <StyledTag>IPFS</StyledTag>
                <StyledTag>Databases</StyledTag>
                <StyledTag>Persistent VMs</StyledTag>
                <StyledTag>Persistent storage</StyledTag>
                <StyledTag>Use cases</StyledTag>
              </StyledTagContainer>
            </Col>
            <Col xs={1} md={2} mdOffset={5}>
              <h2 className="tp-h7" tw="mb-4">
                Indexing Framework
              </h2>
              <StyledTagContainer>
                <StyledTag>Ethereum</StyledTag>
                <StyledTag>Solana</StyledTag>
                <StyledTag>Tezos</StyledTag>
                <StyledTag>Binance Smart Chain</StyledTag>
              </StyledTagContainer>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  )
}
