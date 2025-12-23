import React, { memo, useEffect, useMemo, useState } from 'react'
import {
  Button,
  Dropdown,
  DropdownOption,
  Radio,
  RadioGroup,
  TextInput,
  NoisyContainer,
  Tabs,
} from '@aleph-front/core'
import Form from '@/components/form/Form'
import { useNewDomainForm } from './hook'
import { NewDomainFormProps } from './types'
import { CenteredContainer } from '../CenteredContainer'
import { SectionTitle } from '../CompositeTitle'
import ExternalLinkButton from '../ExternalLinkButton'
import ButtonLink from '../ButtonLink'
import {
  EntityDomainType,
  EntityDomainTypeName,
  NAVIGATION_URLS,
} from '@/helpers/constants'
import { StyledSection } from './styles'

export const NewDomainForm = ({
  name,
  entityId,
  entityType,
  onSuccess,
  variant = 'embedded',
  showResourceSelection = false,
}: NewDomainFormProps) => {
  const {
    entities,
    nameCtrl,
    targetCtrl,
    refCtrl,
    errors,
    handleSubmit,
    setTarget,
    setRef,
    initialTarget,
  } = useNewDomainForm({ name, entityId, entityType, onSuccess })

  const getTabIdFromTarget = (target?: EntityDomainType) => {
    switch (target) {
      case EntityDomainType.Instance:
      case EntityDomainType.Program:
      case EntityDomainType.Confidential:
        return 'compute'
      case EntityDomainType.IPFS:
        return 'ipfs'
      default:
        return 'website'
    }
  }

  const [tabId, setTabId] = useState(() => getTabIdFromTarget(initialTarget))

  // Update tab when initialTarget becomes available (handles async router query)
  useEffect(() => {
    if (initialTarget) {
      setTabId(getTabIdFromTarget(initialTarget))
    }
  }, [initialTarget])

  const labelResourceType = useMemo(() => {
    switch (targetCtrl.field.value) {
      case EntityDomainType.Instance:
        return 'instance'
      case EntityDomainType.Confidential:
        return 'confidential'
      default:
        return 'function'
    }
  }, [targetCtrl.field.value])

  const onTabChange = (newTabId: string) => {
    setRef('')
    setTabId(newTabId)
    if (['website', 'ipfs'].includes(newTabId)) {
      setTarget(EntityDomainType.IPFS)
    } else {
      setTarget(EntityDomainType.Program)
    }
  }

  const isEmbedded = variant === 'embedded'
  const Wrapper = isEmbedded ? React.Fragment : CenteredContainer

  return (
    <Wrapper>
      <Form onSubmit={handleSubmit} errors={errors}>
        <StyledSection $isEmbedded={isEmbedded}>
          <SectionTitle number={1}>Custom domain</SectionTitle>
          <p tw="mb-6">
            Assign a user-friendly domain to your website, instance or function
            to not only simplify access to your web3 application but also
            enhance its professional appearance. This is an effective way to
            elevate user experience, establish brand identity or streamline the
            navigation process within your application.
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
            <ExternalLinkButton href={NAVIGATION_URLS.docs.customDomains}>
              Learn more
            </ExternalLinkButton>
          </div>
          {!showResourceSelection && (
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
          )}
        </StyledSection>
        {showResourceSelection && (
          <StyledSection $isEmbedded={isEmbedded}>
            <SectionTitle number={2}>Select Resource</SectionTitle>
            <p tw="mb-6">
              You&apos;ll need to specify the resource your custom domain will
              be associated with. This could either be a website, an instance or
              a function, depending on what you want your custom domain to point
              to.
            </p>
            <div tw="my-10">
              <Tabs
                align="left"
                selected={tabId}
                onTabChange={onTabChange}
                tabs={[
                  {
                    id: 'website',
                    name: 'Website',
                  },
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
              {tabId === 'website' ? (
                <NoisyContainer tw="z-10!">
                  {entities.length > 0 ? (
                    <Dropdown
                      {...refCtrl.field}
                      {...refCtrl.fieldState}
                      required
                      label="Link your custom domain to a specific website"
                    >
                      {entities.map(({ label, value }) => (
                        <DropdownOption key={value} value={value}>
                          {label}
                        </DropdownOption>
                      ))}
                    </Dropdown>
                  ) : (
                    <div>
                      <p tw="mt-0.5 mb-3 text-black">
                        If you want to link a domain to a website, you need to
                        deploy one first *
                      </p>
                      <ButtonLink
                        type="button"
                        kind="functional"
                        size="md"
                        variant="warning"
                        href={NAVIGATION_URLS.console.web3Hosting.website.new}
                      >
                        Create your first website
                      </ButtonLink>
                    </div>
                  )}
                </NoisyContainer>
              ) : tabId === 'compute' ? (
                <NoisyContainer tw="z-10!">
                  <RadioGroup
                    {...targetCtrl.field}
                    {...targetCtrl.fieldState}
                    required
                    label="Choose resource type"
                    direction="row"
                  >
                    <Radio
                      label={EntityDomainTypeName[EntityDomainType.Program]}
                      value={EntityDomainType.Program}
                    />
                    <Radio
                      label={EntityDomainTypeName[EntityDomainType.Instance]}
                      value={EntityDomainType.Instance}
                    />
                    <Radio
                      label={
                        EntityDomainTypeName[EntityDomainType.Confidential]
                      }
                      value={EntityDomainType.Confidential}
                    />
                  </RadioGroup>
                  {entities.length > 0 ? (
                    <div tw="mt-10">
                      <Dropdown
                        {...refCtrl.field}
                        {...refCtrl.fieldState}
                        required
                        label="Select the specific resource"
                      >
                        {entities.map(({ label, value }) => (
                          <DropdownOption key={value} value={value}>
                            {label}
                          </DropdownOption>
                        ))}
                      </Dropdown>
                    </div>
                  ) : (
                    <div>
                      <p tw="mt-6 mb-3 text-black">
                        If you want to link a domain to a {labelResourceType},
                        you need to deploy one first *
                      </p>
                      <ButtonLink
                        type="button"
                        kind="functional"
                        size="md"
                        variant="warning"
                        href={`/console/computing/${labelResourceType}/new`}
                      >
                        {`Create your first ${labelResourceType}` as string}
                      </ButtonLink>
                    </div>
                  )}
                </NoisyContainer>
              ) : tabId === 'ipfs' ? (
                <NoisyContainer>
                  <TextInput
                    {...refCtrl.field}
                    {...refCtrl.fieldState}
                    required
                    label="Link your custom domain to an Aleph Message ID"
                    placeholder="Paste your IPFS Aleph Message ID"
                  />
                </NoisyContainer>
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
          </StyledSection>
        )}
      </Form>
    </Wrapper>
  )
}
NewDomainForm.displayName = 'NewDomainForm'

export default memo(NewDomainForm) as typeof NewDomainForm
