import React from 'react'
import { Col, Logo, Row } from '@aleph-front/aleph-core'
import Container from '../Container'
import { StyledLink, StyledButton, StyledFooter, StyledIcon, StyledIcon2 } from './styles'
import { FooterProps } from './types'

export const Footer = ({ small = false }: FooterProps) => {
  return (
    <StyledFooter>
      <Container>
        {small ? (
          <Row xs={1} md={2} lg={3} gap="1.5rem">
            <Col xs={1} md={2} lg={1}>
              <div tw='flex items-center lg:justify-start'>
                <Logo size={28} />
              </div>
            </Col>
            <Col>
              <ul tw='flex items-center lg:justify-center'>
                <li tw='mr-6'><StyledLink target="_blank" href="https://docs.aleph.im/">Documentation<StyledIcon2 name='external-link-square-alt' /></StyledLink></li>
                <li tw='mr-0'><StyledLink target="_blank" href="https://t.me/alephim">Telegram Developers<StyledIcon2 name='external-link-square-alt' /></StyledLink></li>
              </ul>
            </Col>
            <Col>
              <ul tw='flex items-center md:justify-end'>
                <li tw='mr-6'><StyledLink target="_blank" href='https://twitter.com/aleph_im'><StyledIcon name="twitter" />Twitter</StyledLink></li>
                <li tw='mr-0'><StyledLink target="_blank" href='https://medium.com/aleph-im'><StyledIcon name="medium" />Medium</StyledLink></li>
              </ul>
            </Col>
          </Row>
        ) : (
          <>
            <div tw='mb-12'>
              <Logo size={55} />
            </div>
            <nav tw='m-0'>
              <Row xs={1} md={2} lg={4} xsGap="3rem" mdGap="1.5rem">
                <Col>
                  <StyledButton>Work with us</StyledButton>
                  <StyledButton>Try our dApps</StyledButton>
                  <StyledButton>Start a project</StyledButton>
                </Col>
                <Col>
                  <ul>
                    <li tw="mb-6"><StyledLink>Solutions</StyledLink></li>
                    <li tw="mb-6"><StyledLink>Roadmap</StyledLink></li>
                    <li tw="mb-6"><StyledLink>Indexing</StyledLink></li>
                    <li tw="mb-6"><StyledLink>Demo&apos;s</StyledLink></li>
                    <li tw="mb-6"><StyledLink>Team</StyledLink></li>
                    <li tw="mb-0"><StyledLink>Developers</StyledLink></li>
                  </ul>
                </Col>
                <Col>
                  <ul>
                    <li tw="mb-6"><StyledLink>Jobs</StyledLink></li>
                    <li tw="mb-6"><StyledLink>Whitepaper</StyledLink></li>
                    <li tw="mb-0"><StyledLink>Token</StyledLink></li>
                  </ul>
                </Col>
                <Col>
                  <ul>
                    <li tw="mb-6"><StyledLink target="_blank" href='https://twitter.com/aleph_im'><StyledIcon name="twitter" />Twitter</StyledLink></li>
                    <li tw="mb-6"><StyledLink target="_blank" href='https://t.me/alephim'><StyledIcon name="telegram" />Telegram</StyledLink></li>
                    <li tw="mb-0"><StyledLink target="_blank" href='https://medium.com/aleph-im'><StyledIcon name="medium" />Medium</StyledLink></li>
                  </ul>
                </Col>
              </Row>
            </nav>
          </>
        )}
      </Container>
    </StyledFooter>
  )
}

export default Footer
