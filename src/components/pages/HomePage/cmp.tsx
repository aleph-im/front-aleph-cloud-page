import Head from 'next/head'
import Image from 'next/image'
import { Button, Col, Row, TextGradient, Icon } from '@aleph-front/aleph-core'
import Container from '@/components/common/Container'
import FeatureCard from '@/components/common/FeatureCard'
import H1 from '@/components/common/H1'
import H2 from '@/components/common/H2'
import Strong from '@/components/common/Strong'
import { useHomePage } from '@/hooks/pages/useHomePage'
import { useBasePath } from '@/hooks/common/useBasePath'
import { StyledH1Button, StyledLink, StyledLinkItem } from './styles'

export default function HomePage() {
  const { featureSectionBg, navigate, scroll } = useHomePage()

  const basePath = useBasePath()
  const imgPrefix = basePath?.charAt(0) === '/' ? basePath : ''

  return (
    <>
      <Head>
        <title>Aleph.im | Cloud Solutions</title>
        <meta name="description" content="Aleph.im Cloud Solution" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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
                  <StyledH1Button onClick={scroll.volume.handle}>
                    Storage solutions
                    <Icon name="arrow-right-long" tw="ml-4" />
                  </StyledH1Button>
                  <StyledH1Button onClick={scroll.function.handle}>
                    Computing solutions
                    <Icon name="arrow-right-long" tw="ml-4" />
                  </StyledH1Button>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <section tw="px-0 py-6 md:pb-0 md:pt-20" ref={scroll.function.ref}>
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
      <section className={featureSectionBg} tw="px-0 py-12 md:py-20">
        <Container>
          <Row xs={1} md={4} gap="1.5rem">
            <Col>
              <FeatureCard
                title="Function"
                text="An isolated environment  created for a  function to execute in response to an event and can run in two modes: on-demand or persistent."
                buttonLabel="Create function"
                headerImg="Object10"
                buttonOnClick={navigate.function}
              />
            </Col>
            <Col>
              <FeatureCard
                title="Instance"
                text="A virtual machine that runs on a Aleph.im's infrastructure and can be configured with CPUs, memory, storage, and networking."
                buttonLabel="Create instance"
                headerImg="Object11"
                buttonOnClick={navigate.instance}
                beta
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
      <section className="fx-noise-light" tw="px-0 pt-20 pb-10 md:pb-20">
        <Container>
          <Row xs={1} md={2} gap="1.5rem">
            <Col>
              <Image
                src={`${imgPrefix}/img/indexing.svg`}
                alt="Indexing illustration"
                fill={true}
                tw="relative!"
              />
            </Col>
            <Col>
              <span className="tp-info" tw="mb-0">
                SOLANA - ETHEREUM - BINANCE SMART CHAIN
              </span>
              <H2 className="tp-h4 md:tp-h3">Indexing framework</H2>
              <p className="fs-md" tw="mt-0 mb-16">
                Consider using the Aleph Indexer Framework for indexing
                blockchain data. It&apos;s <strong>open-source</strong>,{' '}
                <strong>multi-chain</strong>, and provides an easy-to-use
                solution for building <strong>high-performance</strong>,{' '}
                <strong>decentralized indexers</strong> on{' '}
                <strong>Aleph.im&apos;s infrastructure</strong>.
              </p>
              <Button
                forwardedAs="a"
                href="https://bit.ly/3GAAjii"
                target="_blank"
                kind="neon"
                variant="primary"
                size="big"
                color="main0"
                tw="!my-0"
              >
                Get in touch with us
              </Button>
            </Col>
          </Row>
        </Container>
      </section>
      <section tw="px-0 pt-12 pb-6 md:pt-20 md:pb-0" ref={scroll.volume.ref}>
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
      <section className={featureSectionBg} tw="px-0 py-12 md:py-20">
        <Container>
          <Row xs={1} md={4} gap="1.5rem">
            <Col>
              <FeatureCard
                title="Immutable volume"
                text="Immutable volumes store unchangeable data on IPFS, pinned to multiple nodes for reliable access and reproducible execution."
                buttonLabel="Create volume"
                headerImg="Object15"
                buttonOnClick={navigate.volume}
              />
            </Col>
            <Col>
              <FeatureCard
                title="Dependencies volume"
                text="Package your dependencies to an immutable volume upfront to reference it easily and speed up creation time of an instance or function."
                buttonLabel="Create volume"
                headerImg="Object13"
                buttonOnClick={navigate.volume}
              />
            </Col>
            <Col>
              <FeatureCard
                title="IPFS pinning"
                text="Avoid data being removed or garbage collected using the decentralized pinning solution, and ensure your data stay persistent."
                buttonLabel="Start IPFS pinning"
                headerImg="Object8"
                disabled
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
              <TextGradient forwardedAs="h2" type="h7" color="main0" tw="mb-6">
                How-to’s
              </TextGradient>
              <ul>
                <StyledLinkItem>
                  <StyledLink
                    href="https://docs.aleph.im/guides/update_a_program"
                    target="_blank"
                  >
                    Update a program
                  </StyledLink>
                </StyledLinkItem>
                <StyledLinkItem>
                  <StyledLink
                    href="https://docs.aleph.im/guides/python/dependency_volume"
                    target="_blank"
                  >
                    Add dependencies to a program
                  </StyledLink>
                </StyledLinkItem>
                <StyledLinkItem>
                  <StyledLink
                    href="https://docs.aleph.im/guides/testing_microvms"
                    target="_blank"
                  >
                    Local VM&apos;s for testing
                  </StyledLink>
                </StyledLinkItem>
                <StyledLinkItem last>
                  <StyledLink
                    href="https://github.com/aleph-im/aleph-indexer-library#aleph-indexer-library"
                    target="_blank"
                  >
                    Start indexing
                  </StyledLink>
                </StyledLinkItem>
              </ul>
            </Col>
            <Col>
              <TextGradient forwardedAs="h2" type="h7" color="main0" tw="mb-6">
                Learn best practice
              </TextGradient>
              <ul>
                <StyledLinkItem>
                  <StyledLink
                    href="https://docs.aleph.im/guides/python/getting_started"
                    target="_blank"
                  >
                    Build a Python VM
                  </StyledLink>
                </StyledLinkItem>
                <StyledLinkItem>
                  <StyledLink
                    href="https://aleph-im.gitbook.io/aleph-docs/virtual-machines-vm/help-articles/how-to-create-a-vm-with-nodejs-and-node_modules"
                    target="_blank"
                  >
                    Build a NodeJS VM
                  </StyledLink>
                </StyledLinkItem>
                <StyledLinkItem>
                  <StyledLink
                    href="https://docs.aleph.im/guides/rust/rust_microvm"
                    target="_blank"
                  >
                    Build a Rust VM
                  </StyledLink>
                </StyledLinkItem>
                <StyledLinkItem>
                  <StyledLink
                    href="https://docs.aleph.im/computing/runtimes/custom"
                    target="_blank"
                  >
                    Build a custom runtime
                  </StyledLink>
                </StyledLinkItem>
                <StyledLinkItem last>
                  <StyledLink
                    href="https://docs.aleph.im/guides/python/advanced"
                    target="_blank"
                  >
                    Advanced Python program features
                  </StyledLink>
                </StyledLinkItem>
              </ul>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  )
}
