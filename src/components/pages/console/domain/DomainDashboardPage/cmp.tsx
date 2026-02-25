import React from 'react'
import Head from 'next/head'
import { CenteredContainer } from '@/components/common/CenteredContainer'
import { useDomainDashboardPage } from './hook'
import DomainsTabContent from '../DomainsTabContent'
import HoldTokenDisclaimer from '@/components/common/HoldTokenDisclaimer'
import DashboardCardWithSideImage from '@/components/common/DashboardCardWithSideImage'
import { NAVIGATION_URLS } from '@/helpers/constants'

export default function DomainDashboardPage() {
  const { domains } = useDomainDashboardPage()

  return (
    <>
      <Head>
        <title>Console | Domains | Aleph Cloud</title>
        <meta
          name="description"
          content="Manage your custom domains on Aleph Cloud"
        />
      </Head>
      {!!domains.length && (
        <CenteredContainer $variant="xl" tw="my-10">
          <DomainsTabContent data={domains} />
        </CenteredContainer>
      )}
      <DashboardCardWithSideImage
        info="WHAT ARE..."
        title="Custom domains"
        description="Link your custom domains effortlessly to functions, instances, volumes, or websites. Simplify your web3 hosting experience with streamlined domain management."
        imageSrc="/img/dashboard/domain.svg"
        imageAlt="Domain illustration"
        withButton={domains.length === 0}
        buttonUrl={NAVIGATION_URLS.console.domain.new}
        buttonText="Create custom domain"
        externalLinkUrl={NAVIGATION_URLS.docs.customDomains}
      />
      <CenteredContainer $variant="xl">
        <HoldTokenDisclaimer />
      </CenteredContainer>
    </>
  )
}
