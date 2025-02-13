import React from 'react'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import Image from 'next/image'
import {
  Button,
  TextGradient,
  NodeVersion,
  NodeName,
  NodeScore,
  TableColumn,
  NoisyContainer,
  TooltipProps,
  Checkbox,
} from '@aleph-front/core'
import { CRNSpecs } from '@/domain/node'
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
import {
  useNewInstancePage,
  UseNewInstancePageReturn,
} from '@/hooks/pages/computing/useNewInstancePage'
import Form from '@/components/form/Form'
import SwitchToggleContainer from '@/components/common/SwitchToggleContainer'
import NewEntityTab from '../NewEntityTab'
import NodesTable from '@/components/common/NodesTable'
import SpinnerOverlay from '@/components/common/SpinnerOverlay'
import { SectionTitle } from '@/components/common/CompositeTitle'
import { PageProps } from '@/types/types'
import Strong from '@/components/common/Strong'
import CRNList from '../../../common/CRNList'
import BackButtonSection from '@/components/common/BackButtonSection'
import ResponsiveTooltip from '@/components/common/ResponsiveTooltip'
import BorderBox from '@/components/common/BorderBox'
import ExternalLink from '@/components/common/ExternalLink'

const CheckoutButton = React.memo(
  ({
    disabled,
    title = 'Create instance',
    tooltipContent,
    isFooter,
    shouldRequestTermsAndConditions,
    handleRequestTermsAndConditionsAgreement,
    handleSubmit,
  }: {
    disabled: boolean
    title?: string
    tooltipContent?: TooltipProps['content']
    isFooter: boolean
    shouldRequestTermsAndConditions?: boolean
    handleRequestTermsAndConditionsAgreement: UseNewInstancePageReturn['handleRequestTermsAndConditionsAgreement']
    handleSubmit: UseNewInstancePageReturn['handleSubmit']
  }) => {
    const checkoutButtonRef = useRef<HTMLButtonElement>(null)

    return (
      <>
        <Button
          ref={checkoutButtonRef}
          type={shouldRequestTermsAndConditions ? 'button' : 'submit'}
          color="main0"
          kind="default"
          size="lg"
          variant="primary"
          disabled={disabled}
          onClick={
            shouldRequestTermsAndConditions
              ? handleRequestTermsAndConditionsAgreement
              : handleSubmit
          }
        >
          {title}
        </Button>
        {tooltipContent && (
          <ResponsiveTooltip
            my={isFooter ? 'bottom-right' : 'bottom-center'}
            at={isFooter ? 'top-right' : 'top-center'}
            targetRef={checkoutButtonRef}
            content={tooltipContent}
          />
        )}
      </>
    )
  },
)
CheckoutButton.displayName = 'CheckoutButton'

