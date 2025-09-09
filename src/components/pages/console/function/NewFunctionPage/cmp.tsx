import Head from 'next/head'
import { Button, TextGradient } from '@aleph-front/core'
import { EntityType, EntityDomainType } from '@/helpers/constants'
import { useNewFunctionPage } from './hook'
import CheckoutSummary from '@/components/form/CheckoutSummary'
import SelectInstanceSpecs from '@/components/form/SelectInstanceSpecs'
import AddVolumes from '@/components/form/AddVolumes'
import AddDomains from '@/components/form/AddDomains'
import AddNameAndTags from '@/components/form/AddNameAndTags'
import { CenteredContainer } from '@/components/common/CenteredContainer'
import AddFunctionCode from '@/components/form/AddFunctionCode'
import SelectFunctionPersistence from '@/components/form/SelectFunctionPersistence'
import BorderBox from '@/components/common/BorderBox'
import { convertByteUnits } from '@/helpers/utils'
import Form from '@/components/form/Form'
import SwitchToggleContainer from '@/components/common/SwitchToggleContainer'
import SelectCustomFunctionRuntime from '@/components/form/SelectCustomFunctionRuntime'
import NewEntityTab from '@/components/common/NewEntityTab'
import { CompositeSectionTitle } from '@/components/common/CompositeTitle'
import { PageProps } from '@/types/types'
import BackButtonSection from '@/components/common/BackButtonSection'

export default function NewFunctionPage({ mainRef }: PageProps) {
  const {
    address,
    accountBalance,
    createFunctionDisabled,
    createFunctionButtonTitle,
    values,
    control,
    errors,
    cost,
    handleSubmit,
    handleBack,
  } = useNewFunctionPage()

  return (
    <>
      <Head>
        <title>Console | New Function | Aleph Cloud</title>
        <meta
          name="description"
          content="Create a new serverless function on Aleph Cloud"
        />
      </Head>
      <BackButtonSection handleBack={handleBack} />
      <Form onSubmit={handleSubmit} errors={errors}>
        <section tw="px-0 py-0 md:py-8">
          <CenteredContainer>
            <NewEntityTab selected="function" />
          </CenteredContainer>
        </section>
        <section tw="px-0 pt-20 pb-6 md:py-10">
          <CenteredContainer>
            <CompositeSectionTitle number="1">
              Code to execute
            </CompositeSectionTitle>
            <p>
              If your code has any dependencies, you can upload them separately
              in the volume section below to ensure a faster creation.
            </p>
            <AddFunctionCode name="code" control={control} />
          </CenteredContainer>
        </section>
        <section tw="px-0 py-6 md:py-10">
          <CenteredContainer>
            <CompositeSectionTitle number="2">
              Type of scheduling
            </CompositeSectionTitle>
            <p tw="mb-6">
              Configure if this program should be running continuously,
              persistent, or only on-demand in response to a user request or an
              event.
            </p>
            <SelectFunctionPersistence name="isPersistent" control={control} />
          </CenteredContainer>
        </section>
        <section tw="px-0 py-6 md:py-10">
          <CenteredContainer>
            <CompositeSectionTitle number="3">
              Select an instance size
            </CompositeSectionTitle>
            <p tw="mb-6">
              Select the hardware resources allocated to your functions,
              ensuring optimal performance and efficient resource usage tailored
              to your specific needs.
            </p>
            <SelectInstanceSpecs
              name="specs"
              control={control}
              type={EntityType.Program}
              isPersistent={values.isPersistent}
            />
          </CenteredContainer>
        </section>
        <section tw="px-0 py-6 md:py-10">
          <CenteredContainer>
            <CompositeSectionTitle number="4">
              Name and tags
            </CompositeSectionTitle>
            <p tw="mb-6">
              Organize and identify your functions more effectively by assigning
              a unique name, obtaining a hash reference, and defining multiple
              tags. This helps streamline your development process and makes it
              easier to manage your web3 functions.
            </p>
            <AddNameAndTags control={control} entityType={EntityType.Program} />
          </CenteredContainer>
        </section>

        <section tw="px-0 pt-20 pb-6 md:py-10">
          <CenteredContainer>
            <CompositeSectionTitle number="5">
              Advanced Configuration Options
            </CompositeSectionTitle>
            <p tw="mb-6">
              Customize your function with our Advanced Configuration Options.
              Add volumes and custom domains to meet your specific needs.
            </p>
            <div tw="px-0 my-6">
              <div tw="mb-4">
                <SwitchToggleContainer label="Use Custom Runtime">
                  <SelectCustomFunctionRuntime
                    name="runtime"
                    control={control}
                  />
                </SwitchToggleContainer>
              </div>
              <div tw="mb-4">
                <SwitchToggleContainer label="Add Volume">
                  <TextGradient forwardedAs="h2" type="h6" color="main0">
                    Add volumes
                  </TextGradient>
                  {values.specs && (
                    <BorderBox $color="main2" tw="my-4" className="tp-body1">
                      Good news! Your selected package already includes{' '}
                      <span className="text-main0">
                        {convertByteUnits(values.specs.storage, {
                          from: 'MiB',
                          to: 'GiB',
                          displayUnit: true,
                        })}
                      </span>{' '}
                      of storage at no additional cost. Feel free to add it
                      here.
                    </BorderBox>
                  )}
                  <AddVolumes name="volumes" control={control} />
                </SwitchToggleContainer>
              </div>
              <div tw="mb-4">
                <SwitchToggleContainer label="Add Custom Domain">
                  <TextGradient forwardedAs="h2" type="h6" color="main0">
                    Custom domain
                  </TextGradient>
                  <p tw="mb-6">
                    Configure an user-friendly domain name for your web3
                    function, providing a more accessible and professional way
                    for users to interact with your application.
                  </p>
                  <AddDomains
                    name="domains"
                    control={control}
                    entityType={EntityDomainType.Program}
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
          unlockedAmount={accountBalance}
          mainRef={mainRef}
          description={
            <>
              This amount needs to be present in your wallet until the function
              is removed. Tokens won&apos;t be locked nor consumed. The function
              will be garbage collected once funds are removed from the wallet.
            </>
          }
          button={
            <Button
              type="submit"
              color="main0"
              kind="default"
              size="lg"
              variant="primary"
              disabled={createFunctionDisabled}
              // @note: handleSubmit is needed on the floating footer to trigger form submit (transcluded to body)
              onClick={handleSubmit}
            >
              {createFunctionButtonTitle || 'Create function'}
            </Button>
          }
        />
      </Form>
    </>
  )
}
