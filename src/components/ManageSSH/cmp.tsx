import styled from 'styled-components'
import tw from 'twin.macro'
import AutoBreadcrumb from '@/components/AutoBreadcrumb'
import ButtonLink from '@/components/ButtonLink'
import IconText from '@/components/IconText'
import NoisyContainer from '@/components/NoisyContainer'
import { breadcrumbNames } from '@/helpers/constants'
import { Button, Tag } from '@aleph-front/aleph-core'
import { useDashboardManageSSHKeyPage } from '@/hooks/pages/useDashboardManageSSHKeyPage'
import { ellipseText } from '@/helpers/utils'
import CenteredContainer from '@/components/CenteredContainer'

const Separator = styled.hr`
  ${tw`my-5`}
  border: 0;
  border-top: 1px solid #fff;
  opacity: 0.25;
`

// @todo: Refactor adding new text color in core?
const GrayText = styled.span`
  color: ${({ theme }) => theme.color.text}b3;
`

const Container = styled(CenteredContainer).attrs((props) => ({
  ...props,
  variant: 'dashboard',
}))``

export default function ManageSSH() {
  const { sshKey, handleCopyKey, handleCopyLabel, handleDelete } =
    useDashboardManageSSHKeyPage()

  if (!sshKey) {
    return (
      <>
        <Container>
          <NoisyContainer>Loading...</NoisyContainer>
        </Container>
      </>
    )
  }

  return (
    <>
      <AutoBreadcrumb
        names={breadcrumbNames}
        name={sshKey.label?.toUpperCase()}
      />
      <section tw="px-0 pt-20 pb-6 md:py-10">
        <Container>
          <div tw="flex justify-end pb-5">
            <div>
              <Button
                size="regular"
                variant="tertiary"
                color="main2"
                kind="neon"
                onClick={handleDelete}
              >
                Delete
              </Button>
            </div>
          </div>

          <NoisyContainer>
            <div tw="flex items-center justify-start overflow-hidden">
              <Tag className="tp-body2 fs-sm" tw="mr-4 whitespace-nowrap">
                SSH Key
              </Tag>
              <div tw="flex-auto">
                <div className="tp-info text-main0">KEY</div>
                <IconText iconName="copy" onClick={handleCopyKey}>
                  {sshKey.key}
                </IconText>
              </div>
            </div>

            <Separator />

            {sshKey.label && (
              <div tw="my-5">
                <div className="tp-info text-main0">LABEL</div>
                <div>
                  <IconText iconName="copy" onClick={handleCopyLabel}>
                    <GrayText>{sshKey.label}</GrayText>
                  </IconText>
                </div>
              </div>
            )}

            <div tw="my-5">
              <div className="tp-info text-main0">ALEPH MESSAGE</div>
              <div>
                <a
                  className="tp-body1 fs-sm"
                  href={sshKey.url}
                  target="_blank"
                  referrerPolicy="no-referrer"
                >
                  <IconText iconName="square-up-right">
                    <GrayText>{ellipseText(sshKey.url, 80)}</GrayText>
                  </IconText>
                </a>
              </div>
            </div>

            <div tw="my-5">
              <div className="tp-info text-main0">CREATED ON</div>
              <div>
                <GrayText className="fs-xs tp-body1">{sshKey.date}</GrayText>
              </div>
            </div>
          </NoisyContainer>

          <div tw="mt-20 text-center">
            <ButtonLink variant="primary" href="/dashboard/ssh">
              Add new SSH Key
            </ButtonLink>
          </div>

          <p tw="my-24 text-center">
            Acquire aleph.im tokens for versatile access to resources within a
            defined duration. These tokens remain in your wallet without being
            locked or consumed, providing you with flexibility in utilizing
            aleph.im&apos;s infrastructure. If you choose to remove the tokens
            from your wallet, the allocated resources will be efficiently
            reclaimed. Feel free to use or hold the tokens according to your
            needs, even when not actively using Aleph.im&apos;s resources.
          </p>
        </Container>
      </section>
    </>
  )
}