export default function NewInstancePage({ mainRef }: PageProps) {
  const {
    address,
    accountBalance,
    blockchainName,
    streamDisabled,
    disabledStreamDisabledMessage,
    manuallySelectCRNDisabled,
    manuallySelectCRNDisabledMessage,
    createInstanceDisabled,
    createInstanceDisabledMessage,
    createInstanceButtonTitle,
    values,
    control,
    errors,
    node,
    nodeSpecs,
    lastVersion,
    selectedModal,
    setSelectedModal,
    selectedNode,
    setSelectedNode,
    termsAndConditions,
    shouldRequestTermsAndConditions,
    modalOpen,
    modalClose,
    handleManuallySelectCRN,
    handleSelectNode,
    handleSubmit,
    handleCloseModal,
    handleBack,
    handleRequestTermsAndConditionsAgreement,
    handleAcceptTermsAndConditions,
    handleCheckTermsAndConditions,
  } = useNewInstancePage()

  const sectionNumber = useCallback(
    (n: number) => (values.paymentMethod === PaymentMethod.Stream ? 1 : 0) + n,
    [values.paymentMethod],
  )

  // ------------------
  // Handle modals
  useEffect(
    () => {
      if (!modalOpen) return
      if (!modalClose) return

      switch (selectedModal) {
        case 'node-list':
          return modalOpen({
            header: '',
            width: '80rem',
            onClose: handleCloseModal,
            content: (
              <CRNList
                selected={selectedNode}
                onSelectedChange={setSelectedNode}
              />
            ),
            footer: (
              <>
                <div tw="w-full flex justify-end">
                  <Button
                    type="button"
                    variant="primary"
                    size="md"
                    onClick={handleSelectNode}
                    disabled={!selectedNode}
                    tw="ml-auto!"
                  >
                    Continue
                  </Button>
                </div>
              </>
            ),
          })
        case 'terms-and-conditions':
          if (!termsAndConditions) return modalClose()

          return modalOpen({
            header: (
              <TextGradient type="h6">Accept Terms & Conditions</TextGradient>
            ),
            width: '34rem',
            onClose: handleCloseModal,
            content: (
              <>
                <div tw="flex items-center gap-4 max-w-md mb-8">
                  <Checkbox
                    onChange={handleCheckTermsAndConditions}
                    checked={values.termsAndConditions}
                  />
                  <div className="tp-body">
                    I have read, understood, and agree to the{' '}
                    <ExternalLink
                      text="Terms & Conditions"
                      href={termsAndConditions.url}
                      color="main0"
                      typo="body3"
                      underline
                    />{' '}
                    of this Core Resouce Node.
                  </div>
                </div>
              </>
            ),
            footer: (
              <>
                <div tw="w-full flex justify-between">
                  <Button
                    type="button"
                    variant="secondary"
                    size="md"
                    onClick={handleCloseModal}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    onClick={handleAcceptTermsAndConditions}
                    disabled={!values.termsAndConditions}
                  >
                    Confirm & Proceed
                  </Button>
                </div>
              </>
            ),
          })
        default:
          return modalClose()
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      node,
      selectedModal,
      selectedNode,
      values.termsAndConditions,
      setSelectedNode,
      handleSelectNode,
      handleCloseModal,
      handleCheckTermsAndConditions,
      handleAcceptTermsAndConditions,
      /*
      Both modalOpen and modalClose are not included in the dependencies because there's
      an infinite refresh loop when they are included. This is because the modalOpen
      and modalClose functions are being redefined on every render, causing the
      useEffect to run again and again.
       */
      // modalOpen,
      // modalClose,
    ],
  )
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
            version={node?.version || ''}
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
    ] as TableColumn<CRNSpecs>[]
  }, [lastVersion, setSelectedModal])

  const nodeData = useMemo(() => (node ? [node] : []), [node])
  const manuallySelectButtonRef = useRef<HTMLButtonElement>(null)
  const manuallySelectButtonRef2 = useRef<HTMLButtonElement>(null)

  return (
    <>
      <BackButtonSection handleBack={handleBack} />
      <Form onSubmit={handleSubmit} errors={errors}>
        <section tw="px-0 py-0 md:py-8">
          <Container>
            <NewEntityTab selected="instance" />
          </Container>
        </section>
        {createInstanceDisabledMessage && (
          <section tw="px-0 pt-20 pb-6 md:py-10">
            <Container>
              <BorderBox $color="warning">
                {createInstanceDisabledMessage}
              </BorderBox>
            </Container>
          </section>
        )}
        {values.paymentMethod === PaymentMethod.Stream && (
          <section tw="px-0 pt-20 pb-6 md:py-10">
            <Container>
              <SectionTitle number={1}>Select your node</SectionTitle>
              <p>
                Your instance is set up with your manually selected Compute
                Resource Node (CRN), operating under the{' '}
                <Strong>Pay-as-you-go</Strong> payment method on{' '}
                <Strong>{blockchainName}</Strong>. This setup gives you direct
                control over your resource allocation and costs, requiring
                active management of your instance. To adjust your CRN or
                explore different payment options, you can modify your selection
                below.
              </p>
              <div tw="px-0 mt-12 mb-6 min-h-[6rem] relative">
                <NoisyContainer>
                  <NodesTable
                    columns={columns}
                    data={nodeData}
                    rowProps={() => ({ className: '_active' })}
                  />
                  <div tw="mt-6">
                    {!node && (
                      <>
                        <Button
                          ref={manuallySelectButtonRef}
                          type="button"
                          kind="functional"
                          variant="warning"
                          size="md"
                          onClick={handleManuallySelectCRN}
                          disabled={manuallySelectCRNDisabled}
                        >
                          Manually select CRN
                        </Button>
                        {manuallySelectCRNDisabledMessage && (
                          <ResponsiveTooltip
                            my="bottom-left"
                            at="center-center"
                            targetRef={manuallySelectButtonRef}
                            content={manuallySelectCRNDisabledMessage}
                          />
                        )}
                      </>
                    )}
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
            {values.paymentMethod === PaymentMethod.Hold ? (
              <p>
                Your instance is ready to be configured using our{' '}
                <Strong>automated CRN selection</Strong>, set to run on{' '}
                <Strong>{blockchainName}</Strong> with the{' '}
                <Strong>Holder-tier payment</Strong> method, allowing you
                seamless access while you hold ALEPH tokens. If you wish to
                customize your Compute Resource Node (CRN) or use a different
                payment approach, you can change your selection below.
              </p>
            ) : (
              <p>
                Please select one of the available instance tiers as a base for
                your VM. You will be able to customize the volumes further below
                in the form.
              </p>
            )}

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
                {values.paymentMethod !== PaymentMethod.Stream ? (
                  <div tw="mt-6">
                    <Button
                      ref={manuallySelectButtonRef2}
                      type="button"
                      kind="functional"
                      variant="warning"
                      size="md"
                      disabled={manuallySelectCRNDisabled}
                      onClick={handleManuallySelectCRN}
                    >
                      Manually select CRN
                    </Button>
                    {manuallySelectCRNDisabledMessage && (
                      <ResponsiveTooltip
                        my="bottom-left"
                        at="center-center"
                        targetRef={manuallySelectButtonRef2}
                        content={manuallySelectCRNDisabledMessage}
                      />
                    )}
                  </div>
                ) : (
                  !node && (
                    <div tw="mt-6 text-center">
                      First select your node in the previous step
                    </div>
                  )
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
              Chose a base image for your VM. It&apos;s the base system that you
              will be able to customize.
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
              Access your cloud instances securely. Give existing key&apos;s
              below access to this instance or add new keys. Remember, storing
              private keys safely is crucial for security. If you need help, our
              support team is always ready to assist.
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
                <SwitchToggleContainer label="Add Volume">
                  <TextGradient forwardedAs="h2" type="h6" color="main0">
                    Add volumes
                  </TextGradient>
                  <AddVolumes
                    name="volumes"
                    control={control}
                    systemVolumeSize={values.systemVolumeSize}
                  />
                </SwitchToggleContainer>
              </div>
              <div tw="mb-4">
                <SwitchToggleContainer label="Add Environmental Variables">
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
                </SwitchToggleContainer>
              </div>
              <div tw="mb-4">
                <SwitchToggleContainer label="Add Custom Domain">
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
                </SwitchToggleContainer>
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
          disablePaymentMethod={streamDisabled}
          disabledStreamTooltip={disabledStreamDisabledMessage}
          mainRef={mainRef}
          description={
            <>
              You can either leverage the traditional method of holding tokens
              in your wallet for resource access, or opt for the Pay-As-You-Go
              (PAYG) system, which allows you to pay precisely for what you use,
              for the duration you need. The PAYG option includes a token stream
              feature, enabling real-time payment for resources as you use them.
            </>
          }
          // Duplicate buttons to have different references for the tooltip on each one
          button={
            <CheckoutButton
              disabled={createInstanceDisabled}
              title={createInstanceButtonTitle}
              tooltipContent={createInstanceDisabledMessage}
              isFooter={false}
              shouldRequestTermsAndConditions={shouldRequestTermsAndConditions}
              handleRequestTermsAndConditionsAgreement={
                handleRequestTermsAndConditionsAgreement
              }
              handleSubmit={handleSubmit}
            />
          }
          footerButton={
            <CheckoutButton
              disabled={createInstanceDisabled}
              title={createInstanceButtonTitle}
              tooltipContent={createInstanceDisabledMessage}
              isFooter={true}
              shouldRequestTermsAndConditions={shouldRequestTermsAndConditions}
              handleRequestTermsAndConditionsAgreement={
                handleRequestTermsAndConditionsAgreement
              }
              handleSubmit={handleSubmit}
            />
          }
        />
      </Form>
    </>
  )
}
