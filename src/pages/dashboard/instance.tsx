import { ReactNode, useCallback } from 'react'
import { Col, Row, Tabs } from '@aleph-front/aleph-core'
import CompositeTitle from '@/components/CompositeTitle'
import { useNewInstancePage } from '@/hooks/pages/useNewInstancePage'
import BaseContainer from '@/components/Container'
import ExternalLinkButton from '@/components/ExternalLinkButton/cmp'
import RuntimeSelector from '@/components/RuntimeSelector/cmp'
import { Runtime } from '@/hooks/useRuntimeSelector'

const Container = ({ children }: { children: ReactNode }) => (
  <Row xs={1} lg={12} gap="0">
    <Col xs={1} lg={10} lgOffset={2} xl={8} xlOffset={3} xxl={6} xxlOffset={4}>
      <BaseContainer>
        <div tw="max-w-[715px] mx-auto">{children}</div>
      </BaseContainer>
    </Col>
  </Row>
)

export default function NewInstancePage() {
  const { formState, handleSubmit, setFormValue, handleChangeEntityTab } =
    useNewInstancePage()

  const handleChangeRuntime = useCallback(
    (image: Runtime) => {
      setFormValue('runtime', image.id)
    },
    [setFormValue],
  )

  return (
    <>
      <form onSubmit={handleSubmit}>
        <section tw="px-0 py-0 md:py-8">
          <Container>
            <Tabs
              selected="instance"
              onTabChange={handleChangeEntityTab}
              tabs={[
                {
                  id: 'function',
                  name: 'Function',
                },
                {
                  id: 'instance',
                  name: 'Instance',
                },
                {
                  id: 'confidential',
                  name: 'Confidential',
                  disabled: true,
                  label: 'SOON',
                  labelPosition: 'top',
                },
              ]}
              tw="overflow-auto"
            />
          </Container>
        </section>
        <section>
          <pre>{JSON.stringify(formState, null, 2)}</pre>
        </section>
        <section tw="px-0 pt-20 pb-6 md:py-10">
          <Container>
            <CompositeTitle as="h2" number="1">
              Choose an image
            </CompositeTitle>
            <p>
              Chose a base image for your VM. It’s the base system that you will
              be able to customize.
            </p>
            <div tw="px-0 mt-12 mb-6">
              <RuntimeSelector onChange={handleChangeRuntime} />
            </div>
            <div tw="mt-6 text-right">
              <ExternalLinkButton href="https://docs.aleph.im/computing/runtimes">
                Learn more
              </ExternalLinkButton>
            </div>
          </Container>
        </section>
      </form>
    </>
  )
}
