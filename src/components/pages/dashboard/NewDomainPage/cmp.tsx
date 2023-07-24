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
    name,
    ref,
    entityType,
    entities,
    hasEntities,
    hasFunctions,
    hasInstances,
    handleChangeName,
    handleChangeEntityType,
    handleChangeRef,
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
                <NoisyContainer>
                  <div>
                    <TextInput
                      label="Domain name"
                      value={name}
                      onChange={handleChangeName}
                      name="domain_name"
                      placeholder="Name"
                    />
                  </div>
                  <div tw="mt-8">
                    <RadioGroup
                      direction="row"
                      label="Resource type"
                      value={entityType}
                      onChange={handleChangeEntityType}
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
                        label={
                          entityType
                            ? `${EntityTypeName[entityType]} ref`
                            : 'Resource ref'
                        }
                        value={ref}
                        onChange={handleChangeRef}
                        name="domain_ref"
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
