import { Row, Col } from '@aleph-front/aleph-core'
import Container from '../Container'
import { CenteredContainerProps } from './types'

export default function CenteredContainer({
  children,
  variant = 'default',
}: CenteredContainerProps) {
  return (
    <>
      {variant === 'default' ? (
        <Row xs={12} gap="0">
          <Col
            xs={12}
            lg={10}
            lgOffset={2}
            xl={8}
            xlOffset={3}
            xxl={6}
            xxlOffset={4}
          >
            <Container>
              <div tw="max-w-[715px] mx-auto">{children}</div>
            </Container>
          </Col>
        </Row>
      ) : (
        <Row xs={12} gap="0">
          <Col xs={12} xl={8} xlOffset={3}>
            <Container>
              <div tw="max-w-[961px] mx-auto">{children}</div>
            </Container>
          </Col>
        </Row>
      )}
    </>
  )
}
