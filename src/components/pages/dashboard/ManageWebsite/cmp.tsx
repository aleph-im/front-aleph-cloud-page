import Link from 'next/link'
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
import { humanReadableSize } from '@/helpers/utils'
import { Container, Text, Separator } from '../common'
import { RotatingLines } from 'react-loader-spinner'
import { useTheme } from 'styled-components'
import { WebsiteFrameworks } from '@/domain/website'
import { getDate, cidV0Tov1 } from '@/helpers/utils'
import UpdateWebsiteFolder from '@/components/form/UpdateWebsiteFolder'
import { useNewWebsitePage } from '@/hooks/pages/hosting/useNewWebsitePage'
import { useEffect } from 'react'

export default function ManageWebsite() {
  const {
    website,
    refVolume,
    historyVolumes,
    handleCopyHash,
    handleDelete,
    handleUpdate,
  } = useManageWebsite()
  const [, copyAndNotify] = useCopyToClipboardAndNotify()
  const cidV1 = refVolume?.item_hash && cidV0Tov1(refVolume.item_hash)
  const default_url = `https://${cidV1}.ipfs.aleph.sh`
  /* const alt_url = `https://${cidV1}.ipfs.storry.tv`
  const alt_url_2 = `https://${cidV1}.ipfs.cf-ipfs.com`
  const alt_url_3 = `https://${cidV1}.ipfs.dweb.link` */
  const theme = useTheme()
  const state = useNewWebsitePage()
  const cid = state.values.website?.cid

  useEffect(() => {
    if (cid) {
      handleUpdate(cid as string)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cid])

  if (!website || !cidV1) {
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
            <div tw="flex flex-wrap justify-end ml-2 gap-2 sm:gap-4">
              <UpdateWebsiteFolder control={state.control} />
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
            <div tw="flex flex-wrap justify-between gap-2">
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
                    {humanReadableSize(refVolume?.size, 'MiB')}
                  </Text>
                </div>
              </div>
              <div>
                <div className="tp-info text-main0">CREATED ON</div>
                <div>
                  <Text className="fs-10 tp-body1">
                    {getDate(website.created_at)}
                  </Text>
                </div>
              </div>
              <div>
                <div className="tp-info text-main0">UPDATED ON</div>
                <div>
                  <Text className="fs-10 tp-body1">{website.updated_at}</Text>
                </div>
              </div>
            </div>

            <div tw="my-5">
              <div className="tp-info text-main0">DEFAULT GATEWAY</div>
              <div tw="flex flex-row">
                <a
                  className="tp-body1 fs-16"
                  href={default_url}
                  target="_blank"
                  referrerPolicy="no-referrer"
                >
                  <IconText iconName="square-up-right">
                    <Text>{default_url}</Text>
                  </IconText>
                </a>
                <IconText
                  iconName="copy"
                  onClick={() => copyAndNotify(default_url)}
                />
              </div>
            </div>
            <div tw="mb-5">
              <a
                className="tp-body1 fs-16"
                href={'https://ipfs.github.io/public-gateway-checker/'}
                target="_blank"
                referrerPolicy="no-referrer"
              >
                <IconText iconName="square-up-right">
                  <div className="tp-info text-main0">ALTERNATIVE GATEWAYS</div>
                </IconText>
              </a>
              <Text tw="break-words">
                {`https://${cidV1}.ipfs.`}
                <Text tw="text-purple-500">{'<gateway-hostname>'}</Text>
              </Text>
            </div>

            <div tw="mb-5">
              <a
                className="tp-body1 fs-16"
                href={'https://app.ens.domains/'}
                target="_blank"
                referrerPolicy="no-referrer"
              >
                <IconText iconName="square-up-right">
                  <div className="tp-info text-main0">ENS GATEWAYS</div>
                </IconText>
              </a>
              {website.ens && website.ens.length > 0 ? (
                Array.from(website.ens).map((ens, key) => {
                  const limo = `https://${ens}.limo`
                  return (
                    <div tw="flex flex-row" key={key}>
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
                <div tw="flex flex-col">
                  <Text>
                    Access your ENS and setup the content hash to this current
                    version:
                  </Text>
                  <IconText
                    iconName="copy"
                    onClick={() => copyAndNotify(`ipfs://${cidV1}` ?? '')}
                  >
                    <span tw="ml-2 not-italic text-purple-700">
                      ipfs://{cidV1}
                    </span>
                  </IconText>
                  <Text tw="mt-1">
                    Then, your website will be accessible via:
                    <span tw="ml-2 not-italic text-purple-700">
                      {'https://'}
                      <span tw="text-purple-500">{'<your-ens-name>'}</span>
                      {'.eth.limo'}
                    </span>
                  </Text>
                </div>
              )}
            </div>

            <Separator />
            <TextGradient type="h7" as="h2" color="main0">
              Current Version
            </TextGradient>
            <div tw="my-5">
              <div className="tp-info text-main0">{`Version ${website.version}`}</div>
              <Link
                className="tp-body1 fs-16"
                href={`/storage/volume/${refVolume?.id}`}
              >
                <IconText iconName="square-up-right">Volume details</IconText>
              </Link>
            </div>
            <div tw="mb-5">
              <div className="tp-info text-main0">ITEM HASH</div>
              <IconText
                iconName="copy"
                onClick={() => copyAndNotify(refVolume?.id ?? '')}
              >
                {refVolume?.id}
              </IconText>
            </div>
            <div className="tp-info text-main0">IPFS CID v0</div>
            <div tw="flex flex-row mb-5">
              <IconText
                iconName="copy"
                onClick={() => copyAndNotify(refVolume.item_hash)}
              >
                {refVolume.item_hash}
              </IconText>
            </div>
            <div className="tp-info text-main0">IPFS CID v1</div>
            <div tw="flex flex-row mb-5">
              <IconText
                iconName="copy"
                onClick={() => copyAndNotify(cidV1 ?? '')}
              >
                {cidV1}
              </IconText>
            </div>

            <Separator />
            <TextGradient type="h7" as="h2" color="main0">
              Previous Versions
            </TextGradient>
            {historyVolumes && Object.keys(historyVolumes).length > 0 ? (
              <>
                {Object.entries(historyVolumes)
                  .sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
                  .map(([version, volume]) => {
                    const legacy_link = `https://${cidV0Tov1(volume.item_hash)}.ipfs.aleph.sh`
                    return (
                      <div tw="my-5" key={`version-${version}`}>
                        <Separator />
                        <div tw="my-5 flex flex-wrap gap-4 justify-between">
                          <div>
                            <div className="tp-info text-main0">{`Version ${version}`}</div>
                            <Link
                              className="tp-body1 fs-16"
                              href={`/storage/volume/${volume.id}`}
                            >
                              <IconText iconName="square-up-right">
                                Volume details
                              </IconText>
                            </Link>
                          </div>
                          <div>
                            <div className="tp-info text-main0">CREATED ON</div>
                            <div>
                              <Text className="fs-10 tp-body1">
                                {volume.date}
                              </Text>
                            </div>
                          </div>
                          <div />
                          <div />
                          <Button
                            kind="functional"
                            variant="warning"
                            size="md"
                            onClick={() => handleUpdate(undefined, version)}
                          >
                            Redeploy
                          </Button>
                        </div>
                        <div className="tp-info text-main0">LEGACY GATEWAY</div>
                        <div tw="flex flex-row mb-5">
                          <a
                            className="tp-body1 fs-16"
                            href={legacy_link}
                            target="_blank"
                            referrerPolicy="no-referrer"
                          >
                            <IconText iconName="square-up-right">
                              <Text>{legacy_link}</Text>
                            </IconText>
                          </a>
                          <IconText
                            iconName="copy"
                            onClick={() => copyAndNotify(legacy_link)}
                          />
                        </div>
                      </div>
                    )
                  })}
              </>
            ) : (
              <Text>No previous version</Text>
            )}
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
