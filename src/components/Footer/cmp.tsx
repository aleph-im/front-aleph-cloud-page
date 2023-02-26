import React from 'react'
import { Col, Icon, Logo, Row } from '@aleph-front/aleph-core'
import Container from '../Container'
import { StyledAnchor, StyledButton, StyledFooter, StyledIcon, StyledLogoContainer } from './styles'
import { FooterProps } from './types'

export const Footer = (props: FooterProps) => {
  return (
    <StyledFooter>
      <Container>
        <StyledLogoContainer>
          <Logo size={55} />
        </StyledLogoContainer>
        <nav className='m-0'>
          <Row count={4}>
            <Col>
              <StyledButton>Work with us</StyledButton>
              <StyledButton>Try our dApps</StyledButton>
              <StyledButton>Start a project</StyledButton>
            </Col>
            <Col>
              <StyledAnchor>Solutions</StyledAnchor>
              <StyledAnchor>Roadmap</StyledAnchor>
              <StyledAnchor>Indexing</StyledAnchor>
              <StyledAnchor>Demo&apos;s</StyledAnchor>
              <StyledAnchor>Team</StyledAnchor>
              <StyledAnchor>Developers</StyledAnchor>
            </Col>
            <Col>
              <StyledAnchor>Jobs</StyledAnchor>
              <StyledAnchor>Whitepaper</StyledAnchor>
              <StyledAnchor>Token</StyledAnchor>
            </Col>
            <Col>
              <StyledAnchor target="_blank" href='https://twitter.com/aleph_im'><StyledIcon name="twitter" />Twitter</StyledAnchor>
              <StyledAnchor target="_blank" href='https://t.me/alephim'><StyledIcon name="telegram" />Telegram</StyledAnchor>
              <StyledAnchor target="_blank" href='https://medium.com/aleph-im'><StyledIcon name="medium" />Medium</StyledAnchor>
            </Col>
          </Row>
        </nav>
      </Container>
    </StyledFooter>
  )
}

export default Footer
