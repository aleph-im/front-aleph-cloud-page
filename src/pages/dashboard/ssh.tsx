import BaseContainer from '@/components/Container'
import NoisyContainer from '@/components/NoisyContainer'
import { useNewSSHKeyPage } from '@/hooks/pages/useNewSSHKeyPage'
import { Button, Col, Row, TextArea, TextInput } from '@aleph-front/aleph-core'
import { ChangeEvent, useCallback } from 'react'
import { ReactNode } from 'react'

const Container = ({ children }: { children: ReactNode }) => (
  <Row xs={1} lg={12} gap="0">
    <Col xs={1} lg={10} lgOffset={2} xl={8} xlOffset={3} xxl={6} xxlOffset={4}>
      <BaseContainer>
        <div tw="max-w-[715px] mx-auto">{children}</div>
      </BaseContainer>
    </Col>
  </Row>
)

export default function NewSSHKey() {
  const { key, label, setKey, setLabel, handleSubmit } = useNewSSHKeyPage()

  const handleKeyChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => setKey(e.target.value),
    [setKey],
  )

  const handleLabelChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setLabel(e.target.value),
    [setLabel],
  )

  return (
    <>
      <form onSubmit={handleSubmit}>
        <section tw="px-0 pt-20 pb-6 md:py-10">
          <Container>
            <NoisyContainer>
              <div tw="mt-4">
                <TextArea
                  label="SSH Public Key"
                  value={key}
                  onChange={handleKeyChange}
                  name="ssh_key"
                  placeholder="SSH Key"
                  tw="h-40 break-all"
                />
              </div>
              <div tw="mt-4">
                <TextInput
                  label="Label"
                  value={label}
                  onChange={handleLabelChange}
                  name="ssh_label"
                  placeholder="Label"
                />
              </div>
            </NoisyContainer>
            <div tw="mt-10 text-center">
              <Button
                type="submit"
                color="main0"
                kind="neon"
                size="regular"
                variant="primary"
              >
                Save SSH Key
              </Button>
            </div>
          </Container>
        </section>
      </form>
    </>
  )
}