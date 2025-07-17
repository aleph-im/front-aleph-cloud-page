import ButtonLink from '@/components/common/ButtonLink'
import IconText from '@/components/common/IconText'
import Head from 'next/head'
import { Label, NoisyContainer } from '@aleph-front/core'
import { EntityTypeName } from '@/helpers/constants'
import { Icon, Tag, TextGradient } from '@aleph-front/core'
import { convertByteUnits, ellipseAddress, ellipseText } from '@/helpers/utils'
import { RotatingLines, ThreeDots } from 'react-loader-spinner'
import Link from 'next/link'
import BackButtonSection from '@/components/common/BackButtonSection'
import { useManageConfidential } from './hook'
import { Text, Separator } from '../../common'
import { CenteredContainer } from '@/components/common/CenteredContainer'
import VolumeList from '../../volume/VolumeList'

export default function ManageConfidential() {
  const {
    authorized,
    theme,
    confidential,
    status,
    mappedKeys,
    nodeDetails,
    handleCopyHash,
    handleCopyConnect,
    handleCopyIpv6,
    handleBack,
  } = useManageConfidential()

  if (!authorized) return

  if (!confidential) {
    return (
      <>
        <BackButtonSection handleBack={handleBack} />
        <CenteredContainer>
          <NoisyContainer tw="my-4">Loading...</NoisyContainer>
        </CenteredContainer>
      </>
    )
  }

  const name =
    (confidential?.metadata?.name as string) || ellipseAddress(confidential.id)
  const typeName = EntityTypeName[confidential.type]
  const volumes = confidential.volumes

  return (
    <>
      <Head>
        <title>Console | Manage Confidential | Aleph Cloud</title>
        <meta
          name="description"
          content="Manage your confidential instance on Aleph Cloud"
        />
      </Head>
      <BackButtonSection handleBack={handleBack} />
      <section tw="px-0 pt-20 pb-6 md:py-10">
        <CenteredContainer>
          <div tw="flex justify-between pb-5 flex-wrap gap-4 flex-col md:flex-row">
            <div tw="flex items-center">
              <Icon name="alien-8bit" tw="mr-4" className="text-main0" />
              <div className="tp-body2">{name}</div>
              <Label
                kind="secondary"
                variant={
                  confidential.time < Date.now() - 1000 * 45 &&
                  status?.ipv6Parsed
                    ? 'success'
                    : 'warning'
                }
                tw="ml-4"
              >
                {status?.ipv6Parsed ? (
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
          </div>

          <NoisyContainer>
            <div tw="flex items-center justify-start overflow-hidden">
              <Tag variant="accent" tw="mr-4 whitespace-nowrap">
                {typeName}
              </Tag>
              <div tw="flex-auto">
                <div className="tp-info text-main0">ITEM HASH</div>
                <IconText iconName="copy" onClick={handleCopyHash}>
                  {confidential.id}
                </IconText>
              </div>
            </div>

            <Separator />

            <div tw="flex my-5">
              <div tw="mr-5">
                <div className="tp-info text-main0">CORES</div>
                <div>
                  <Text>{confidential.resources.vcpus} x86 64bit</Text>
                </div>
              </div>

              <div tw="mr-5">
                <div className="tp-info text-main0">RAM</div>
                <div>
                  <Text>
                    {convertByteUnits(confidential.resources.memory, {
                      from: 'MiB',
                      to: 'GiB',
                      displayUnit: true,
                    })}
                  </Text>
                </div>
              </div>

              <div tw="mr-5">
                <div className="tp-info text-main0">HDD</div>
                <div>
                  <Text>
                    {convertByteUnits(confidential.size, {
                      from: 'MiB',
                      to: 'GiB',
                      displayUnit: true,
                    })}
                  </Text>
                </div>
              </div>
            </div>

            <div tw="mr-5">
              <div className="tp-info text-main0">EXPLORER</div>
              <div>
                <a
                  className="tp-body1 fs-16"
                  href={confidential.url}
                  target="_blank"
                  referrerPolicy="no-referrer"
                >
                  <IconText iconName="square-up-right">
                    <Text>{ellipseText(confidential.url, 80)}</Text>
                  </IconText>
                </a>
              </div>
            </div>

            <Separator />

            <div tw="my-5">
              <TextGradient type="h7" as="h2" color="main0">
                Connection methods
              </TextGradient>

              <div tw="my-5">
                <div className="tp-info text-main0">SSH COMMAND</div>
                <div>
                  {status ? (
                    <IconText iconName="copy" onClick={handleCopyConnect}>
                      <Text>&gt;_ ssh root@{status.ipv6Parsed}</Text>
                    </IconText>
                  ) : (
                    <div tw="flex items-end">
                      <span tw="mr-1" className="tp-body1 fs-16 text-main2">
                        Allocating
                      </span>
                      <ThreeDots
                        width=".8rem"
                        height="1rem"
                        color={theme.color.main2}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div tw="my-5">
                <div className="tp-info text-main0">IPv6</div>
                <div>
                  {status && (
                    <IconText iconName="copy" onClick={handleCopyIpv6}>
                      <Text>{status.ipv6Parsed}</Text>
                    </IconText>
                  )}
                </div>
              </div>
            </div>

            <div tw="my-5">
              <TextGradient type="h7" as="h2" color="main0">
                Accessible for
              </TextGradient>

              <div tw="my-5 flex">
                {mappedKeys.map(
                  (key, i) =>
                    key && (
                      <div key={key?.id} tw="mr-5">
                        <div className="tp-info text-main0">
                          SSH KEY #{i + 1}
                        </div>

                        <Link
                          className="tp-body1 fs-16"
                          href={'?hash=' + key.id}
                          referrerPolicy="no-referrer"
                        >
                          <IconText iconName="square-up-right">
                            <Text>{key.label}</Text>
                          </IconText>
                        </Link>
                      </div>
                    ),
                )}
              </div>
            </div>

            {nodeDetails && (
              <>
                <Separator />

                <TextGradient type="h7" as="h2" color="main0">
                  Current CRN
                </TextGradient>

                <div tw="my-5">
                  <div className="tp-info text-main0">NAME</div>
                  <div>
                    <Text>{nodeDetails.name}</Text>
                  </div>
                </div>

                <div tw="my-5">
                  <div className="tp-info text-main0">URL</div>
                  <div>
                    <a
                      className="tp-body1 fs-16"
                      href={nodeDetails.url}
                      target="_blank"
                      referrerPolicy="no-referrer"
                    >
                      <IconText iconName="square-up-right">
                        <Text>{ellipseText(nodeDetails.url, 80)}</Text>
                      </IconText>
                    </a>
                  </div>
                </div>
              </>
            )}

            {volumes.length > 0 && (
              <>
                <Separator />

                <TextGradient type="h7" as="h2" color="main0">
                  Linked Storage(s)
                </TextGradient>

                <VolumeList {...{ volumes }} />
              </>
            )}
          </NoisyContainer>

          <div tw="mt-20 text-center">
            <ButtonLink
              variant="primary"
              href="https://docs.aleph.im/computing/confidential/"
              target="_blank"
            >
              Create new confidential instance
            </ButtonLink>
          </div>
        </CenteredContainer>
      </section>
    </>
  )
}
