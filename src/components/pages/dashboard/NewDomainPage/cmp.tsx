import ButtonLink from '@/components/common/ButtonLink'
import Container from '@/components/common/CenteredContainer'
import NoisyContainer from '@/components/common/NoisyContainer'
import { EntityType, EntityTypeName } from '@/helpers/constants'
import { useNewDomainPage } from '@/hooks/pages/dashboard/useNewDomainPage'
import {
  Button,
  Dropdown,
  DropdownOption,
  Icon,
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
    handleSubmit,
  } = useNewDomainPage()

  return (
    <>
      <form onSubmit={handleSubmit}>
        <section tw="px-0 pt-20 pb-6 md:py-10">
          <Container>
            {!hasEntities ? (
              <>
                <p>
                  A domain should be linked to an existing resource. Try to
                  create an instance or function first
                </p>
                <div tw="mt-10 text-center">
                  <ButtonLink variant="primary" href="/dashboard/instance">
                    Create your first instance
                  </ButtonLink>
                </div>
              </>
            ) : (
              <>
                <NoisyContainer tw="z-10!">
                  <div>
                    <TextInput
                      {...nameCtrl.field}
                      {...nameCtrl.fieldState}
                      label="Domain name"
                      placeholder="Name"
                    />
                  </div>
                  <div tw="mt-8">
                    <RadioGroup
                      {...programTypeCtrl.field}
                      {...programTypeCtrl.fieldState}
                      direction="row"
                      label="Resource type"
                    >
                      <Radio
                        label="Function"
                        value={EntityType.Program}
                        disabled={!hasFunctions}
                      />
                      <Radio
                        label="Instance"
                        value={EntityType.Instance}
                        disabled={!hasInstances}
                      />
                    </RadioGroup>
                  </div>
                  {entities.length > 0 && (
                    <div tw="mt-8">
                      <Dropdown
                        {...refCtrl.field}
                        {...refCtrl.fieldState}
                        label={
                          programTypeCtrl.field.value
                            ? `${
                                EntityTypeName[programTypeCtrl.field.value]
                              } ref`
                            : 'Resource ref'
                        }
                      >
                        {entities.map(({ label, value }) => (
                          <DropdownOption key={value} value={value}>
                            <Icon
                              name="alien-8bit"
                              tw="mr-4"
                              className="text-main1"
                            />
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
                    Save domain
                  </Button>
                </div>
              </>
            )}
          </Container>
        </section>
      </form>
    </>
  )
}
