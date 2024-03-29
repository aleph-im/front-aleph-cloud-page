import { useState } from 'react'
import {
  Button,
  Dropdown,
  DropdownOption,
  Radio,
  RadioGroup,
  TextInput,
  Tabs,
} from '@aleph-front/core'
import ButtonLink from '@/components/common/ButtonLink'
import Container from '@/components/common/CenteredContainer'
import ExternalLinkButton from '@/components/common/ExternalLinkButton'
import { NoisyContainer } from '@aleph-front/core'
import Form from '@/components/form/Form'
import { EntityType, EntityTypeName } from '@/helpers/constants'
import { useNewDomainPage } from '@/hooks/pages/configure/useNewDomainPage'
import { SectionTitle } from '@/components/common/CompositeTitle'

export default function NewDomain() {
  const {
    entities,
    hasEntities,
    hasFunctions,
    hasInstances,
    nameCtrl,
    programTypeCtrl,
    refCtrl,
    ipfsRefCtrl,
    errors,
    handleSubmit,
  } = useNewDomainPage()

  const [tabId, setTabId] = useState('compute')

  return (
    <>
      <Form onSubmit={handleSubmit} errors={errors}>
        {!hasEntities ? (
          <section tw="px-0 pt-20 pb-6 md:py-10">
            <Container>
              <p>
                A domain should be linked to an existing resource. Try to create
                an instance or function first
              </p>
              <div tw="mt-10 text-center">
                <ButtonLink variant="primary" href="/computing/instance/new">
                  Create your first instance
                </ButtonLink>
              </div>
            </Container>
          </section>
        ) : (
          <>
            <section tw="px-0 pt-20 pb-6 md:py-10">
              <Container>
                <SectionTitle number="1">Custom domain</SectionTitle>
                <p tw="mb-6">
                  Assign a user-friendly domain to your instance or function to
                  not only simplify access to your web3 application but also
                  enhance its professional appearance. This is an effective way
                  to elevate user experience, establish brand identity or
                  streamline the navigation process within your application.
                </p>
                <NoisyContainer>
                  <TextInput
                    {...nameCtrl.field}
                    {...nameCtrl.fieldState}
                    required
                    label="Enter your desired custom domain in the field below"
                    placeholder="yourdomain.io"
                  />
                </NoisyContainer>
                <div tw="mt-6 text-right">
                  <ExternalLinkButton href="https://docs.aleph.im/computing/custom_domain/setup/">
                    Learn more
                  </ExternalLinkButton>
                </div>
              </Container>
            </section>
            <section tw="px-0 pt-20 pb-6 md:py-10">
              <Container>
                <SectionTitle number="2">Select Resource</SectionTitle>
                <p tw="mb-6">
                  You&apos;ll need to specify the resource your custom domain
                  will be associated with. This could either be an instance or a
                  function, depending on what you want your custom domain to
                  point to.
                </p>
                <div tw="my-10">
                  <Tabs
                    align="left"
                    selected={tabId}
                    onTabChange={setTabId}
                    tabs={[
                      {
                        id: 'compute',
                        name: 'Compute',
                      },
                      {
                        id: 'ipfs',
                        name: 'IPFS',
                      },
                    ]}
                  />
                </div>
                <div role="tabpanel">
                  {tabId === 'compute' ? (
                    <NoisyContainer tw="z-10!">
                      <RadioGroup
                        {...programTypeCtrl.field}
                        {...programTypeCtrl.fieldState}
                        required
                        label="Choose resource type"
                        direction="row"
                      >
                        <Radio
                          label={EntityTypeName[EntityType.Instance]}
                          value={EntityType.Instance}
                          disabled={!hasInstances}
                        />
                        <Radio
                          label={EntityTypeName[EntityType.Program]}
                          value={EntityType.Program}
                          disabled={!hasFunctions}
                        />
                      </RadioGroup>
                      {entities.length > 0 && (
                        <div tw="mt-10">
                          <Dropdown
                            {...refCtrl.field}
                            {...refCtrl.fieldState}
                            required
                            label="Select the specific resource from the dropdown"
                          >
                            {entities.map(({ label, value }) => (
                              <DropdownOption key={value} value={value}>
                                {label}
                              </DropdownOption>
                            ))}
                          </Dropdown>
                        </div>
                      )}
                    </NoisyContainer>
                  ) : tabId === 'ipfs' ? (
                    <div>
                      <p tw="mb-6">
                        To get started, provide the corresponding IPFS content
                        identifier (Message ID).
                      </p>
                      <NoisyContainer>
                        <TextInput
                          {...ipfsRefCtrl.field}
                          {...ipfsRefCtrl.fieldState}
                          required
                          label="Link your custom domain to an Aleph Message ID"
                          placeholder="Paste your IPFS Aleph Message ID"
                        />
                      </NoisyContainer>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
                <div tw="mt-10 text-center z-0">
                  <Button
                    type="submit"
                    color="main0"
                    kind="default"
                    size="md"
                    variant="primary"
                  >
                    Create domain
                  </Button>
                </div>
              </Container>
            </section>
          </>
        )}
      </Form>
    </>
  )
}
