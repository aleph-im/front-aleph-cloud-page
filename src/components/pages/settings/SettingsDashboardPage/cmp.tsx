import React from 'react'
import { NoisyContainer, Tabs, TextGradient } from '@aleph-front/core'
import Container from '@/components/common/CenteredContainer'
import CardWithSideImage from '@/components/common/CardWithSideImage'
import ExternalLinkButton from '@/components/common/ExternalLinkButton'
import ButtonLink from '@/components/common/ButtonLink'
import { useSettingsDashboardPage } from '@/hooks/pages/settings/useSettingsDashboardPage'
import SSHKeysTabContent from '../../dashboard/SSHKeysTabContent'
import DomainsTabContent from '../../dashboard/DomainsTabContent'
import HoldTokenDisclaimer from '@/components/common/HoldTokenDisclaimer'

export default function SettingsDashboardPage() {
  const { tabs, tabId, setTabId, domains, sshKeys } = useSettingsDashboardPage()

  return (
    <>
      <Container $variant="xl" tw="my-10">
        <Tabs selected={tabId} tabs={tabs} onTabChange={setTabId} />
      </Container>
      <div role="tabpanel">
        {tabId === 'ssh' ? (
          <>
            {!!sshKeys.length && (
              <Container $variant="xl" tw="my-10">
                <SSHKeysTabContent data={sshKeys} />
              </Container>
            )}
            <NoisyContainer type="grain-1" tw="py-20">
              <Container $variant="xl">
                <CardWithSideImage
                  imageSrc="/img/dashboard/ssh.svg"
                  imageAlt="SSH Key illustration"
                  imagePosition="left"
                  cardBackgroundColor="bg-white"
                  reverseColumnsWhenStacked={false}
                >
                  <div>
                    <div className="tp-info text-main0">WHAT IS A...</div>
                    <TextGradient as="h2" type="h3">
                      SSH Key?
                    </TextGradient>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Cras rutrum dignissim elit, ut maximus justo congue at.
                    Nulla lobortis, ligula in tempus tincidunt, eros nulla
                    congue sapien, ac aliquet mi ante non elit. 
                  </div>
                  <div tw="mt-6 flex items-center justify-between">
                    {!sshKeys.length && (
                      <ButtonLink
                        variant="primary"
                        size="md"
                        href="/settings/ssh/new"
                      >
                        Create new SSH key
                      </ButtonLink>
                    )}
                    <ExternalLinkButton href="#">Learn more</ExternalLinkButton>
                  </div>
                </CardWithSideImage>
              </Container>
            </NoisyContainer>
          </>
        ) : tabId === 'domain' ? (
          <>
            {!!domains.length && (
              <Container $variant="xl" tw="my-10">
                <DomainsTabContent data={domains} />
              </Container>
            )}
            <NoisyContainer type="grain-1" tw="py-20">
              <Container $variant="xl">
                <CardWithSideImage
                  imageSrc="/img/dashboard/ssh.svg"
                  imageAlt="Domain illustration"
                  imagePosition="left"
                  cardBackgroundColor="bg-white"
                  reverseColumnsWhenStacked={false}
                >
                  <div>
                    <div className="tp-info text-main0">WHAT IS A...</div>
                    <TextGradient as="h2" type="h3">
                      Domain?
                    </TextGradient>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Cras rutrum dignissim elit, ut maximus justo congue at.
                    Nulla lobortis, ligula in tempus tincidunt, eros nulla
                    congue sapien, ac aliquet mi ante non elit. 
                  </div>
                  <div tw="mt-6 flex items-center justify-between">
                    {!domains.length && (
                      <ButtonLink
                        variant="primary"
                        size="md"
                        href="/settings/domain/new"
                      >
                        Create new domain
                      </ButtonLink>
                    )}
                    <ExternalLinkButton href="#">Learn more</ExternalLinkButton>
                  </div>
                </CardWithSideImage>
              </Container>
            </NoisyContainer>
          </>
        ) : (
          <></>
        )}
      </div>
      <Container $variant="xl">
        <HoldTokenDisclaimer />
      </Container>
    </>
  )
}
