import { ReactNode } from 'react'
import { Col, Row, Tabs } from '@aleph-front/aleph-core'
import CompositeTitle from '@/components/CompositeTitle'
import { useNewInstancePage } from '@/hooks/pages/useNewInstancePage'
import BaseContainer from '@/components/Container'
import ExternalLinkButton from '@/components/ExternalLinkButton'
import SelectInstanceImage from '@/components/form/SelectInstanceImage'
import SelectInstanceSpecs from '@/components/form/SelectInstanceSpecs'
import AddVolumes from '@/components/form/AddVolumes/cmp'
import AddEnvVars from '@/components/form/AddEnvVars/cmp'
import AddSSHKeys from '@/components/form/AddSSHKeys/cmp'
import AddDomains from '@/components/form/AddDomains'

const Container = ({ children }: { children: ReactNode }) => (
  <Row xs={1} lg={12} gap="0">
    <Col xs={1} lg={10} lgOffset={2} xl={8} xlOffset={3} xxl={6} xxlOffset={4}>
      <BaseContainer>
        <div tw="max-w-[715px] mx-auto">{children}</div>
      </BaseContainer>
    </Col>
  </Row>
)

export default function NewInstancePage() {
  const {
    formState,
    handleSubmit,
    handleChangeEntityTab,
    handleChangeInstanceImage,
    handleChangeInstanceSpecs,
    handleChangeVolumes,
    handleChangeEnvVars,
    handleChangeSSHKeys,
  } = useNewInstancePage()

  return (
    <>
      <form onSubmit={handleSubmit}>
        <section>
          <pre>{JSON.stringify(formState, null, 2)}</pre>
        </section>
        <section tw="px-0 py-0 md:py-8">
          <Container>
            <Tabs
              selected="instance"
              onTabChange={handleChangeEntityTab}
              tabs={[
                {
                  id: 'function',
                  name: 'Function',
                },
                {
                  id: 'instance',
                  name: 'Instance',
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
              Choose an image
            </CompositeTitle>
            <p>
              Chose a base image for your VM. It’s the base system that you will
              be able to customize.
            </p>
            <div tw="px-0 mt-12 mb-6">
              <SelectInstanceImage
                image={formState.image}
                onChange={handleChangeInstanceImage}
              />
            </div>
            <div tw="mt-6 text-right">
              <ExternalLinkButton href="https://docs.aleph.im/computing/runtimes">
                Learn more
              </ExternalLinkButton>
            </div>
          </Container>
        </section>
        <section tw="px-0 pt-20 pb-6 md:py-10">
          <Container>
            <CompositeTitle as="h2" number="2">
              Select an instance size
            </CompositeTitle>
            <p>
              Please select one of the available instance size as a base for
              your VM. You will be able to customize the volumes later.
            </p>
            <div tw="px-0 my-6">
              <SelectInstanceSpecs
                specs={formState.specs}
                onChange={handleChangeInstanceSpecs}
              />
            </div>
          </Container>
        </section>
        <section tw="px-0 pt-20 pb-6 md:py-10">
          <Container>
            <CompositeTitle as="h2" number="3">
              Add volumes
            </CompositeTitle>
            <div tw="px-0 my-6">
              <AddVolumes
                volumes={formState.volumes}
                onChange={handleChangeVolumes}
              />
            </div>
          </Container>
        </section>
        <section tw="px-0 pt-20 pb-6 md:py-10">
          <Container>
            <CompositeTitle as="h2" number="4">
              Configure SSH Key
            </CompositeTitle>
            <p>
              Access your cloud instances securely. Give existing key’s below
              access to this instance or add new keys. Remember, storing private
              keys safely is crucial for security. If you need help, our support
              team is always ready to assist.
            </p>
            <div tw="px-0 my-6">
              <AddSSHKeys
                sshKeys={formState.sshKeys}
                onChange={handleChangeSSHKeys}
              />
            </div>
          </Container>
        </section>
        <section tw="px-0 pt-20 pb-6 md:py-10">
          <Container>
            <CompositeTitle as="h2" number="5">
              Add environment variables
            </CompositeTitle>
            <p>
              Organize and identify your functions more effectively by assigning
              a unique name, obtaining a hash reference, and defining multiple
              tags. This helps streamline your development process and makes it
              easier to manage your web3 functions.
            </p>
            <div tw="px-0 my-6">
              <AddEnvVars
                envVars={formState.envVars}
                onChange={handleChangeEnvVars}
              />
            </div>
          </Container>
        </section>
        <section tw="px-0 py-6 md:py-10">
          <Container>
            <CompositeTitle as="h2" number="6" label="(SOON)" disabled>
              Custom domain
            </CompositeTitle>
            <p tw="mb-6" className="unavailable-content">
              You have the ability to configure a domain name to access your
              cloud instances. By setting up a user-friendly custom domain,
              accessing your instances becomes easier and more intuitive.
              It&amp;s another way we&amp;re making web3 cloud management as
              straightforward as possible.
            </p>
            <AddDomains />
          </Container>
        </section>
      </form>
    </>
  )
}
