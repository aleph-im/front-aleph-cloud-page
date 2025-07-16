import Head from 'next/head'
import { CenteredContainer } from '@/components/common/CenteredContainer'
import { NoisyContainer } from '@aleph-front/core'
import Form from '@/components/form/Form'
import { useNewSSHKeyPage } from './hook'
import { Button, TextArea, TextInput } from '@aleph-front/core'
import { SectionTitle } from '@/components/common/CompositeTitle'
import BackButtonSection from '@/components/common/BackButtonSection'

export default function NewSSHKey() {
  const { keyCtrl, labelCtrl, handleSubmit, handleBack, errors } =
    useNewSSHKeyPage()

  return (
    <>
      <Head>
        <title>Console | New SSH Key | Aleph Cloud</title>
        <meta
          name="description"
          content="Add a new SSH key for secure access to your Aleph Cloud instances"
        />
      </Head>
      <BackButtonSection handleBack={handleBack} />
      <Form onSubmit={handleSubmit} errors={errors}>
        <section tw="px-0 pt-20 pb-6 md:py-10">
          <CenteredContainer>
            <SectionTitle number="1">Configure SSH Key</SectionTitle>
            <p tw="mb-6">
              Access your cloud instances securely. Give existing key’s below
              access to this instance or add new keys. Remember, storing private
              keys safely is crucial for security. If you need help, our support
              team is always ready to assist.
            </p>
            <NoisyContainer>
              <div>
                <TextArea
                  {...keyCtrl.field}
                  {...keyCtrl.fieldState}
                  required
                  label="SSH Public Key"
                  placeholder="SSH Key"
                  tw="h-40 break-all"
                />
              </div>
              <div tw="mt-4">
                <TextInput
                  {...labelCtrl.field}
                  {...labelCtrl.fieldState}
                  label="Label"
                  placeholder="Label"
                />
              </div>
            </NoisyContainer>
            <div tw="mt-10 text-center">
              <Button
                type="submit"
                color="main0"
                kind="default"
                size="md"
                variant="primary"
              >
                Save SSH Key
              </Button>
            </div>
          </CenteredContainer>
        </section>
      </Form>
    </>
  )
}
