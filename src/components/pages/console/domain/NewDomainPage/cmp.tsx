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
import { CenteredContainer } from '@/components/common/CenteredContainer'
import ExternalLinkButton from '@/components/common/ExternalLinkButton'
import { NoisyContainer } from '@aleph-front/core'
import Form from '@/components/form/Form'
import { EntityDomainTypeName, EntityDomainType } from '@/helpers/constants'
import { useNewDomainPage } from './hook'
import { SectionTitle } from '@/components/common/CompositeTitle'
import BackButtonSection from '@/components/common/BackButtonSection'

export default function NewDomain() {
  const {
    entities,
    nameCtrl,
    targetCtrl,
    refCtrl,
    errors,
    handleSubmit,
    handleBack,
    setTarget,
    setRef,
  } = useNewDomainPage()

  const [tabId, setTabId] = useState('website')
  const labelResourceType =
    targetCtrl.field.value == EntityDomainType.Instance
      ? 'instance'
      : targetCtrl.field.value == EntityDomainType.Confidential
        ? 'confidential'
        : 'function'

  const onTabChange = (tabId: string) => {
    setRef('')
    setTabId(tabId)
    if (['website', 'ipfs'].includes(tabId)) {
      setTarget(EntityDomainType.IPFS)
    } else {
      setTarget(EntityDomainType.Program)
    }
  }

  return (
    <>
      <BackButtonSection handleBack={handleBack} />
      <Form onSubmit={handleSubmit} errors={errors}>
        <section tw="px-0 pt-20 pb-6 md:py-10">
          <CenteredContainer>
            <SectionTitle number="1">Custom domain</SectionTitle>
            <p tw="mb-6">
              Assign a user-friendly domain to your website, instance or
              function to not only simplify access to your web3 application but
              also enhance its professional appearance. This is an effective way
              to elevate user experience, establish brand identity or streamline
              the navigation process within your application.
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
          </CenteredContainer>
        </section>
        <section tw="px-0 pt-20 pb-6 md:py-10">
          <CenteredContainer>
            <SectionTitle number="2">Select Resource</SectionTitle>
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
                        href="/console/hosting/website/new"
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
          </CenteredContainer>
        </section>
      </Form>
    </>
  )
}
