import { EntityType, PaymentMethod } from '@/helpers/constants'
import { useNewIndexerPage } from '@/hooks/pages/tools/useNewIndexerPage'
import { Button } from '@aleph-front/core'
import HoldingRequirements from '@/components/form/HoldingRequirements'
import Container from '@/components/common/CenteredContainer'
import { AddIndexerBlockchainNetworks } from '@/components/form/AddIndexerBlockchainNetworks'
import { Form } from '@/components/form/Form'
import AddIndexerTokenAccounts from '@/components/form/AddIndexerTokenAccounts'
import AddNameAndTags from '@/components/form/AddNameAndTags'
import { SectionTitle } from '@/components/common/CompositeTitle'

export default function NewIndexerPage() {
  const {
    control,
    values,
    address,
    accountBalance,
    isCreateButtonDisabled,
    errors,
    holdingRequirementsProps,
    handleSubmit,
  } = useNewIndexerPage()

  return (
    <Form onSubmit={handleSubmit} errors={errors}>
      <section tw="px-0 pt-20 pb-6 md:py-10">
        <Container>
          <SectionTitle number="1">Define Your Blockchain Network</SectionTitle>
          <p tw="mb-6">
            Specify the blockchain network where you aim to attach accounts. You
            can index unique accounts tailored to each environment. This
            flexible approach allows for nuanced tracking across multiple
            networks, whether on a main net or testnet. Please provide the
            necessary details including the network&apos;s ID, RPC URL, and
            blockchain type.
          </p>
          <AddIndexerBlockchainNetworks name="networks" control={control} />
        </Container>
      </section>
      <section tw="px-0 pt-20 pb-6 md:py-10">
        <Container>
          <SectionTitle number="2">Configure Your Token Account</SectionTitle>
          <p tw="mb-6">
            Define the core parameters associated with the token, like the
            contract address, deployer&apos;s details, and initial supply. This
            foundational data assists in bootstrapping the state of your token,
            guaranteeing precise and consistent tracking over time. Ensure you
            detail the blockchain type, token&apos;s contract address, deployer
            address, initial supply, and token decimal places.
          </p>
          <AddIndexerTokenAccounts
            name="accounts"
            control={control}
            networks={values.networks}
          />
        </Container>
      </section>
      <section tw="px-0 pt-20 pb-6 md:py-10">
        <Container>
          <SectionTitle number="3">Name and tags</SectionTitle>
          <p tw="mb-6">
            Organize and identify your indexers more effectively by assigning a
            unique name, obtaining a hash reference, and defining multiple tags.
            This helps streamline your development process and makes it easier
            to manage your web3 indexers.
          </p>
          <AddNameAndTags control={control} entityType={EntityType.Indexer} />
        </Container>
      </section>
      <HoldingRequirements
        address={address}
        type={EntityType.Program}
        unlockedAmount={accountBalance}
        paymentMethod={PaymentMethod.Hold}
        {...holdingRequirementsProps}
        description={
          <>
            This amount needs to be present in your wallet until the indexer is
            removed. Tokens won&apos;t be locked nor consumed. The indexer will
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
          >
            Create indexer
          </Button>
        }
      />
    </Form>
  )
}
