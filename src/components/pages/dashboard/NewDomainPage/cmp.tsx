import ButtonLink from '@/components/common/ButtonLink'
import Container from '@/components/common/CenteredContainer'
import CompositeTitle from '@/components/common/CompositeTitle'
import ExternalLinkButton from '@/components/common/ExternalLinkButton'
import NoisyContainer from '@/components/common/NoisyContainer'
import Form from '@/components/form/Form'
import { EntityType, EntityTypeName } from '@/helpers/constants'
import { useNewDomainPage } from '@/hooks/pages/dashboard/useNewDomainPage'
import {
  Button,
  Dropdown,
  DropdownOption,
  Radio,
  RadioGroup,
  TextInput,
} from '@aleph-front/aleph-core'

export default function NewDomain() {
  const {
    entities,
    hasEntities,
    hasFunctions,
    hasInstances,
    nameCtrl,
    programTypeCtrl,
    refCtrl,
    errors,
    handleSubmit,
  } = useNewDomainPage()

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
                <ButtonLink variant="primary" href="/dashboard/instance">
                  Create your first instance
                </ButtonLink>
              </div>
            </Container>
          </section>
        ) : (
          <>
            <section tw="px-0 pt-20 pb-6 md:py-10">
              <Container>
                <CompositeTitle as="h2" number="1">
                  Custom domain
                </CompositeTitle>
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
                    label="Enter your desired custom domain in the field below"
                    placeholder="yourdomain.io"
                  />
                </NoisyContainer>
                <div tw="mt-6 text-right">
                  <ExternalLinkButton href="https://docs.aleph.im/computing/custom%20domain/Adding%20a%20Custom%20Domain/">
                    Learn more
                  </ExternalLinkButton>
                </div>
              </Container>
            </section>
            <section tw="px-0 pt-20 pb-6 md:py-10">
              <Container>
                <CompositeTitle as="h2" number="2">
                  Select Resource
                </CompositeTitle>
                <p tw="mb-6">
                  You&apos;ll need to specify the resource your custom domain
                  will be associated with. This could either be an instance or a
                  function, depending on what you want your custom domain to
                  point to.
                </p>
                <NoisyContainer tw="z-10!">
                  <RadioGroup
                    {...programTypeCtrl.field}
                    {...programTypeCtrl.fieldState}
                    direction="row"
                    label="Choose resource type"
                  >
                    <Radio
                      label={EntityTypeName[EntityType.Program]}
                      value={EntityType.Program}
                      disabled={!hasFunctions}
                    />
                    <Radio
                      label={EntityTypeName[EntityType.Instance]}
                      value={EntityType.Instance}
                      disabled={!hasInstances}
                    />
                  </RadioGroup>
                  {entities.length > 0 && (
                    <div tw="mt-10">
                      <Dropdown
                        {...refCtrl.field}
                        {...refCtrl.fieldState}
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
                <div tw="mt-10 text-center z-0">
                  <Button
                    type="submit"
                    color="main0"
                    kind="neon"
                    size="regular"
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
