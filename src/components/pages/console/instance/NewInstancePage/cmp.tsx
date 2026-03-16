import React from 'react'
import { useMemo, useRef } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import {
  Button,
  TextGradient,
  NodeVersion,
  NodeName,
  NodeScore,
  TableColumn,
  NoisyContainer,
  Checkbox,
  Modal,
  Icon,
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
import { EntityDomainType, EntityType } from '@/helpers/constants'
import { useSettings } from '@/hooks/common/useSettings'
import { CenteredContainer } from '@/components/common/CenteredContainer'
import { useNewInstancePage } from './hook'
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
import CheckoutButton from '@/components/form/CheckoutButton'

export default function NewInstancePage({ mainRef }: PageProps) {
  const {
    address,
    accountCreditBalance,
    manuallySelectCRNDisabled,
    manuallySelectCRNDisabledMessage,
    createInstanceDisabled,
    createInstanceButtonTitle,
    minimumBalanceNeeded,
    insufficientFundsInfo,
    values,
    control,
    errors,
    cost,
    node,
    nodeSpecs,
    lastVersion,
    selectedModal,
    setSelectedModal,
    selectedNode,
    setSelectedNode,
    termsAndConditions,
    shouldRequestTermsAndConditions,
    aggregatedSpecs,
    compatibleNodesCount,
    handleManuallySelectCRN,
    handleSelectNode,
    handleSubmit,
    handleCloseModal,
    handleBack,
    handleRequestTermsAndConditionsAgreement,
    handleAcceptTermsAndConditions,
    handleCheckTermsAndConditions,
  } = useNewInstancePage()

  const { apiServer } = useSettings()

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
  }, [apiServer, lastVersion, setSelectedModal])

  const nodeData = useMemo(() => (node ? [node] : []), [node])
  const manuallySelectButtonRef = useRef<HTMLButtonElement>(null)

  return (
    <>
      <Head>
        <title>Console | New Instance | Aleph Cloud</title>
        <meta
          name="description"
          content="Create a new virtual machine instance on Aleph Cloud"
        />
      </Head>
      <BackButtonSection handleBack={handleBack} />
      <Form onSubmit={handleSubmit} errors={errors}>
        <section tw="px-0 py-0 md:py-8">
          <CenteredContainer>
            <NewEntityTab selected="instance" />
          </CenteredContainer>
        </section>
        <section tw="px-0 pt-20 pb-6 md:py-10">
          <CenteredContainer>
            <CompositeSectionTitle number={1}>
              Select your tier
            </CompositeSectionTitle>
            <p>
              Please select one of the available instance tiers as a base for
              your VM. A compatible CRN node will be automatically selected for
              you based on your tier choice. You can customize the node
              selection in the advanced options below.
            </p>

            <div tw="px-0 my-6 relative">
              <SpinnerOverlay show={!aggregatedSpecs} />
              <SelectInstanceSpecs
                name="specs"
                control={control}
                type={EntityType.Instance}
                isPersistent
                nodeSpecs={nodeSpecs}
                aggregatedSpecs={aggregatedSpecs}
                showOpenClawSpotlight
              />

              {/* Auto-selected node info */}
              {node && (
                <NoisyContainer tw="mt-6">
                  <div tw="flex items-center gap-4">
                    <Icon name="server" size="lg" tw="opacity-60" />
                    <div tw="flex-1">
                      <p className="tp-body2" tw="opacity-60 mb-1">
                        Auto-selected CRN ({compatibleNodesCount} compatible
                        nodes)
                      </p>
                      <div tw="flex items-center gap-4">
                        <NodeName
                          hash={node.hash}
                          name={node.name}
                          picture={node.picture}
                          ImageCmp={Image}
                          apiServer={apiServer}
                        />
                        <NodeScore score={node.score} />
                      </div>
                    </div>
                  </div>
                </NoisyContainer>
              )}
            </div>
          </CenteredContainer>
        </section>
        <section tw="px-0 pt-20 pb-6 md:py-10">
          <CenteredContainer>
            <CompositeSectionTitle number={2}>
              Choose an image
            </CompositeSectionTitle>
            <p>
              Chose a base image for your VM. It&apos;s the base system that you
              will be able to customize.
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
              Customize your instance with our Advanced Configuration Options.
              Add volumes, custom domains, or select a specific CRN node.
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
              <div tw="mb-4">
                <SwitchToggleContainer label="Custom Node Selection">
                  <TextGradient forwardedAs="h2" type="h6" color="main0">
                    CRN Node Selection
                  </TextGradient>
                  <p tw="mb-6">
                    By default, the best performing CRN node compatible with
                    your selected tier is automatically chosen. You can manually
                    select a different node below if needed.
                  </p>
                  <div tw="px-0 mb-6 min-h-[6rem] relative">
                    <NoisyContainer>
                      <NodesTable
                        columns={columns}
                        data={nodeData}
                        rowProps={() => ({ className: '_active' })}
                      />
                      <div tw="mt-6">
                        {!node && (
                          <ButtonWithInfoTooltip
                            ref={manuallySelectButtonRef}
                            type="button"
                            kind="functional"
                            variant="warning"
                            size="md"
                            onClick={handleManuallySelectCRN}
                            disabled={manuallySelectCRNDisabled}
                            tooltipContent={manuallySelectCRNDisabledMessage}
                            tooltipPosition={{
                              my: 'bottom-left',
                              at: 'center-center',
                            }}
                          >
                            Manually select CRN
                          </ButtonWithInfoTooltip>
                        )}
                      </div>
                    </NoisyContainer>
                  </div>
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
          minimumBalanceNeeded={minimumBalanceNeeded}
          insufficientFunds={insufficientFundsInfo}
          description={
            <>
              Aleph Cloud runs on a <strong>credit-based system</strong>,
              designed for flexibility and transparency. You can top up credits
              with <strong>fiat, USDC, or ALEPH</strong>. Your credits are
              deducted only as you consume resources, ensuring you pay exactly
              for what you use.
            </>
          }
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
              insufficientFunds={insufficientFundsInfo}
            />
          }
        />
      </Form>

      {/* Node List Modal */}
      <Modal
        open={selectedModal === 'node-list'}
        onClose={handleCloseModal}
        width="80rem"
        header=""
        content={
          <>
            <NoisyContainer tw="mb-6 p-4">
              <div tw="flex items-start gap-3">
                <Icon
                  name="warning"
                  tw="text-orange-500 flex-shrink-0 mt-0.5"
                />
                <p className="tp-body2">
                  The node list below is filtered to show only{' '}
                  <Strong>{compatibleNodesCount}</Strong> nodes compatible with
                  your selected tier. To see other nodes, change your tier
                  selection.
                </p>
              </div>
            </NoisyContainer>
            <CRNList
              selected={selectedNode}
              onSelectedChange={setSelectedNode}
              filterBySpecs={values.specs}
            />
          </>
        }
        footer={
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
        }
      />

      {/* Terms and Conditions Modal */}
      <Modal
        open={selectedModal === 'terms-and-conditions' && !!termsAndConditions}
        onClose={handleCloseModal}
        width="34rem"
        header={
          <TextGradient type="h6">Accept Terms & Conditions</TextGradient>
        }
        content={
          termsAndConditions && (
            <div tw="flex items-center gap-4 max-w-md mb-8">
              <Checkbox
                onChange={handleCheckTermsAndConditions}
                checked={!!values.termsAndConditions}
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
          )
        }
        footer={
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
        }
      />
    </>
  )
}
