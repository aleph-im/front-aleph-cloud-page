import {
  EntityType,
  EntityDomainType,
  PaymentMethod,
} from '@/helpers/constants'
import { useNewWebsitePage } from '@/hooks/pages/hosting/useNewWebsitePage'
import { Button, Icon, TextGradient } from '@aleph-front/core'
import CheckoutSummary from '@/components/form/CheckoutSummary'
import Container from '@/components/common/CenteredContainer'
import AddWebsiteFolder from '@/components/form/AddWebsiteFolder'
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
    handleBack,
  } = useNewWebsitePage()

  return (
    <>
      <section tw="px-0 py-0! md:pt-10!">
        <Container>
          <Button kind="functional" variant="textOnly" onClick={handleBack}>
            <p
              className="tp-info text-base2"
              tw="flex items-center justify-center text-center gap-1"
            >
              <Icon name="arrow-left" /> Back
            </p>
          </Button>
        </Container>
      </section>
      <Form onSubmit={handleSubmit} errors={errors}>
        <section tw="px-0 pt-20 pb-6 md:py-10">
          <Container>
            <SectionTitle number="1">Choose your framework</SectionTitle>
            <p tw="mb-6">
              Select your web development framework. This step provides guidance
              to properly configure your dapp, before building your project
              locally. At the moment, if you have a backend, you need to deploy
              it as a function or inside an instance, and then to integrate it
              in your website beforehand.
            </p>
            <SelectWebsiteFramework control={control} />
          </Container>
        </section>
        <section tw="px-0 py-6 md:py-10">
          <Container>
            <SectionTitle number="2">Upload your website</SectionTitle>
            <p tw="mb-6">
              Once your website is ready, upload your static folder here. This
              step transitions your local project to our decentralized cloud,
              making it accessible online. Our platform ensures a
              straightforward process for you to launch and manage your website
              on a global scale.
            </p>
            <AddWebsiteFolder control={control} />
          </Container>
        </section>
        <section tw="px-0 py-6 md:py-10">
          <Container>
            <SectionTitle number="3">Name and tags</SectionTitle>
            <p tw="mb-6">
              Organize and identify your websites more effectively by assigning
              a unique name, obtaining a hash reference, and defining multiple
              tags. This helps streamline your development process and makes it
              easier to manage your dapps.
            </p>
            <AddNameAndTags control={control} entityType={EntityType.Website} />
          </Container>
        </section>

        <section tw="px-0 pt-20 pb-6 md:py-10">
          <Container>
            <SectionTitle number="4">
              Advanced Configuration Options
            </SectionTitle>
            <p tw="mb-6">
              Customize your website with our Advanced Configuration Options.
              Add custom domains or ENS domains to meet your specific needs.
            </p>
            <div tw="px-0 my-6">
              <div tw="mb-4">
                <ToggleContainer label="Add Custom Domain">
                  <TextGradient forwardedAs="h2" type="h6" color="main0">
                    Custom domain
                  </TextGradient>
                  <p tw="mb-6">
                    Configure an user-friendly domain name for your website,
                    providing a more accessible and professional way for users
                    to interact with your dapp.
                  </p>
                  <AddDomains
                    name="domains"
                    control={control}
                    entityType={EntityDomainType.IPFS}
                  />
                  <TextGradient
                    forwardedAs="h2"
                    type="h6"
                    color="main0"
                    tw="mt-10"
                  >
                    ENS domain
                  </TextGradient>
                  <p tw="mb-6">
                    No need to do anything at this stage. You will be able to
                    link your ENS domains after deployment.
                  </p>
                </ToggleContainer>
              </div>
            </div>
          </Container>
        </section>

        <CheckoutSummary
          control={control}
          address={address}
          type={EntityType.Website}
          website={values.website}
          domains={values.domains}
          unlockedAmount={accountBalance}
          paymentMethod={PaymentMethod.Hold}
          mainRef={mainRef}
          description={
            <>
              This amount needs to be present in your wallet until the website
              is removed. Tokens won&#39;t be locked nor consumed. The website
              will be garbage collected once funds are removed from the wallet.
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
    </>
  )
}
