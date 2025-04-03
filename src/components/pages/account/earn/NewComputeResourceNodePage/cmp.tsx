import { memo } from 'react'
import Head from 'next/head'
import Form from '@/components/form/Form'
import {
  Button,
  CompositeTitle,
  NoisyContainer,
  TextInput,
} from '@aleph-front/core'
import { useNewComputeResourceNodePage } from './hook'
import ExternalLinkButton from '@/components/common/ExternalLinkButton'
import ButtonLink from '@/components/common/ButtonLink'

export const NewComputeResourceNodePage = () => {
  const { nameCtrl, addressCtrl, errors, handleSubmit } =
    useNewComputeResourceNodePage()

  return (
    <>
      <Head>
        <title>Aleph Cloud | Create CRN</title>
        <meta
          name="description"
          content="Aleph Cloud Create Compute Resource Node"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <section>
        <h1 className="tp-h5" tw="mb-8">
          Create compute resource node
        </h1>
      </section>
      <Form onSubmit={handleSubmit} errors={errors} tw="max-w-[44.6875rem]">
        <section tw="px-0 pb-6 md:pb-10">
          <CompositeTitle as="h2" number="1">
            Set a name
          </CompositeTitle>
          <p tw="mt-1 mb-6">Your node name should be short and meaningful.</p>
          <NoisyContainer>
            <TextInput
              {...nameCtrl.field}
              {...nameCtrl.fieldState}
              required
              label="Node name"
              placeholder="Give it a name"
            />
            <p tw="mt-4">
              You can change this later if you want, even add a picture and
              description.
            </p>
          </NoisyContainer>
        </section>
        <section tw="px-0 py-6 md:py-10">
          <CompositeTitle as="h2" number="2">
            Set address
          </CompositeTitle>
          <p tw="mt-1 mb-6">
            The physical node has a unique identifier address. It links the
            wallet and interface to the physical node. This address is mandatory
            to proceed and the install procedure below will explain how to
            retrieve this address.
          </p>
          <NoisyContainer>
            <TextInput
              {...addressCtrl.field}
              {...addressCtrl.fieldState}
              required
              label="Set address"
              placeholder="https://my-domain.tld/"
            />
            <div tw="mt-2">
              <ExternalLinkButton href="https://docs.aleph.im/nodes/compute/">
                How to install your node and retrieve your address
              </ExternalLinkButton>
            </div>
          </NoisyContainer>
        </section>
        <section tw="flex gap-10">
          <Button
            color="main0"
            kind="gradient"
            variant="primary"
            size="md"
            type="submit"
          >
            Register compute node
          </Button>
          <ButtonLink size="md" variant="textOnly" href="/account/earn/crn">
            Cancel
          </ButtonLink>
        </section>
      </Form>
    </>
  )
}
NewComputeResourceNodePage.displayName = 'NewComputeResourceNodePage'

export default memo(NewComputeResourceNodePage)
