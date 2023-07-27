import { Button, Tabs, TextGradient } from '@aleph-front/aleph-core'
import { EntityType } from '@/helpers/constants'
import CompositeTitle from '@/components/common/CompositeTitle'
import { useNewFunctionPage } from '@/hooks/pages/dashboard/useNewFunctionPage'
import HoldingRequirements from '@/components/common/HoldingRequirements'
import SelectInstanceSpecs from '@/components/form/SelectInstanceSpecs'
import AddVolumes from '@/components/form/AddVolumes'
import AddEnvVars from '@/components/form/AddEnvVars'
import AddDomains from '@/components/form/AddDomains'
import AddNameAndTags from '@/components/form/AddNameAndTags'
import SelectFunctionRuntime from '@/components/form/SelectFunctionRuntime'
import Container from '@/components/common/CenteredContainer'
import AddFunctionCode from '@/components/form/AddFunctionCode'
import SelectFunctionPersistence from '@/components/form/SelectFunctionPersistence'

export default function NewFunctionPage() {
  const {
    address,
    accountBalance,
    isCreateButtonDisabled,
    functionCodeCtrl,
    runtimeCtrl,
    specsCtrl,
    volumesCtrl,
    envVarsCtrl,
    domainsCtrl,
    nameAndTagsCtrl,
    isPersistentCtrl,
    handleSubmit,
    handleChangeEntityTab,
    values,
  } = useNewFunctionPage()

  return (
    <>
      <form onSubmit={handleSubmit}>
        <section>
          <pre>{JSON.stringify(values, null, 2)}</pre>
        </section>
        <section tw="px-0 py-0 md:py-8">
          <Container>
            <Tabs
              selected="function"
              onTabChange={handleChangeEntityTab}
              tabs={[
                {
                  id: 'function',
                  name: 'Function',
                },
                {
                  id: 'instance',
                  name: 'Instance',
                  label: 'BETA',
                  labelPosition: 'top',
                },
                {
                  id: 'confidential',
                  name: 'Confidential',
                  disabled: true,
                  label: 'SOON',
                  labelPosition: 'top',
                },
              ]}
              tw="overflow-auto"
            />
          </Container>
        </section>
        <section tw="px-0 pt-20 pb-6 md:py-10">
          <Container>
            <CompositeTitle as="h2" number="1">
              Code to execute
            </CompositeTitle>
            <p>
              If your code has any dependencies, you can upload them separately
              in the volume section below to ensure a faster creation.
            </p>
            <AddFunctionCode {...functionCodeCtrl.field} />
          </Container>
        </section>
        <section tw="px-0 py-6 md:py-10">
          <Container>
            <CompositeTitle as="h2" number="2">
              Select runtime
            </CompositeTitle>
            <p tw="mb-6">
              Select the optimal environment for executing your functions,
              tailored to your specific requirements. Below are the available
              options
            </p>
            <SelectFunctionRuntime {...runtimeCtrl.field} />
          </Container>
        </section>
        <section tw="px-0 py-6 md:py-10">
          <Container>
            <CompositeTitle as="h2" number="3">
              Type of scheduling
            </CompositeTitle>
            <p tw="mb-6">
              Configure if this program should be running continuously,
              persistent, or only on-demand in response to a user request or an
              event.
            </p>
            <SelectFunctionPersistence {...isPersistentCtrl.field} />
          </Container>
        </section>
        <section tw="px-0 py-6 md:py-10">
          <Container>
            <CompositeTitle as="h2" number="4">
              Select an instance size
            </CompositeTitle>
            <p tw="mb-6">
              Select the hardware resources allocated to your functions,
              ensuring optimal performance and efficient resource usage tailored
              to your specific needs.
            </p>
            <p tw="mb-6">
              You also get free volume storage with your instance. The free
              storage for on-demand VM is always equal to the amount of RAM,
              whilst the free storage for persistent VM is ten times (10x) the
              amount of RAM.
            </p>
            <SelectInstanceSpecs
              {...specsCtrl.field}
              type={EntityType.Program}
              isPersistent={isPersistentCtrl.field.value}
            />
          </Container>
        </section>
        <section tw="px-0 py-6 md:py-10">
          <Container>
            <CompositeTitle as="h2" number="5">
              Name and tags
            </CompositeTitle>
            <p tw="mb-6">
              Organize and identify your functions more effectively by assigning
              a unique name, obtaining a hash reference, and defining multiple
              tags. This helps streamline your development process and makes it
              easier to manage your web3 functions.
            </p>
            <AddNameAndTags
              {...nameAndTagsCtrl.field}
              entityType={EntityType.Program}
            />
          </Container>
        </section>
        <section tw="px-0 py-6 md:py-10">
          <Container>
            <CompositeTitle as="h2" number="6">
              Add volumes
            </CompositeTitle>
            <AddVolumes {...volumesCtrl.field} />
          </Container>
        </section>
        <section tw="px-0 py-6 md:py-10">
          <Container>
            <CompositeTitle as="h2" number="7">
              Add environment variables
            </CompositeTitle>
            <p tw="mb-6">
              Define key-value pairs that act as configuration settings for your
              web3 function. Environment variables offer a convenient way to
              store information, manage configurations, and modify your
              application&apos;s behaviour without altering the source code.
            </p>
            <AddEnvVars {...envVarsCtrl.field} />
          </Container>
        </section>
        <section tw="px-0 py-6 md:py-10">
          <Container>
            <CompositeTitle as="h2" number="8">
              Custom domain
            </CompositeTitle>
            <p tw="mb-6">
              Configure a user-friendly domain name for your web3 function,
              providing a more accessible and professional way for users to
              interact with your application.
            </p>
            <AddDomains {...domainsCtrl.field} />
          </Container>
        </section>
        <section
          className="fx-noise-light"
          tw="px-0 pt-6 pb-24 md:pt-16 md:pb-32"
        >
          <Container>
            <TextGradient forwardedAs="h2" type="h5" tw="mb-1">
              Estimated holding requirements
            </TextGradient>
            <div tw="mt-1 mb-6">
              <p className="text-main2">
                This amount needs to be present in your wallet until the
                function is removed. Tokens won’t be locked nor consumed. The
                function will be garbage collected once funds are removed from
                the wallet.
              </p>
            </div>
            <div tw="my-7">
              <HoldingRequirements
                address={address}
                type={EntityType.Program}
                isPersistent={isPersistentCtrl.field.value}
                specs={specsCtrl.field.value}
                volumes={volumesCtrl.field.value}
                domains={domainsCtrl.field.value}
                unlockedAmount={accountBalance}
              />
            </div>
            <div tw="my-7 text-center">
              <Button
                type="submit"
                color="main0"
                kind="neon"
                size="big"
                variant="primary"
                disabled={isCreateButtonDisabled}
              >
                Create function
              </Button>
            </div>
          </Container>
        </section>
      </form>
    </>
  )
}
