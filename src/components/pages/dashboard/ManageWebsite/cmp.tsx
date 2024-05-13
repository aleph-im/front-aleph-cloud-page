import ButtonLink from '@/components/common/ButtonLink'
import IconText from '@/components/common/IconText'
import {
  Label,
  NoisyContainer,
  Button,
  Icon,
  Tag,
  TextGradient,
} from '@aleph-front/core'
import { EntityTypeName } from '@/helpers/constants'
import { useManageWebsite } from '@/hooks/pages/solutions/manage/useManageWebsite'
import { useCopyToClipboardAndNotify } from '@/hooks/common/useCopyToClipboard'
import { ellipseText, humanReadableSize } from '@/helpers/utils'
import { Container, Text, Separator } from '../common'
import { RotatingLines } from 'react-loader-spinner'
import { useTheme } from 'styled-components'
import { WebsiteFrameworks } from '@/domain/website'
import { cidV0Tov1 } from '@/helpers/utils'

const getLimoUrl = (ens: string) => {
  return `https://${ens}.limo`
}

export default function ManageWebsite() {
  const { website, handleCopyHash, handleDelete } = useManageWebsite()
  const [, copyAndNotify] = useCopyToClipboardAndNotify()
  const cidV1 =
    website?.volume?.item_hash && cidV0Tov1(website.volume.item_hash)
  const default_url = `https://${cidV1}.ipfs.aleph.cloud`
  const alt_url = `https://${cidV1}.ipfs.storry.tv`
  const alt_url_2 = `https://${cidV1}.ipfs.cf-ipfs.com`
  const alt_url_3 = `https://${cidV1}.ipfs.dweb.link`
  const theme = useTheme()

  if (!website) {
    return (
      <>
        <Container>
          <NoisyContainer tw="my-4">Loading...</NoisyContainer>
        </Container>
      </>
    )
  }

  return (
    <>
      <section tw="px-0 pt-20 pb-6 md:py-10">
        <Container>
          <div tw="flex justify-between pb-5">
            <div tw="flex items-center">
              <Icon name="floppy-disk" tw="mr-4" className="text-main0" />
              <div className="tp-body2">{website.metadata.name}</div>
              <Label
                kind="secondary"
                variant={website.confirmed ? 'success' : 'warning'}
                tw="ml-4"
              >
                {website.confirmed ? (
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
                size="md"
                variant="tertiary"
                color="main0"
                kind="default"
                tw="!mr-4"
                forwardedAs="a"
                //onClick={handleUpdate}
                disabled
              >
                Update
              </Button>
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
                {EntityTypeName[website.type]}
              </Tag>
              <div tw="flex-auto">
                <div className="tp-info text-main0">NAME</div>
                <IconText iconName="copy" onClick={handleCopyHash}>
                  {website.id}
                </IconText>
              </div>
            </div>

            <Separator />
            <div tw="flex flex-row justify-between">
              <div>
                <div className="tp-info text-main0">FRAMEWORK</div>
                <div>
                  <Text>
                    {WebsiteFrameworks[website.metadata.framework].name}
                  </Text>
                </div>
              </div>
              <div>
                <div className="tp-info text-main0">VERSION</div>
                <div>
                  <Text>{website.version}</Text>
                </div>
              </div>
              <div>
                <div className="tp-info text-main0">SIZE</div>
                <div>
                  <Text className="fs-10 tp-body1">
                    {humanReadableSize(website.volume?.size, 'MiB')}
                  </Text>
                </div>
              </div>
              <div>
                <div className="tp-info text-main0">CREATED ON</div>
                <div>
                  <Text className="fs-10 tp-body1">{website.created_at}</Text>
                </div>
              </div>
              <div>
                <div className="tp-info text-main0">UPDATED ON</div>
                <div>
                  <Text className="fs-10 tp-body1">{website.updated_at}</Text>
                </div>
              </div>
            </div>
            <Separator />
            <div className="tp-info text-main0">DEFAULT GATEWAY</div>
            <div tw="flex flex-row mb-5">
              <a
                className="tp-body1 fs-16"
                //href={default_url}
                //target="_blank"
                //referrerPolicy="no-referrer"
              >
                <IconText iconName="square-up-right">
                  <Text tw="text-gray-500">{default_url}</Text>
                </IconText>
              </a>
              <IconText
                iconName="copy"
                onClick={() => copyAndNotify(default_url)}
              />
            </div>
            <div className="tp-info text-main0">ALTERNATIVE GATEWAYS</div>
            <div tw="mb-5">
              <div tw="flex flex-row">
                <a
                  className="tp-body1 fs-16"
                  href={alt_url}
                  target="_blank"
                  referrerPolicy="no-referrer"
                >
                  <IconText iconName="square-up-right">
                    <Text>{alt_url}</Text>
                  </IconText>
                </a>
                <IconText
                  iconName="copy"
                  onClick={() => copyAndNotify(alt_url)}
                />
              </div>
              <div tw="flex flex-row">
                <a
                  className="tp-body1 fs-16"
                  href={alt_url_2}
                  target="_blank"
                  referrerPolicy="no-referrer"
                >
                  <IconText iconName="square-up-right">
                    <Text>{alt_url_2}</Text>
                  </IconText>
                </a>
                <IconText
                  iconName="copy"
                  onClick={() => copyAndNotify(alt_url_2)}
                />
              </div>
              <div tw="flex flex-row">
                <a
                  className="tp-body1 fs-16"
                  href={alt_url_3}
                  target="_blank"
                  referrerPolicy="no-referrer"
                >
                  <IconText iconName="square-up-right">
                    <Text>{alt_url_3}</Text>
                  </IconText>
                </a>
                <IconText
                  iconName="copy"
                  onClick={() => copyAndNotify(alt_url_3)}
                />
              </div>
            </div>
            <div className="tp-info text-main0">ENS GATEWAY</div>
            {website.ens?.length > 0 ? (
              Array.from(website.ens).map((ens) => {
                const limo = getLimoUrl(ens)
                return (
                  <div tw="flex flex-row">
                    <a
                      className="tp-body1 fs-16"
                      href={limo}
                      target="_blank"
                      referrerPolicy="no-referrer"
                    >
                      <IconText iconName="square-up-right">
                        <Text>{limo}</Text>
                      </IconText>
                    </a>
                    <IconText
                      iconName="copy"
                      onClick={() => copyAndNotify(limo)}
                    />
                  </div>
                )
              })
            ) : (
              <span tw="my-5">{'-'}</span>
            )}
            <Separator />
            <TextGradient type="h7" as="h2" color="main0">
              Linked IPFS Storage
            </TextGradient>
            <div tw="my-5">
              <div className="tp-info text-main0">ITEM HASH</div>
              <IconText
                iconName="copy"
                onClick={() => copyAndNotify(website.volume?.id ?? '')}
              >
                {website.volume?.id}
              </IconText>
            </div>
            <div className="tp-info text-main0">EXPLORER</div>
            <div tw="flex flex-row mb-5">
              <a
                className="tp-body1 fs-16"
                href={website.volume?.url}
                target="_blank"
                referrerPolicy="no-referrer"
              >
                <IconText iconName="square-up-right">
                  <Text>{ellipseText(website.volume?.url ?? '', 80)}</Text>
                </IconText>
              </a>
              '
              <IconText
                iconName="copy"
                onClick={() => copyAndNotify(website.volume?.id ?? '')}
              ></IconText>
              '
            </div>
            <div className="tp-info text-main0">CONTENT ID V0</div>
            <div tw="flex flex-row mb-5">
              <Text>{website.volume?.item_hash}</Text>
              <IconText
                iconName="copy"
                onClick={() => copyAndNotify(website.volume?.id ?? '')}
              ></IconText>
            </div>
            <div className="tp-info text-main0">CONTENT ID V1</div>
            <div tw="flex flex-row mb-5">
              <Text>{cidV1}</Text>
              <IconText
                iconName="copy"
                onClick={() => copyAndNotify(website.volume?.id ?? '')}
              ></IconText>
            </div>
          </NoisyContainer>

          <div tw="mt-20 text-center">
            <ButtonLink variant="primary" href="/hosting/website/new">
              Create new website
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  )
}
