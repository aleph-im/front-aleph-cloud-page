import { Button, Tabs } from '@aleph-front/aleph-core'
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
import BorderBox from '@/components/common/BorderBox'
import { convertByteUnits } from '@/helpers/utils'
import Form from '@/components/form/Form'

export default function NewFunctionPage() {
  const {
    address,
    accountBalance,
    isCreateButtonDisabled,
    values,
    control,
    errors,
    handleSubmit,
    handleChangeEntityTab,
  } = useNewFunctionPage()

  return (
    <Form onSubmit={handleSubmit} errors={errors}>
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
            If your code has any dependencies, you can upload them separately in
            the volume section below to ensure a faster creation.
          </p>
          <AddFunctionCode name="code" control={control} />
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
          <SelectFunctionRuntime name="runtime" control={control} />
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
          <SelectFunctionPersistence name="isPersistent" control={control} />
        </Container>
      </section>
      <section tw="px-0 py-6 md:py-10">
        <Container>
          <CompositeTitle as="h2" number="4">
            Select an instance size
          </CompositeTitle>
          <p tw="mb-6">
            Select the hardware resources allocated to your functions, ensuring
            optimal performance and efficient resource usage tailored to your
            specific needs.
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
          <CompositeTitle as="h2" number="5">
            Name and tags
          </CompositeTitle>
          <p tw="mb-6">
            Organize and identify your functions more effectively by assigning a
            unique name, obtaining a hash reference, and defining multiple tags.
            This helps streamline your development process and makes it easier
            to manage your web3 functions.
          </p>
          <AddNameAndTags control={control} entityType={EntityType.Program} />
        </Container>
      </section>
      <section tw="px-0 py-6 md:py-10">
        <Container>
          <CompositeTitle as="h2" number="6">
            Add volumes
          </CompositeTitle>
          {values.specs && (
            <BorderBox $color="main2" tw="mt-4" className="tp-body1">
              Good news! Your selected package already includes{' '}
              <span className="text-main0">
                {convertByteUnits(values.specs.storage, {
                  from: 'MiB',
                  to: 'GiB',
                  displayUnit: true,
                })}
              </span>{' '}
              of storage at no additional cost. This has been factored into your
              configuration to maximize efficiency and value. Feel free to
              adjust as necessary.
            </BorderBox>
          )}
          <AddVolumes name="volumes" control={control} />
        </Container>
      </section>
      <section tw="px-0 py-6 md:py-10">
        <Container>
          <CompositeTitle as="h2" number="7">
            Add environment variables
          </CompositeTitle>
          <p tw="mb-6">
            Define key-value pairs that act as configuration settings for your
            web3 function. Environment variables offer a convenient way to store
            information, manage configurations, and modify your
            application&apos;s behaviour without altering the source code.
          </p>
          <AddEnvVars name="envVars" control={control} />
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
          <AddDomains
            name="domains"
            control={control}
            entityType={EntityType.Program}
          />
        </Container>
      </section>
      <HoldingRequirements
        address={address}
        type={EntityType.Program}
        isPersistent={values.isPersistent}
        specs={values.specs}
        volumes={values.volumes}
        domains={values.domains}
        unlockedAmount={accountBalance}
        description={
          <>
            This amount needs to be present in your wallet until the function is
            removed. Tokens won&apos;t be locked nor consumed. The function will
            be garbage collected once funds are removed from the wallet.
          </>
        }
        button={
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
        }
      />
    </Form>
  )
}
