import React from 'react'
import { Col, Logo, Row } from '@aleph-front/aleph-core'
import Container from '../Container'
import { StyledLink, StyledButton, StyledFooter, StyledIcon, StyledLogoContainer } from './styles'
import { FooterProps } from './types'

export const Footer = (props: FooterProps) => {
  return (
    <StyledFooter>
      <Container>
        <StyledLogoContainer>
          <Logo size={55} />
        </StyledLogoContainer>
        <nav className='m-0'>
          <Row xs={1} md={4} xsGap="3rem" mdGap="1.5rem">
            <Col>
              <StyledButton>Work with us</StyledButton>
              <StyledButton>Try our dApps</StyledButton>
              <StyledButton>Start a project</StyledButton>
            </Col>
            <Col>
              <StyledLink>Solutions</StyledLink>
              <StyledLink>Roadmap</StyledLink>
              <StyledLink>Indexing</StyledLink>
              <StyledLink>Demo&apos;s</StyledLink>
              <StyledLink>Team</StyledLink>
              <StyledLink>Developers</StyledLink>
            </Col>
            <Col>
              <StyledLink>Jobs</StyledLink>
              <StyledLink>Whitepaper</StyledLink>
              <StyledLink>Token</StyledLink>
            </Col>
            <Col>
              <StyledLink target="_blank" href='https://twitter.com/aleph_im'><StyledIcon name="twitter" />Twitter</StyledLink>
              <StyledLink target="_blank" href='https://t.me/alephim'><StyledIcon name="telegram" />Telegram</StyledLink>
              <StyledLink target="_blank" href='https://medium.com/aleph-im'><StyledIcon name="medium" />Medium</StyledLink>
            </Col>
          </Row>
        </nav>
      </Container>
    </StyledFooter>
  )
}

export default Footer
