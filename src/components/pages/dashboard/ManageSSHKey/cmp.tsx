import ButtonLink from '@/components/common/ButtonLink'
import IconText from '@/components/common/IconText'
import { Label, NoisyContainer } from '@aleph-front/core'
import { EntityTypeName } from '@/helpers/constants'
import { Button, Icon, Tag } from '@aleph-front/core'
import { useManageSSHKey } from '@/hooks/pages/solutions/manage/useManageSSHKey'
import { ellipseAddress, ellipseText } from '@/helpers/utils'
import { Container, Text, Separator } from '../common'
import { RotatingLines } from 'react-loader-spinner'
import { useTheme } from 'styled-components'
import HoldTokenDisclaimer from '@/components/common/HoldTokenDisclaimer'
import BackButtonSection from '@/components/common/BackButtonSection'

export default function ManageSSHKey() {
  const { sshKey, handleCopyKey, handleCopyLabel, handleDelete, handleBack } =
    useManageSSHKey()

  const theme = useTheme()

  if (!sshKey) {
    return (
      <>
        <BackButtonSection handleBack={handleBack} />
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
      <BackButtonSection handleBack={handleBack} />
      <section tw="px-0 pt-20 pb-6 md:py-10">
        <Container>
          <div tw="flex justify-between pb-5">
            <div tw="flex items-center">
              <Icon name="key" tw="mr-4" className="text-main0" />
              <div className="tp-body2">{name}</div>
              <Label
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
              </Label>
            </div>
            <div>
              <Button
                kind="functional"
                variant="warning"
                size="md"
                onClick={handleDelete}
              >
                Delete
              </Button>
            </div>
          </div>

          <NoisyContainer>
            <div tw="flex items-center justify-start overflow-hidden">
              <Tag variant="accent" tw="mr-4 whitespace-nowrap">
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
                    <Text>{sshKey.label}</Text>
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
                    <Text>{ellipseText(sshKey.url, 80)}</Text>
                  </IconText>
                </a>
              </div>
            </div>

            <div tw="my-5">
              <div className="tp-info text-main0">CREATED ON</div>
              <div>
                <Text className="fs-10 tp-body1">{sshKey.date}</Text>
              </div>
            </div>
          </NoisyContainer>

          <div tw="mt-20 text-center">
            <ButtonLink variant="primary" href="/settings/ssh/new">
              Add new SSH Key
            </ButtonLink>
          </div>
        </Container>
        <Container>
          <HoldTokenDisclaimer />
        </Container>
      </section>
    </>
  )
}
