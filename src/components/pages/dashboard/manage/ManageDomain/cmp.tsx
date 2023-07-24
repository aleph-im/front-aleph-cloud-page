import AutoBreadcrumb from '@/components/common/AutoBreadcrumb'
import IconText from '@/components/common/IconText'
import NoisyContainer from '@/components/common/NoisyContainer'
import { EntityTypeName, breadcrumbNames } from '@/helpers/constants'
import {
  BulletItem,
  Button,
  Icon,
  Tag,
  TextGradient,
} from '@aleph-front/aleph-core'
import { useManageDomain } from '@/hooks/pages/dashboard/manage/useManageDomain'
import { ellipseAddress, ellipseText } from '@/helpers/utils'
import { Container, GrayText, Separator } from '../common'
import StatusLabel from '@/components/common/StatusLabel'
import ButtonLink from '@/components/common/ButtonLink'

export default function ManageDomain() {
  const { domain, status, refEntity, account, handleDelete, handleCopyRef } =
    useManageDomain()

  if (!domain) {
    return (
      <>
        <Container>
          <NoisyContainer tw="my-4">Loading...</NoisyContainer>
        </Container>
      </>
    )
  }

  const name = domain.name || ellipseAddress(domain.id)
  const typeName = EntityTypeName[domain.type]

  return (
    <>
      <AutoBreadcrumb names={breadcrumbNames} name={name.toUpperCase()} />
      <section tw="px-0 pt-20 pb-6 md:py-10">
        <Container>
          <div tw="flex justify-between pb-5">
            <div tw="flex items-center">
              <Icon name="input-text" tw="mr-4" className="text-main1" />
              <div className="tp-body2">{name}</div>
              <StatusLabel
                variant={domain.confirmed ? 'ready' : 'confirming'}
                tw="ml-4"
              />
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
              <Tag className="tp-body2 fs-sm" tw="mr-4 whitespace-nowrap">
                {typeName}
              </Tag>
              <div tw="flex-auto">
                <div className="tp-info text-main0">NAME</div>
                <div>
                  <a
                    className="tp-body1 fs-sm"
                    href={`https://${domain.name}`}
                    target="_blank"
                    referrerPolicy="no-referrer"
                  >
                    <IconText iconName="square-up-right">
                      <GrayText>{domain.name}</GrayText>
                    </IconText>
                  </a>
                </div>
              </div>
            </div>

            <Separator />

            {domain.target && (
              <div tw="my-5">
                <div className="tp-info text-main0">TARGET</div>
                <div>
                  <GrayText>{domain.target}</GrayText>
                </div>
              </div>
            )}

            <div tw="my-5">
              <div className="tp-info text-main0">REF</div>
              <div>
                <IconText iconName="copy" onClick={handleCopyRef}>
                  <GrayText>{domain.ref}</GrayText>
                </IconText>
              </div>
            </div>

            {status && (
              <>
                <Separator />

                <TextGradient type="h6" color="main1">
                  Status
                </TextGradient>

                <div tw="my-5">
                  <div className="tp-info text-main0">STATUS</div>
                  <GrayText>
                    <div tw="flex mt-2">
                      <BulletItem
                        kind={status.status ? 'success' : 'warning'}
                        title={''}
                      />
                      {status.status
                        ? 'Properly configured'
                        : 'Manual configuration is required'}
                    </div>
                  </GrayText>
                </div>

                {(!status.tasks_status.cname ||
                  !status.tasks_status.owner_proof) && (
                  <>
                    <div tw="my-5">
                      <div className="tp-info text-main0">PENDING STEPS</div>
                      <GrayText>
                        <div tw="flex mt-2">
                          <BulletItem
                            kind={
                              status.tasks_status.cname ? 'success' : 'warning'
                            }
                            title={''}
                          />
                          <div>
                            Create a CNAME record
                            <span className="text-main0" tw="mx-2">
                              {domain.name}
                            </span>
                            with value
                            <span className="text-main0" tw="mx-2">
                              program.public.aleph.sh.
                            </span>
                          </div>
                        </div>
                      </GrayText>
                      <GrayText>
                        <div tw="flex mt-2">
                          <BulletItem
                            kind={
                              status.tasks_status.owner_proof
                                ? 'success'
                                : 'warning'
                            }
                            title={''}
                          />
                          <div>
                            Create a TXT owner proof record
                            <span className="text-main0" tw="mx-2">
                              _control.{domain.name}
                            </span>
                            with value
                            <span className="text-main0" tw="mx-2">
                              {account?.address}
                            </span>
                          </div>
                        </div>
                      </GrayText>
                    </div>

                    <div tw="my-5">
                      <div className="tp-info text-main0">ERROR</div>
                      <GrayText>{status.err}</GrayText>
                    </div>

                    <div tw="my-5">
                      <div className="tp-info text-main0">TIPS</div>
                      <GrayText>{status.help}</GrayText>
                    </div>
                  </>
                )}
              </>
            )}

            {refEntity && (
              <>
                <Separator />

                <TextGradient type="h6" color="main1">
                  Linked {domain.target}
                </TextGradient>

                <div tw="my-5">
                  <div className="tp-info text-main0">Type</div>
                  <div>
                    <GrayText>{EntityTypeName[refEntity.type]}</GrayText>
                  </div>
                </div>

                <div tw="my-5">
                  <div className="tp-info text-main0">NAME</div>
                  <div>
                    <GrayText>
                      {(refEntity?.metadata?.name as string) ||
                        ellipseAddress(refEntity.id)}
                    </GrayText>
                  </div>
                </div>

                <div tw="my-5">
                  <div className="tp-info text-main0">EXPLORER</div>
                  <div>
                    <a
                      className="tp-body1 fs-sm"
                      href={refEntity.url}
                      target="_blank"
                      referrerPolicy="no-referrer"
                    >
                      <IconText iconName="square-up-right">
                        <GrayText>{ellipseText(refEntity.url, 80)}</GrayText>
                      </IconText>
                    </a>
                  </div>
                </div>
              </>
            )}
          </NoisyContainer>

          <div tw="mt-20 text-center">
            <ButtonLink variant="primary" href="/dashboard/domain">
              Add new domain
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
