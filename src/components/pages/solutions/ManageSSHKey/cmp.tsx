import ButtonLink from '@/components/common/ButtonLink'
import IconText from '@/components/common/IconText'
import { NoisyContainer } from '@aleph-front/core'
import { EntityTypeName } from '@/helpers/constants'
import { Button, Icon, Tag } from '@aleph-front/core'
import { useManageSSHKey } from '@/hooks/pages/solutions/manage/useManageSSHKey'
import { ellipseAddress, ellipseText } from '@/helpers/utils'
import { Container, GrayText, Separator } from '../common'
import StatusLabel from '@/components/common/StatusLabel'
import { RotatingLines } from 'react-loader-spinner'
import { useTheme } from 'styled-components'

export default function ManageSSHKey() {
  const { sshKey, handleCopyKey, handleCopyLabel, handleDelete } =
    useManageSSHKey()

  const theme = useTheme()

  if (!sshKey) {
    return (
      <>
        <Container>
          <NoisyContainer tw="my-4">Loading...</NoisyContainer>
        </Container>
      </>
    )
  }

  const name = sshKey.label || ellipseAddress(sshKey.id)
  const typeName = EntityTypeName[sshKey.type]

  return (
    <>
      <section tw="px-0 pt-20 pb-6 md:py-10">
        <Container>
          <div tw="flex justify-between pb-5">
            <div tw="flex items-center">
              <Icon name="key" tw="mr-4" className="text-main1" />
              <div className="tp-body2">{name}</div>
              <StatusLabel
                variant={sshKey.confirmed ? 'success' : 'warning'}
                tw="ml-4"
              >
                {sshKey.confirmed ? (
                  'READY'
                ) : (
                  <div tw="flex items-center">
                    <div tw="mr-2">CONFIRMING</div>
                    <RotatingLines
                      strokeColor={theme.color.base2}
                      width=".8rem"
                    />
                  </div>
                )}
              </StatusLabel>
            </div>
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
              <Tag className="tp-body2 fs-16" tw="mr-4 whitespace-nowrap">
                {typeName}
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
              <div className="tp-info text-main0">EXPLORER</div>
              <div>
                <a
                  className="tp-body1 fs-16"
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
                <GrayText className="fs-10 tp-body1">{sshKey.date}</GrayText>
              </div>
            </div>
          </NoisyContainer>

          <div tw="mt-20 text-center">
            <ButtonLink variant="primary" href="/configure/ssh/new">
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
