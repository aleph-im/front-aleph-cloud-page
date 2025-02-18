import { Button, TextGradient } from '@aleph-front/core'
import { EntityType, EntityDomainType } from '@/helpers/constants'
import { useNewFunctionPage } from '@/hooks/pages/computing/useNewFunctionPage'
import CheckoutSummary from '@/components/form/CheckoutSummary'
import SelectInstanceSpecs from '@/components/form/SelectInstanceSpecs'
import AddVolumes from '@/components/form/AddVolumes'
import AddEnvVars from '@/components/form/AddEnvVars'
import AddDomains from '@/components/form/AddDomains'
import AddNameAndTags from '@/components/form/AddNameAndTags'
import Container from '@/components/common/CenteredContainer'
import AddFunctionCode from '@/components/form/AddFunctionCode'
import SelectFunctionPersistence from '@/components/form/SelectFunctionPersistence'
import BorderBox from '@/components/common/BorderBox'
import { convertByteUnits } from '@/helpers/utils'
import Form from '@/components/form/Form'
import SwitchToggleContainer from '@/components/common/SwitchToggleContainer'
import SelectCustomFunctionRuntime from '@/components/form/SelectCustomFunctionRuntime'
import NewEntityTab from '../NewEntityTab'
import { SectionTitle } from '@/components/common/CompositeTitle'
import { PageProps } from '@/types/types'
import BackButtonSection from '@/components/common/BackButtonSection'

export default function NewFunctionPage({ mainRef }: PageProps) {
  const {
    address,
    accountBalance,
    isCreateButtonDisabled,
    values,
    control,
    errors,
    costProps,
    handleSubmit,
    handleBack,
  } = useNewFunctionPage()

  return (
    <>
      <BackButtonSection handleBack={handleBack} />
      <Form onSubmit={handleSubmit} errors={errors}>
        <section tw="px-0 py-0 md:py-8">
          <Container>
            <NewEntityTab selected="function" />
          </Container>
        </section>
        <section tw="px-0 pt-20 pb-6 md:py-10">
          <Container>
            <SectionTitle number="1">Code to execute</SectionTitle>
            <p>
              If your code has any dependencies, you can upload them separately
              in the volume section below to ensure a faster creation.
            </p>
            <AddFunctionCode name="code" control={control} />
          </Container>
        </section>
        <section tw="px-0 py-6 md:py-10">
          <Container>
            <SectionTitle number="2">Type of scheduling</SectionTitle>
            <p tw="mb-6">
              Configure if this program should be running continuously,
              persistent, or only on-demand in response to a user request or an
              event.
            </p>
            <SelectFunctionPersistence name="isPersistent" control={control} />
          </Container>
        </section>
        <section tw="px-0 py-6 md:py-10">
          <Container>
            <SectionTitle number="3">Select an instance size</SectionTitle>
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
          </Container>
        </section>
        <section tw="px-0 py-6 md:py-10">
          <Container>
            <SectionTitle number="4">Name and tags</SectionTitle>
            <p tw="mb-6">
              Organize and identify your functions more effectively by assigning
              a unique name, obtaining a hash reference, and defining multiple
              tags. This helps streamline your development process and makes it
              easier to manage your web3 functions.
            </p>
            <AddNameAndTags control={control} entityType={EntityType.Program} />
          </Container>
        </section>

        <section tw="px-0 pt-20 pb-6 md:py-10">
          <Container>
            <SectionTitle number="5">
              Advanced Configuration Options
            </SectionTitle>
            <p tw="mb-6">
              Customize your function with our Advanced Configuration Options.
              Add volumes, environment variables, and custom domains to meet
              your specific needs.
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
                <SwitchToggleContainer label="Add Environmental Variables">
                  <TextGradient forwardedAs="h2" type="h6" color="main0">
                    Add environment variables
                  </TextGradient>
                  <p tw="mb-6">
                    Define key-value pairs that act as configuration settings
                    for your web3 function. Environment variables offer a
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
          </Container>
        </section>

        <CheckoutSummary
          control={control}
          address={address}
          costProps={costProps}
          unlockedAmount={accountBalance}
          paymentMethod={values.paymentMethod}
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
              disabled={isCreateButtonDisabled}
              // @note: handleSubmit is needed on the floating footer to trigger form submit (transcluded to body)
              onClick={handleSubmit}
            >
              Create function
            </Button>
          }
        />
      </Form>
    </>
  )
}
