import { EntityType } from '@/helpers/constants'
import { useNewWebsitePage } from '@/hooks/pages/hosting/useNewWebsitePage'
import { Button, TextGradient } from '@aleph-front/core'
import CheckoutSummary from '@/components/form/CheckoutSummary'
import Container from '@/components/common/CenteredContainer'
import { AddWebsiteFolder } from '@/components/form/AddWebsiteFolder'
import { Form } from '@/components/form/Form'
import { SectionTitle } from '@/components/common/CompositeTitle'
import AddNameAndTags from '@/components/form/AddNameAndTags'
import ToggleContainer from '@/components/common/ToggleContainer'
import AddDomains from '@/components/form/AddDomains'
import SelectWebsiteFramework from '@/components/form/SelectWebsiteFramework'
import { PageProps } from '@/types/types'

export default function NewWebsitePage({ mainRef }: PageProps) {
  const {
    control,
    values,
    address,
    accountBalance,
    isCreateButtonDisabled,
    errors,
    handleSubmit,
  } = useNewWebsitePage()

  return (
    <Form onSubmit={handleSubmit} errors={errors}>
      <section tw="px-0 pt-20 pb-6 md:py-10">
        <Container>
          <SectionTitle number="1">Choose your framework</SectionTitle>
          <p tw="mb-6">
            Select your web development framework. This step provides guidance
            to properly configure your dapp, before building your project
            locally.
          </p>
          <SelectWebsiteFramework control={control} />
        </Container>
      </section>
      <section tw="px-0 py-6 md:py-10">
        <Container>
          <SectionTitle number="2">Upload your app</SectionTitle>
          <p tw="mb-6">
            Once your website is ready, upload it here using a zip file. This
            step transitions your local project to our decentralized cloud,
            making it accessible online. Our platform ensures a straightforward
            process for you to launch and manage your website on a global scale.
          </p>
          <AddWebsiteFolder control={control} />
        </Container>
      </section>
      <section tw="px-0 py-6 md:py-10">
        <Container>
          <SectionTitle number="3">Name and tags</SectionTitle>
          <p tw="mb-6">
            Organize and identify your functions more effectively by assigning a
            unique name, obtaining a hash reference, and defining multiple tags.
            This helps streamline your development process and makes it easier
            to manage your web3 functions.
          </p>
          <AddNameAndTags control={control} entityType={EntityType.Website} />
        </Container>
      </section>

      <section tw="px-0 pt-20 pb-6 md:py-10">
        <Container>
          <SectionTitle number="4">Advanced Configuration Options</SectionTitle>
          <p tw="mb-6">
            Customize your instance with our Advanced Configuration Options. Add
            environment variables, and custom domains to meet your specific
            needs.
          </p>
          <div tw="px-0 my-6">
            <div tw="mb-4">
              <ToggleContainer label="Add Custom Domain">
                <TextGradient forwardedAs="h2" type="h6" color="main0">
                  Custom domain
                </TextGradient>
                <p tw="mb-6">
                  You have the ability to configure a domain name to access your
                  cloud instances. By setting up a user-friendly custom domain,
                  accessing your instances becomes easier and more intuitive.
                  It&s another way we&re making web3 cloud management as
                  straightforward as possible.
                </p>
                <AddDomains
                  name="domains"
                  control={control}
                  entityType={EntityType.Program}
                />
                <TextGradient
                  forwardedAs="h2"
                  type="h6"
                  color="main0"
                  tw="mt-10"
                >
                  ENS domain
                </TextGradient>
                <p tw="mb-6">Available soon.</p>
                {/* <p tw="mb-6">
                  No need to do anything at this stage. Link your ENS domain
                  after the upload.
                </p> */}
              </ToggleContainer>
            </div>
          </div>
        </Container>
      </section>

      <CheckoutSummary
        control={control}
        address={address}
        type={EntityType.Website}
        file={values.file}
        domains={values.domains}
        unlockedAmount={accountBalance}
        paymentMethod={values.paymentMethod}
        mainRef={mainRef}
        description={
          <>
            This amount needs to be present in your wallet until the website is
            removed. Tokens won &#39;t be locked nor consumed. The website will
            be garbage collected once funds are removed from the wallet.
          </>
        }
        button={
          <Button
            type="submit"
            color="main0"
            kind="default"
            size="lg"
            variant="primary"
            disabled={isCreateButtonDisabled}
            // @note: handleSubmit is needed on the floating footer to trigger form submit (transcluded to body)
            onClick={handleSubmit}
          >
            Create website
          </Button>
        }
      />
    </Form>
  )
}
