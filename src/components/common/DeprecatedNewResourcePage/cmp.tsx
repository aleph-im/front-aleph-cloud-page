import { memo } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Button, TextGradient } from '@aleph-front/core'
import 'twin.macro'
import { CenteredContainer } from '@/components/common/CenteredContainer'
import BorderBox from '@/components/common/BorderBox'
import ExternalLinkButton from '@/components/common/ExternalLinkButton'
import { DeprecatedNewResourcePageProps } from './types'

export const DeprecatedNewResourcePage = ({
  resourceName,
  creditConsoleUrl,
  listUrl,
}: DeprecatedNewResourcePageProps) => {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>Console | {resourceName} Moved | Aleph Cloud</title>
        <meta
          name="description"
          content={`Creating new ${resourceName.toLowerCase()}s has moved to the Credits console`}
        />
      </Head>
      <section tw="px-0 py-0 md:py-8">
        <CenteredContainer>
          <div tw="flex flex-col items-center justify-center py-20">
            <TextGradient type="h5" color="main0" tw="mb-6 text-center">
              {resourceName} Creation Has Moved
            </TextGradient>
            <BorderBox $color="warning" tw="max-w-2xl mb-10">
              <p className="tp-body1 fs-16 text-base2" tw="text-center">
                Creating new {resourceName.toLowerCase()}s is now available
                exclusively in the new Credits console.
              </p>
            </BorderBox>
            <div tw="flex flex-wrap gap-4 justify-center">
              <Button
                variant="secondary"
                size="md"
                onClick={() => router.push(listUrl)}
              >
                Manage Existing {resourceName}s
              </Button>
              <ExternalLinkButton
                href={creditConsoleUrl}
                variant="primary"
                size="md"
              >
                Create {resourceName}
              </ExternalLinkButton>
            </div>
          </div>
        </CenteredContainer>
      </section>
    </>
  )
}
DeprecatedNewResourcePage.displayName = 'DeprecatedNewResourcePage'

export default memo(DeprecatedNewResourcePage)
