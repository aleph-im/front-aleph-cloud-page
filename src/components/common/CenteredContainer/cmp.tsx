import { memo } from 'react'
import { Row, Col } from '@aleph-front/aleph-core'
import Container from '../Container'
import { CenteredContainerProps } from './types'

export const CenteredContainer = ({
  children,
  variant = 'default',
}: CenteredContainerProps) => {
  return (
    <>
      {variant === 'default' ? (
        <Row xs={12} gap="0">
          <Col
            {...{
              xs: 12,
              lg: 10,
              lgOffset: 2,
              xl: 8,
              xlOffset: 3,
              '2xl': 6,
              '2xlOffset': 4,
            }}
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
CenteredContainer.displayName = 'CenteredContainer'

export default memo(CenteredContainer) as typeof CenteredContainer
