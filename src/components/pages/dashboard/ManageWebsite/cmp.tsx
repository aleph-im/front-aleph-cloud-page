import { memo } from 'react'
import Link from 'next/link'
import {
  Label,
  NoisyContainer,
  Button,
  Icon,
  Tag,
  TextGradient,
  useCopyToClipboardAndNotify,
} from '@aleph-front/core'
import { EntityTypeName } from '@/helpers/constants'
import { useManageWebsite } from '@/hooks/pages/solutions/manage/useManageWebsite'
import { humanReadableSize } from '@/helpers/utils'
import { Container, Text, Separator } from '../common'
import { RotatingLines } from 'react-loader-spinner'
import { WebsiteFrameworks } from '@/domain/website'
import { getDate, cidV0Tov1 } from '@/helpers/utils'
import UpdateWebsiteFolder from '@/components/form/UpdateWebsiteFolder'
import { Volume } from '@/domain/volume'
import ButtonLink from '@/components/common/ButtonLink'
import IconText from '@/components/common/IconText'
import BackButtonSection from '@/components/common/BackButtonSection'

export type WebsiteVolumeProps = {
  version: string
  volume: Volume
  onClick: () => void
}

export function WebsiteVolume({
  version,
  volume,
  onClick,
}: WebsiteVolumeProps) {
  const legacy_link = `https://${cidV0Tov1(volume.item_hash)}.ipfs.aleph.sh`
  const handleCopyLegacyUrl = useCopyToClipboardAndNotify(legacy_link)

  return (
    <div tw="my-5">
      <Separator />
      <div tw="my-5 flex flex-wrap gap-4 justify-between">
        <div>
          <div className="tp-info text-main0">{`Version ${version}`}</div>
          <Link
            className="tp-body1 fs-16"
            href={`/storage/volume/${volume.id}`}
          >
            <IconText iconName="square-up-right">Volume details</IconText>
          </Link>
        </div>
        <div>
          <div className="tp-info text-main0">CREATED ON</div>
          <div>
            <Text className="fs-10 tp-body1">{volume.date}</Text>
          </div>
        </div>
        <div />
        <div />
        <Button kind="functional" variant="warning" size="md" onClick={onClick}>
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
        <IconText iconName="copy" onClick={handleCopyLegacyUrl} />
      </div>
    </div>
  )
}
WebsiteVolume.displayName = 'WebsiteVolume'

// -------------

export type WebsiteENSProps = {
  ens: string
}

export function WebsiteENS({ ens }: WebsiteENSProps) {
  const limo = `https://${ens}.limo`
  const handleCopyLimo = useCopyToClipboardAndNotify(limo)

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
      <IconText iconName="copy" onClick={handleCopyLimo} />
    </div>
  )
}
WebsiteENS.displayName = 'WebsiteENS'

// -------------

export function ManageWebsite() {
  const {
    cidV1,
    defaultUrl,
    website,
    refVolume,
    historyVolumes,
    theme,
    state,
    handleDelete,
    handleUpdate,
    handleCopyCIDv0,
    handleCopyCIDv1,
    handleCopyHash,
    handleCopyIpfsUrl,
    handleCopyUrl,
    handleCopyVolumeHash,
    handleBack,
  } = useManageWebsite()

  if (!website || !cidV1) {
    return (
      <>
        <BackButtonSection handleBack={handleBack} />
        <Container>
          <NoisyContainer tw="my-4">Loading...</NoisyContainer>
        </Container>
      </>
    )
  }

  return (
    <>
      <BackButtonSection handleBack={handleBack} />
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
              <Button
                kind="functional"
                variant="error"
                size="md"
                onClick={handleDelete}
              >
                <Icon name="trash" />
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
                  href={defaultUrl}
                  target="_blank"
                  referrerPolicy="no-referrer"
                >
                  <IconText iconName="square-up-right">
                    <Text>{defaultUrl}</Text>
                  </IconText>
                </a>
                <IconText iconName="copy" onClick={handleCopyUrl} />
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
                Array.from(website.ens).map((ens, key) => (
                  <WebsiteENSMemo key={key} {...{ ens }} />
                ))
              ) : (
                <div tw="flex flex-col">
                  <Text>
                    Access your ENS and setup the content hash to this current
                    version:
                  </Text>
                  <IconText iconName="copy" onClick={handleCopyIpfsUrl}>
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
              <IconText iconName="copy" onClick={handleCopyVolumeHash}>
                {refVolume?.id}
              </IconText>
            </div>
            <div className="tp-info text-main0">IPFS CID v0</div>
            <div tw="flex flex-row mb-5">
              <IconText iconName="copy" onClick={handleCopyCIDv0}>
                {refVolume?.item_hash}
              </IconText>
            </div>
            <div className="tp-info text-main0">IPFS CID v1</div>
            <div tw="flex flex-row mb-5">
              <IconText iconName="copy" onClick={handleCopyCIDv1}>
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
                  .sort(([a], [b]) => parseInt(b) - parseInt(a))
                  .map(([version, volume]) => (
                    <WebsiteVolumeMemo
                      key={`${volume.id}-v${version}`}
                      {...{
                        version,
                        volume,
                        onClick: () => handleUpdate(undefined, version),
                      }}
                    />
                  ))}
              </>
            ) : (
              <Text>No previous version</Text>
            )}

            <Separator />
            <TextGradient type="h7" as="h2" color="main0">
              Update your website
            </TextGradient>
            <UpdateWebsiteFolder control={state.control} />
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
ManageWebsite.displayName = 'ManageWebsite'

export const WebsiteVolumeMemo = memo(WebsiteVolume)
export const WebsiteENSMemo = memo(WebsiteENS)
export default memo(ManageWebsite)
