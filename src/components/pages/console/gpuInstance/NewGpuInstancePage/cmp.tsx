import React from 'react'
import { useEffect, useMemo, useRef } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import {
  Button,
  TextGradient,
  NodeName,
  NodeScore,
  TableColumn,
  NoisyContainer,
  Checkbox,
} from '@aleph-front/core'
import ButtonWithInfoTooltip from '@/components/common/ButtonWithInfoTooltip'
import { CRNSpecs } from '@/domain/node'
import SelectInstanceImage from '@/components/form/SelectInstanceImage'
import SelectInstanceSpecs from '@/components/form/SelectInstanceSpecs'
import AddVolumes from '@/components/form/AddVolumes'
import AddSSHKeys from '@/components/form/AddSSHKeys'
import AddDomains from '@/components/form/AddDomains'
import AddNameAndTags from '@/components/form/AddNameAndTags'
import CheckoutSummary from '@/components/form/CheckoutSummary'
import { EntityDomainType, EntityType, apiServer } from '@/helpers/constants'
import { CenteredContainer } from '@/components/common/CenteredContainer'
import Form from '@/components/form/Form'
import SwitchToggleContainer from '@/components/common/SwitchToggleContainer'
import NewEntityTab from '@/components/common/NewEntityTab'
import NodesTable from '@/components/common/NodesTable'
import SpinnerOverlay from '@/components/common/SpinnerOverlay'
import { CompositeSectionTitle } from '@/components/common/CompositeTitle'
import { PageProps } from '@/types/types'
import Strong from '@/components/common/Strong'
import CRNList from '../../../../common/CRNList'
import BackButtonSection from '@/components/common/BackButtonSection'
import ExternalLink from '@/components/common/ExternalLink'
import { useNewGpuInstancePage } from './hook'
import CheckoutButton from '@/components/form/CheckoutButton'

export default function NewGpuInstancePage({ mainRef }: PageProps) {
  const {
    address,
    accountCreditBalance,
    blockchainName,
    manuallySelectCRNDisabled,
    manuallySelectCRNDisabledMessage,
    createInstanceDisabled,
    createInstanceButtonTitle,
    values,
    control,
    errors,
    cost,
    node,
    nodeSpecs,
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
  } = useNewGpuInstancePage()

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
                enableGpu
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
        label: 'GPU',
        render: (node) => node?.selectedGpu?.model,
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
              Change GPU
            </Button>
          </div>
        ),
      },
    ] as TableColumn<CRNSpecs>[]
  }, [setSelectedModal])

  const nodeData = useMemo(() => (node ? [node] : []), [node])
  const manuallySelectButtonRef = useRef<HTMLButtonElement>(null)

  return (
    <>
      <Head>
        <title>Console | New GPU Instance | Aleph Cloud</title>
        <meta
          name="description"
          content="Create a new GPU-enabled virtual machine on Aleph Cloud"
        />
      </Head>
      <BackButtonSection handleBack={handleBack} />
      <Form onSubmit={handleSubmit} errors={errors}>
        <section tw="px-0 py-0 md:py-8">
          <CenteredContainer>
            <NewEntityTab selected="gpu-instance" />
          </CenteredContainer>
        </section>
        <section tw="px-0 pt-20 pb-6 md:py-10">
          <CenteredContainer>
            <CompositeSectionTitle number={1}>
              Selected GPU
            </CompositeSectionTitle>
            <p>
              Your instance is configured with your manually selected GPU,
              operating under the <Strong>Pay-as-you-go</Strong> payment method
              on <Strong>{blockchainName}</Strong>. This setup provides direct
              control over your resource allocation and costs, requiring active
              management of your instance. To adjust your GPU or explore
              different payment options, modify your selection below.
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
                      <ButtonWithInfoTooltip
                        ref={manuallySelectButtonRef}
                        type="button"
                        kind="functional"
                        variant="warning"
                        size="md"
                        disabled={manuallySelectCRNDisabled}
                        tooltipContent={manuallySelectCRNDisabledMessage}
                        onClick={handleManuallySelectCRN}
                      >
                        Manually select GPU
                      </ButtonWithInfoTooltip>
                    </>
                  )}
                </div>
              </NoisyContainer>
            </div>
          </CenteredContainer>
        </section>
        <section tw="px-0 pt-20 pb-6 md:py-10">
          <CenteredContainer>
            <CompositeSectionTitle number={1}>
              Select your tier
            </CompositeSectionTitle>
            <p>
              Please select one of the available instance tiers as a base for
              your VM. You will be able to customize the volumes further below
              in the form.
            </p>

            <div tw="px-0 my-6 relative">
              <SpinnerOverlay show={!!node && !nodeSpecs} />
              <SelectInstanceSpecs
                name="specs"
                control={control}
                type={EntityType.GpuInstance}
                gpuModel={node?.selectedGpu?.model}
                isPersistent
                nodeSpecs={nodeSpecs}
              >
                {!node && (
                  <div tw="mt-6 text-center">
                    First select your node in the previous step
                  </div>
                )}
              </SelectInstanceSpecs>
            </div>
          </CenteredContainer>
        </section>
        <section tw="px-0 pt-20 pb-6 md:py-10">
          <CenteredContainer>
            <CompositeSectionTitle number={2}>
              Choose an image
            </CompositeSectionTitle>
            <p>
              Chose a base image for your GPU Instance. It&apos;s the base
              system that you will be able to customize.
            </p>
            <div tw="px-0 mt-12 mb-6">
              <SelectInstanceImage name="image" control={control} />
            </div>
          </CenteredContainer>
        </section>
        <section tw="px-0 pt-20 pb-6 md:py-10">
          <CenteredContainer>
            <CompositeSectionTitle number={3}>
              Configure SSH Key
            </CompositeSectionTitle>
            <p>
              Access your cloud instances securely. Give existing key&apos;s
              below access to this instance or add new keys. Remember, storing
              private keys safely is crucial for security. If you need help, our
              support team is always ready to assist.
            </p>
            <div tw="px-0 my-6">
              <AddSSHKeys name="sshKeys" control={control} />
            </div>
          </CenteredContainer>
        </section>
        <section tw="px-0 pt-20 pb-6 md:py-10">
          <CenteredContainer>
            <CompositeSectionTitle number={4}>
              Name and tags
            </CompositeSectionTitle>
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
          </CenteredContainer>
        </section>
        <section tw="px-0 pt-20 pb-6 md:py-10">
          <CenteredContainer>
            <CompositeSectionTitle number={5}>
              Advanced Configuration Options
            </CompositeSectionTitle>
            <p tw="mb-6">
              Customize your GPU Instance with our Advanced Configuration
              Options. Add volumes and custom domains to meet your specific
              needs.
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
                    systemVolume={values.systemVolume}
                  />
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
          </CenteredContainer>
        </section>

        <CheckoutSummary
          control={control}
          address={address}
          cost={cost}
          unlockedAmount={accountCreditBalance}
          mainRef={mainRef}
          description={
            <>
              Aleph Cloud runs on a <strong>credit-based system</strong>,
              designed for flexibility and transparency. You can top up credits
              with <strong>fiat, USDC, or ALEPH</strong>. Your credits are
              deducted only as you consume resources, ensuring you pay exactly
              for what you use.
            </>
          }
          // Duplicate buttons to have different references for the tooltip on each one
          button={
            <CheckoutButton
              disabled={createInstanceDisabled}
              title={createInstanceButtonTitle}
              isFooter={false}
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
