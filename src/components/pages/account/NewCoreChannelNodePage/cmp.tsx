import { memo } from 'react'
import Head from 'next/head'
import Form from '@/components/form/Form'
import {
  Button,
  CompositeTitle,
  NoisyContainer,
  TextGradient,
  TextInput,
} from '@aleph-front/core'
import { useNewCoreChannelNodePage } from './hook'
import ExternalLinkButton from '@/components/common/ExternalLinkButton'
import ButtonLink from '@/components/common/ButtonLink'
import { CenteredContainer } from '@/components/common/CenteredContainer'

export const NewCoreChannelNodePage = () => {
  const { nameCtrl, multiaddressCtrl, errors, handleSubmit } =
    useNewCoreChannelNodePage()

  return (
    <>
      <Head>
        <title>Aleph Cloud | Create CCN</title>
        <meta
          name="description"
          content="Aleph Cloud Create Core Channel Node"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <CenteredContainer $variant="xl">
        <section>
          <TextGradient type="h5" forwardedAs="h1" tw="mb-8">
            Create core node
          </TextGradient>
          <Form onSubmit={handleSubmit} errors={errors} tw="max-w-[44.6875rem]">
            <section tw="px-0 pb-6 md:pb-10">
              <CompositeTitle as="h2" number="1" color="main0">
                Set a name
              </CompositeTitle>
              <p tw="mt-1 mb-6">
                Your node name should be short and meaningful.
              </p>
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
              <CompositeTitle as="h2" number="2" color="main0">
                Set multiaddress
              </CompositeTitle>
              <p tw="mt-1 mb-6">
                The physical node has unique identifier called multiaddress. It
                links the physical node with the interface. Can be setup later
                on the info page of the node or here if the physical node is
                running. The link below explains in detail the install procedure
                and how to retrieve the multiaddress.
              </p>
              <NoisyContainer>
                <TextInput
                  {...multiaddressCtrl.field}
                  {...multiaddressCtrl.fieldState}
                  required
                  label="Set multiaddress"
                  placeholder="/ip4/{ip-address}/tcp/4025/p2p/SmlS3hb..."
                />
                <div tw="mt-2">
                  <ExternalLinkButton href="https://docs.aleph.im/nodes/core/">
                    How to create a node
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
                Create core node
              </Button>
              <ButtonLink size="md" variant="textOnly" href="/account/earn/ccn">
                Cancel
              </ButtonLink>
            </section>
          </Form>
        </section>
      </CenteredContainer>
    </>
  )
}
NewCoreChannelNodePage.displayName = 'NewCoreChannelNodePage'

export default memo(NewCoreChannelNodePage)
