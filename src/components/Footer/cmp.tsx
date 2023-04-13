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
              <div className='d-flex items-center justify-start-lg'>
                <Logo size={28} />
              </div>
            </Col>
            <Col>
              <ul className='d-flex items-center justify-center-lg'>
                <li className='mr-lg'><StyledLink>Documentation<StyledIcon2 name='external-link-square-alt' /></StyledLink></li>
                <li className='mr-0'><StyledLink>Telegram Developers<StyledIcon2 name='external-link-square-alt' /></StyledLink></li>
              </ul>
            </Col>
            <Col>
              <ul className='d-flex items-center justify-end-md'>
                <li className='mr-lg'><StyledLink target="_blank" href='https://twitter.com/aleph_im'><StyledIcon name="twitter" />Twitter</StyledLink></li>
                <li className='mr-0'><StyledLink target="_blank" href='https://medium.com/aleph-im'><StyledIcon name="medium" />Medium</StyledLink></li>
              </ul>
            </Col>
          </Row>
        ) : (
          <>
            <div className='mb-xxl'>
              <Logo size={55} />
            </div>
            <nav className='m-0'>
              <Row xs={1} md={2} lg={4} xsGap="3rem" mdGap="1.5rem">
                <Col>
                  <StyledButton>Work with us</StyledButton>
                  <StyledButton>Try our dApps</StyledButton>
                  <StyledButton>Start a project</StyledButton>
                </Col>
                <Col>
                  <ul>
                    <li className="mb-lg"><StyledLink>Solutions</StyledLink></li>
                    <li className="mb-lg"><StyledLink>Roadmap</StyledLink></li>
                    <li className="mb-lg"><StyledLink>Indexing</StyledLink></li>
                    <li className="mb-lg"><StyledLink>Demo&apos;s</StyledLink></li>
                    <li className="mb-lg"><StyledLink>Team</StyledLink></li>
                    <li className="mb-0"><StyledLink>Developers</StyledLink></li>
                  </ul>
                </Col>
                <Col>
                  <ul>
                    <li className="mb-lg"><StyledLink>Jobs</StyledLink></li>
                    <li className="mb-lg"><StyledLink>Whitepaper</StyledLink></li>
                    <li className="mb-0"><StyledLink>Token</StyledLink></li>
                  </ul>
                </Col>
                <Col>
                  <ul>
                    <li className="mb-lg"><StyledLink target="_blank" href='https://twitter.com/aleph_im'><StyledIcon name="twitter" />Twitter</StyledLink></li>
                    <li className="mb-lg"><StyledLink target="_blank" href='https://t.me/alephim'><StyledIcon name="telegram" />Telegram</StyledLink></li>
                    <li className="mb-0"><StyledLink target="_blank" href='https://medium.com/aleph-im'><StyledIcon name="medium" />Medium</StyledLink></li>
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
