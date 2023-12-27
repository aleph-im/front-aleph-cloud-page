import { Button, TextGradient, CompositeTitle } from '@aleph-front/aleph-core'
import SelectInstanceImage from '@/components/form/SelectInstanceImage'
import SelectInstanceSpecs from '@/components/form/SelectInstanceSpecs'
import AddVolumes from '@/components/form/AddVolumes'
import AddEnvVars from '@/components/form/AddEnvVars'
import AddSSHKeys from '@/components/form/AddSSHKeys'
import AddDomains from '@/components/form/AddDomains'
import AddNameAndTags from '@/components/form/AddNameAndTags'
import HoldingRequirements from '@/components/common/HoldingRequirements'
import { EntityType } from '@/helpers/constants'
import Container from '@/components/common/CenteredContainer'
import { useNewInstanceHOLDPage } from '@/hooks/pages/dashboard/useNewInstanceHOLDPage'
import Form from '@/components/form/Form'
import ToggleContainer from '@/components/common/ToggleContainer/cmp'
import NewEntityTab from '../NewEntityTab'

export default function NewInstanceHOLDPage() {
  const {
    address,
    accountBalance,
    isCreateButtonDisabled,
    values,
    control,
    errors,
    handleSubmit,
  } = useNewInstanceHOLDPage()

  return (
    <Form onSubmit={handleSubmit} errors={errors}>
      <section tw="px-0 py-0 md:py-8">
        <Container>
          <NewEntityTab selected="instance" />
        </Container>
      </section>
      <section tw="px-0 pt-20 pb-6 md:py-10">
        <Container>
          <CompositeTitle as="h2" number="1">
            Choose an image
          </CompositeTitle>
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
          <CompositeTitle as="h2" number="2">
            Select an instance size
          </CompositeTitle>
          <p>
            Please select one of the available instance size as a base for your
            VM. You will be able to customize the volumes later.
          </p>
          <div tw="px-0 my-6">
            <SelectInstanceSpecs
              name="specs"
              control={control}
              type={EntityType.Instance}
              isPersistent
            />
          </div>
        </Container>
      </section>
      <section tw="px-0 pt-20 pb-6 md:py-10">
        <Container>
          <CompositeTitle as="h2" number="3">
            Configure SSH Key
          </CompositeTitle>
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
          <CompositeTitle as="h2" number="4">
            Name and tags
          </CompositeTitle>
          <p tw="mb-6">
            Organize and identify your instances more effectively by assigning a
            unique name, obtaining a hash reference, and defining multiple tags.
            This helps streamline your development process and makes it easier
            to manage your web3 instances.
          </p>
          <AddNameAndTags control={control} entityType={EntityType.Instance} />
        </Container>
      </section>
      <section tw="px-0 pt-20 pb-6 md:py-10">
        <Container>
          <CompositeTitle as="h2" number="5">
            Advanced Configuration Options
          </CompositeTitle>
          <p tw="mb-6">
            Customize your instance with our Advanced Configuration Options. Add
            volumes, SSH keys, environment variables, and custom domains to meet
            your specific needs.
          </p>
          <div tw="px-0 my-6">
            <div tw="mb-4">
              <ToggleContainer label="Add Volume">
                <TextGradient forwardedAs="h2" type="h6" color="main0">
                  Add volumes
                </TextGradient>
                <AddVolumes name="volumes" control={control} />
              </ToggleContainer>
            </div>
            <div tw="mb-4">
              <ToggleContainer label="Add Environmental Variables">
                <TextGradient forwardedAs="h2" type="h6" color="main0">
                  Add environment variables
                </TextGradient>
                <p tw="mb-6">
                  Define key-value pairs that act as configuration settings for
                  your web3 instance. Environment variables offer a convenient
                  way to store information, manage configurations, and modify
                  your application&apos;s behaviour without altering the source
                  code.
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
                  You have the ability to configure a domain name to access your
                  cloud instances. By setting up a user-friendly custom domain,
                  accessing your instances becomes easier and more intuitive.
                  It&amp;s another way we&amp;re making web3 cloud management as
                  straightforward as possible.
                </p>
                <AddDomains
                  name="domains"
                  control={control}
                  entityType={EntityType.Instance}
                />
              </ToggleContainer>
            </div>
          </div>
        </Container>
      </section>

      <HoldingRequirements
        address={address}
        type={EntityType.Instance}
        isPersistent={true}
        specs={values.specs}
        volumes={values.volumes}
        domains={values.domains}
        unlockedAmount={accountBalance}
        description={
          <>
            This amount needs to be present in your wallet until the instance is
            removed. Tokens won&apos;t be locked nor consumed. The instance will
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
            Create instance
          </Button>
        }
      />
    </Form>
  )
}
