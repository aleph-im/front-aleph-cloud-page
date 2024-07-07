import { useCallback, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import {
  Button,
  TextGradient,
  NodeVersion,
  NodeName,
  NodeScore,
  TableColumn,
  NoisyContainer,
  useModal,
} from '@aleph-front/core'
import { CRN } from '@/domain/node'
import { BlockchainId, blockchains } from '@/domain/connect/base'
import SelectInstanceImage from '@/components/form/SelectInstanceImage'
import SelectInstanceSpecs from '@/components/form/SelectInstanceSpecs'
import AddVolumes from '@/components/form/AddVolumes'
import AddEnvVars from '@/components/form/AddEnvVars'
import AddSSHKeys from '@/components/form/AddSSHKeys'
import AddDomains from '@/components/form/AddDomains'
import AddNameAndTags from '@/components/form/AddNameAndTags'
import CheckoutSummary from '@/components/form/CheckoutSummary'
import {
  EntityDomainType,
  EntityType,
  PaymentMethod,
  apiServer,
} from '@/helpers/constants'
import Container from '@/components/common/CenteredContainer'
import { useNewInstancePage } from '@/hooks/pages/computing/useNewInstancePage'
import Form from '@/components/form/Form'
import ToggleContainer from '@/components/common/ToggleContainer'
import NewEntityTab from '../NewEntityTab'
import NodesTable from '@/components/common/NodesTable'
import SpinnerOverlay from '@/components/common/SpinnerOverlay'
import { SectionTitle } from '@/components/common/CompositeTitle'
import { PageProps } from '@/types/types'
import Strong from '@/components/common/Strong'
import { useConnection } from '@/hooks/common/useConnection'
import CRNList from '../../../common/CRNList'
import BackButtonSection from '@/components/common/BackButtonSection'

export default function NewInstancePage({ mainRef }: PageProps) {
  const {
    address,
    accountBalance,
    isCreateButtonDisabled,
    values,
    control,
    errors,
    node,
    nodeSpecs,
    lastVersion,
    handleSubmit,
    handleSelectNode,
    handleBack,
  } = useNewInstancePage()

  const sectionNumber = useCallback((n: number) => (node ? 1 : 0) + n, [node])
  const { account, blockchain, handleConnect } = useConnection({
    triggerOnMount: false,
  })

  // ------------------

  const modal = useModal()
  const modalOpen = modal?.open
  const modalClose = modal?.close

  const [selectedNode, setSelectedNode] = useState<string>()
  const [selectedModal, setSelectedModal] = useState<
    | 'node-list'
    | 'switch-to-hold'
    | 'switch-to-stream'
    | 'switch-to-auto-hold'
    | 'switch-to-node-stream'
  >()

  const handleCloseModal = useCallback(() => setSelectedModal(undefined), [])

  const handleSwitchToNodeStream = useCallback(() => {
    if (selectedNode !== node?.hash) {
      handleConnect({ blockchain: BlockchainId.AVAX })
      handleSelectNode(selectedNode)
    }

    setSelectedModal(undefined)
  }, [handleConnect, handleSelectNode, node, selectedNode])

  const handleSwitchToAutoHold = useCallback(() => {
    if (node?.hash) {
      handleConnect({ blockchain: BlockchainId.ETH })
      setSelectedNode(undefined)
      handleSelectNode(undefined)
    }

    setSelectedModal(undefined)
  }, [handleConnect, handleSelectNode, node])

  useEffect(() => {
    if (!modalOpen) return
    if (!modalClose) return

    if (!selectedModal) {
      return modalClose()
    }

    if (selectedModal === 'node-list') {
      return modalOpen({
        header: '',
        width: '80rem',
        onClose: handleCloseModal,
        content: (
          <CRNList selected={selectedNode} onSelectedChange={setSelectedNode} />
        ),
        footer: (
          <>
            <div tw="w-full flex justify-between">
              {node && (
                <Button
                  type="button"
                  kind="functional"
                  variant="warning"
                  size="md"
                  onClick={() => setSelectedModal('switch-to-auto-hold')}
                >
                  Auto-select CRN
                </Button>
              )}
              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={handleSwitchToNodeStream}
                disabled={!selectedNode}
                tw="ml-auto!"
              >
                Continue
              </Button>
            </div>
          </>
        ),
      })
    }

    if (selectedModal === 'switch-to-hold') {
      return modalOpen({
        width: '40rem',
        title: 'Confirm Payment Method Change',
        onClose: handleCloseModal,
        content: (
          <div tw="flex flex-col gap-8" className="tp-body">
            <div>
              Switching to the <Strong>Holder tier</Strong> will set your
              payment method to holding $ALEPH tokens on{' '}
              <Strong>Ethereum</Strong> and{' '}
              <Strong>automatically select</Strong> the most suitable CRN.
            </div>
            <div>
              Switching modes will prompt your wallet to automatically adjust to
              the Ethereum network if needed, and the system will reset to align
              with your new selection preferences. Ensure your wallet is ready
              for the Ethereum network.
            </div>
            <div>
              <strong className="tp-body3 fs-12">Token Requirements</strong>
              <div className="tp-body1 fs-12">
                You will need to hold sufficient $ALEPH tokens in your wallet to
                continue using the instance. $ALEPH can be acquired from Uniswap
                or Coinbase.
              </div>
            </div>
          </div>
        ),
        footer: (
          <div tw="w-full flex justify-between">
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={handleCloseModal}
            >
              Stay on Tier
            </Button>
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={handleSwitchToAutoHold}
            >
              Switch Tier
            </Button>
          </div>
        ),
      })
    }

    if (selectedModal === 'switch-to-stream') {
      return modalOpen({
        width: '40rem',
        title: 'Confirm Payment Method Change',
        onClose: handleCloseModal,
        content: (
          <div tw="flex flex-col gap-8" className="tp-body">
            <div>
              You are about to switch your payment method to{' '}
              <Strong>Pay-as-you-go</Strong>, which will also allow you to{' '}
              <Strong>manually select</Strong> your preferred CRN on{' '}
              <Strong>Avalanche</Strong>.
            </div>
            <div>
              Making this change will prompt your wallet to automatically switch
              networks. This will reset your current configuration to
              accommodate your new selection. Please ensure your wallet is
              compatible and ready for this transition.
            </div>
            <div>
              <strong className="tp-body3 fs-12">Token Requirements</strong>
              <div className="tp-body1 fs-12">
                To maintain your service in the Holder Tier, you must hold
                sufficient $ALEPH tokens in your wallet for the duration of your
                instance usage. You can acquire $ALEPH tokens at Uniswap or
                Coinbase.
              </div>
            </div>
          </div>
        ),
        footer: (
          <div tw="w-full flex justify-between">
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={handleCloseModal}
            >
              Stay on Tier
            </Button>
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={() => setSelectedModal('node-list')}
            >
              Switch Tier
            </Button>
          </div>
        ),
      })
    }

    if (selectedModal === 'switch-to-auto-hold') {
      return modalOpen({
        width: '40rem',
        title: 'Confirm CRN selection and Payment Method Change',
        onClose: handleCloseModal,
        content: (
          <div tw="flex flex-col gap-8" className="tp-body">
            <div>
              You are about to enable <Strong>automatic CRN selection</Strong>,
              which will utilize the <Strong>Holder-tier</Strong> on{' '}
              <Strong>Ethereum</Strong>. This simplifies your setup by
              automatically assigning a CRN node.
            </div>
            <div>
              Switching modes will prompt your wallet to automatically adjust to
              the Ethereum network if needed, and the system will reset to align
              with your new selection preferences. Ensure your wallet is ready
              for the Ethereum network.
            </div>
            <div>
              <strong className="tp-body3 fs-12">Token Requirements</strong>
              <div className="tp-body1 fs-12">
                You will need to hold sufficient $ALEPH tokens in your wallet to
                continue using the instance. $ALEPH can be acquired from Uniswap
                or Coinbase.
              </div>
            </div>
          </div>
        ),
        footer: (
          <div tw="w-full flex justify-between">
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={handleCloseModal}
            >
              Keep Current Settings
            </Button>
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={handleSwitchToAutoHold}
            >
              Proceed with Changes
            </Button>
          </div>
        ),
      })
    }

    if (selectedModal === 'switch-to-node-stream') {
      return modalOpen({
        width: '40rem',
        title: 'Confirm CRN selection and Payment Method Change',
        onClose: handleCloseModal,
        content: (
          <div tw="flex flex-col gap-8" className="tp-body">
            <div>
              You are about to switch from the automated Holder-tier setup on
              Ethereum to <Strong>manually selecting</Strong> a CRN with the{' '}
              <Strong>Pay-as-you-go</Strong> method on{' '}
              <Strong>Avalanche</Strong>.
            </div>
            <div>
              Making this change will prompt your wallet to automatically switch
              networks. This will reset your current configuration to
              accommodate your new selection. Please ensure your wallet is
              compatible and ready for this transition.
            </div>
            <div>
              <strong className="tp-body3 fs-12">Token Requirements</strong>
              <div className="tp-body1 fs-12">
                You will need $AVAX to start the PAYG stream and $ALEPH funds on
                the Avalanche chain to stream. Purchase $AVAX at Trader Joe XYZ
                and get $ALEPH at Swap Aleph or Trader Joe XYZ.
              </div>
            </div>
          </div>
        ),
        footer: (
          <div tw="w-full flex justify-between">
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={handleCloseModal}
            >
              Keep Current Settings
            </Button>
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={() => setSelectedModal('node-list')}
            >
              Proceed with Changes
            </Button>
          </div>
        ),
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    handleCloseModal,
    handleConnect,
    handleSelectNode,
    handleSwitchToAutoHold,
    handleSwitchToNodeStream,
    // modalClose,
    // modalOpen,
    node,
    selectedModal,
    selectedNode,
  ])
  // ------------------------

  const handleSwitchPaymentMethod = useCallback((method: PaymentMethod) => {
    if (method === PaymentMethod.Stream) {
      setSelectedModal('switch-to-stream')
    } else {
      setSelectedModal('switch-to-hold')
    }
  }, [])

  // @note: warn the user when the wrong network configuration has been detected
  useEffect(() => {
    if (!modalOpen) return
    if (!modalClose) return

    if (!account) return
    if (!blockchain) return
    if (selectedModal) return

    if (
      (node && blockchain === BlockchainId.AVAX) ||
      (!node && blockchain === BlockchainId.ETH)
    ) {
      return modalClose()
    }

    const switchTo = node ? BlockchainId.AVAX : BlockchainId.ETH
    const name = blockchains[switchTo].name

    return modalOpen({
      width: '40rem',
      title: 'Network Switch Required',
      onClose: modalClose,
      content: (
        <div tw="flex flex-col gap-8" className="tp-body">
          <div>
            It looks like your wallet is currently connected to the wrong
            network. To proceed with setting up your instance on
            Twentysix.cloud, you&apos;ll need to switch to the{' '}
            <Strong>{name}</Strong> network.
          </div>
        </div>
      ),
      footer: (
        <div tw="w-full flex justify-between">
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={modalClose}
          >
            Stay on Current Network
          </Button>
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={() => {
              handleConnect({ blockchain: switchTo })
            }}
          >
            Proceed
          </Button>
        </div>
      ),
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    // modalClose,
    // modalOpen,
    handleConnect,
    account,
    blockchain,
    node,
    selectedModal,
  ])
  // ------------------------

  const columns = useMemo(() => {
    return [
      {
        label: 'NAME',
        render: (node) => (
          <NodeName
            hash={node.hash}
            name={node.name}
            picture={node.picture}
            ImageCmp={Image}
            apiServer={apiServer}
          />
        ),
      },
      {
        label: 'SCORE',
        render: (node) => <NodeScore score={node.score} />,
      },
      {
        label: 'VERSION',
        render: (node) => (
          <NodeVersion
            version={node.metricsData?.version || ''}
            lastVersion={lastVersion}
          />
        ),
      },
      {
        label: '',
        align: 'right',
        render: () => (
          <div tw="flex gap-3 justify-end">
            <Button
              type="button"
              kind="functional"
              size="md"
              variant="warning"
              onClick={() => setSelectedModal('node-list')}
            >
              Change CRN
            </Button>
          </div>
        ),
      },
    ] as TableColumn<CRN>[]
  }, [lastVersion])

  const data = useMemo(() => (node ? [node] : []), [node])

  return (
    <>
      <BackButtonSection handleBack={handleBack} />
      <Form onSubmit={handleSubmit} errors={errors}>
        <section tw="px-0 py-0 md:py-8">
          <Container>
            <NewEntityTab selected="instance" />
          </Container>
        </section>
        {node && (
          <section tw="px-0 pt-20 pb-6 md:py-10">
            <Container>
              <SectionTitle number={sectionNumber(0)}>
                Selected instance
              </SectionTitle>
              <div tw="px-0 mt-12 mb-6 min-h-[6rem] relative">
                <NoisyContainer>
                  <SpinnerOverlay show={!node} />
                  <NodesTable
                    columns={columns}
                    data={data}
                    rowProps={() => ({ className: '_active' })}
                  />
                  <div tw="mt-6">
                    <Button
                      type="button"
                      kind="functional"
                      variant="warning"
                      size="md"
                      onClick={() => {
                        setSelectedModal('switch-to-auto-hold')
                      }}
                    >
                      Auto-select CRN
                    </Button>
                  </div>
                </NoisyContainer>
              </div>
            </Container>
          </section>
        )}
        <section tw="px-0 pt-20 pb-6 md:py-10">
          <Container>
            <SectionTitle number={sectionNumber(1)}>
              Select your tier
            </SectionTitle>
            <p>
              Your instance is ready to be configured using our{' '}
              <Strong>automated CRN selection</Strong>, set to run on{' '}
              <Strong>Ethereum</Strong> with the{' '}
              <Strong>Holder-tier payment</Strong> method, allowing you seamless
              access while you hold ALEPH tokens. If you wish to customize your
              Compute Resource Node (CRN) or use a different payment approach,
              you can change your selection below.
            </p>
            <div tw="px-0 my-6 relative">
              <SpinnerOverlay show={!!node && !nodeSpecs} />
              <SelectInstanceSpecs
                name="specs"
                control={control}
                type={EntityType.Instance}
                isPersistent
                paymentMethod={values.paymentMethod}
                nodeSpecs={nodeSpecs}
              >
                {!node && (
                  <div tw="mt-6">
                    <Button
                      type="button"
                      kind="functional"
                      variant="warning"
                      size="md"
                      onClick={() => setSelectedModal('switch-to-node-stream')}
                    >
                      Manually select CRN
                    </Button>
                  </div>
                )}
              </SelectInstanceSpecs>
            </div>
          </Container>
        </section>
        <section tw="px-0 pt-20 pb-6 md:py-10">
          <Container>
            <SectionTitle number={sectionNumber(2)}>
              Choose an image
            </SectionTitle>
            <p>
              Chose a base image for your VM. It’s the base system that you will
              be able to customize.
            </p>
            <div tw="px-0 mt-12 mb-6">
              <SelectInstanceImage name="image" control={control} />
            </div>
          </Container>
        </section>
        <section tw="px-0 pt-20 pb-6 md:py-10">
          <Container>
            <SectionTitle number={sectionNumber(3)}>
              Configure SSH Key
            </SectionTitle>
            <p>
              Access your cloud instances securely. Give existing key’s below
              access to this instance or add new keys. Remember, storing private
              keys safely is crucial for security. If you need help, our support
              team is always ready to assist.
            </p>
            <div tw="px-0 my-6">
              <AddSSHKeys name="sshKeys" control={control} />
            </div>
          </Container>
        </section>
        <section tw="px-0 pt-20 pb-6 md:py-10">
          <Container>
            <SectionTitle number={sectionNumber(4)}>Name and tags</SectionTitle>
            <p tw="mb-6">
              Organize and identify your instances more effectively by assigning
              a unique name, obtaining a hash reference, and defining multiple
              tags. This helps streamline your development process and makes it
              easier to manage your web3 instances.
            </p>
            <AddNameAndTags
              control={control}
              entityType={EntityType.Instance}
            />
          </Container>
        </section>
        <section tw="px-0 pt-20 pb-6 md:py-10">
          <Container>
            <SectionTitle number={sectionNumber(5)}>
              Advanced Configuration Options
            </SectionTitle>
            <p tw="mb-6">
              Customize your instance with our Advanced Configuration Options.
              Add volumes, SSH keys, environment variables, and custom domains
              to meet your specific needs.
            </p>
            <div tw="px-0 my-6">
              <div tw="mb-4">
                <ToggleContainer label="Add Volume">
                  <TextGradient forwardedAs="h2" type="h6" color="main0">
                    Add volumes
                  </TextGradient>
                  <AddVolumes
                    name="volumes"
                    control={control}
                    systemVolumeSize={values.systemVolumeSize}
                  />
                </ToggleContainer>
              </div>
              <div tw="mb-4">
                <ToggleContainer label="Add Environmental Variables">
                  <TextGradient forwardedAs="h2" type="h6" color="main0">
                    Add environment variables
                  </TextGradient>
                  <p tw="mb-6">
                    Define key-value pairs that act as configuration settings
                    for your web3 instance. Environment variables offer a
                    convenient way to store information, manage configurations,
                    and modify your application&apos;s behaviour without
                    altering the source code.
                  </p>
                  <AddEnvVars name="envVars" control={control} />
                </ToggleContainer>
              </div>
              <div tw="mb-4">
                <ToggleContainer label="Add Custom Domain">
                  <TextGradient forwardedAs="h2" type="h6" color="main0">
                    Custom domain
                  </TextGradient>
                  <p tw="mb-6">
                    You have the ability to configure a domain name to access
                    your cloud instances. By setting up a user-friendly custom
                    domain, accessing your instances becomes easier and more
                    intuitive. It&amp;s another way we&amp;re making web3 cloud
                    management as straightforward as possible.
                  </p>
                  <AddDomains
                    name="domains"
                    control={control}
                    entityType={EntityDomainType.Instance}
                  />
                </ToggleContainer>
              </div>
            </div>
          </Container>
        </section>

        <CheckoutSummary
          control={control}
          address={address}
          type={EntityType.Instance}
          isPersistent={true}
          specs={values.specs}
          volumes={values.volumes}
          domains={values.domains}
          receiverAddress={node?.reward}
          unlockedAmount={accountBalance}
          paymentMethod={values.paymentMethod}
          streamDuration={values.streamDuration}
          disablePaymentMethod={false}
          mainRef={mainRef}
          onSwitchPaymentMethod={handleSwitchPaymentMethod}
          description={
            <>
              You can either leverage the traditional method of holding tokens
              in your wallet for resource access, or opt for the Pay-As-You-Go
              (PAYG) system, which allows you to pay precisely for what you use,
              for the duration you need. The PAYG option includes a token stream
              feature, enabling real-time payment for resources as you use them.
            </>
          }
          button={
            <Button
              type="submit"
              color="main0"
              kind="default"
              size="lg"
              variant="primary"
              disabled={isCreateButtonDisabled}
              // @note: handleSubmit is needed on the floating footer to trigger form submit (transcluded to body)
              onClick={handleSubmit}
            >
              Create instance
            </Button>
          }
        />
      </Form>
    </>
  )
}
