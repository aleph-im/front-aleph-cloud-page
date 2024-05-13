import IconText from '@/components/common/IconText'
import { Label, NoisyContainer } from '@aleph-front/core'
import {
  EntityType,
  EntityTypeName,
  EntityDomainType,
  EntityDomainTypeName,
} from '@/helpers/constants'
import { BulletItem, Button, Icon, Tag, TextGradient } from '@aleph-front/core'
import { useManageDomain } from '@/hooks/pages/solutions/manage/useManageDomain'
import { ellipseAddress, ellipseText, toPascalCase } from '@/helpers/utils'
import { Container, Text, Separator } from '../common'
import ButtonLink from '@/components/common/ButtonLink'

export default function ManageDomain() {
  const {
    domain,
    status,
    refEntity,
    account,
    handleDelete,
    handleCopyRef,
    handleRetry,
  } = useManageDomain()

  if (!domain) {
    return (
      <>
        <Container as={'div'}>
          <NoisyContainer tw="my-4">Loading...</NoisyContainer>
        </Container>
      </>
    )
  }

  const name = domain.name || ellipseAddress(domain.id)
  const typeName = EntityTypeName[domain.type]

  return (
    <>
      <section tw="px-0 pt-20 pb-6 md:py-10">
        <Container as={'div'}>
          <div tw="flex justify-between pb-5">
            <div tw="flex items-center">
              <Icon name="input-text" tw="mr-4" className="text-main0" />
              <div className="tp-body2">{name}</div>
              <Label
                kind="secondary"
                variant={status?.status ? 'success' : 'error'}
                tw="ml-4"
              >
                {status?.status
                  ? 'DOMAIN RECORDS CONFIGURED'
                  : 'DOMAIN RECORDS NOT CONFIGURED'}
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
                <div className="tp-info text-main0">NAME</div>
                <div>
                  <a
                    className="tp-body1 fs-16"
                    href={`https://${domain.name}`}
                    target="_blank"
                    referrerPolicy="no-referrer"
                  >
                    <IconText iconName="square-up-right">
                      <Text as={'span'}>{domain.name}</Text>
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
                  <Text as={'span'}>{toPascalCase(domain.target)}</Text>
                </div>
              </div>
            )}

            <div tw="my-5">
              <div className="tp-info text-main0">REF</div>
              <div>
                <IconText iconName="copy" onClick={handleCopyRef}>
                  <Text as={'span'}>{domain.ref}</Text>
                </IconText>
              </div>
            </div>

            {status && (
              <>
                <Separator />

                <TextGradient type="h7" as="h2" color="main0">
                  Status
                </TextGradient>

                <div tw="my-5">
                  <div className="tp-info text-main0">STATUS</div>
                  <Text as={'span'}>
                    <div tw="flex mt-2">
                      <BulletItem
                        kind={status.status ? 'success' : 'warning'}
                        title={''}
                      />
                      {status.status
                        ? 'Properly configured'
                        : 'Manual configuration is required'}
                    </div>
                  </Text>
                </div>

                {(!status.tasks_status.cname ||
                  !status.tasks_status.owner_proof) && (
                  <>
                    <div tw="my-5">
                      <div className="tp-info text-main0">PENDING STEPS</div>
                      <Text as={'span'}>
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
                            {domain.target == EntityDomainType.Program && (
                              <span className="text-main0" tw="mx-2">
                                {domain.name}.program.public.aleph.sh.
                              </span>
                            )}
                            {domain.target == EntityDomainType.Instance && (
                              <span className="text-main0" tw="mx-2">
                                {domain.name}.instance.public.aleph.sh.
                              </span>
                            )}
                            {domain.target == EntityDomainType.IPFS && (
                              <span className="text-main0" tw="mx-2">
                                ipfs.public.aleph.sh.
                              </span>
                            )}
                          </div>
                        </div>
                      </Text>
                      {domain.target == EntityDomainType.IPFS && (
                        <Text as={'span'}>
                          <div tw="flex mt-2">
                            <BulletItem
                              kind={
                                status.tasks_status.delegation
                                  ? 'success'
                                  : 'warning'
                              }
                              title={''}
                            />
                            <div>
                              Create a CNAME record
                              <span className="text-main0" tw="mx-2">
                                _dnslink.{domain.name}
                              </span>
                              with value
                              <span className="text-main0" tw="mx-2">
                                _dnslink.{domain.name}.static.public.aleph.sh.
                              </span>
                            </div>
                          </div>
                        </Text>
                      )}
                      <Text as={'span'}>
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
                      </Text>
                    </div>

                    <div tw="my-5">
                      <div className="tp-info text-main0">FINAL STEP</div>
                      <Text as={'span'}>
                        After configuring the domain records you can retry to
                        link them again here
                      </Text>
                    </div>

                    <div tw="my-5">
                      <Button
                        onClick={handleRetry}
                        size="md"
                        variant="secondary"
                        color="main0"
                        kind="default"
                      >
                        Retry
                      </Button>
                    </div>
                  </>
                )}
              </>
            )}

            {refEntity ? (
              <>
                <Separator />
                <TextGradient type="h7" as="h2" color="main0">
                  Linked {EntityDomainTypeName[domain.target]}
                </TextGradient>

                <div tw="my-5">
                  <div className="tp-info text-main0">Type</div>
                  <div>
                    <Text as={'span'}>{EntityTypeName[refEntity.type]}</Text>
                  </div>
                </div>

                <div tw="my-5">
                  <div className="tp-info text-main0">NAME</div>
                  <div>
                    <Text as={'span'}>{refEntity.id}</Text>
                  </div>
                </div>
                <div tw="my-5">
                  <div className="tp-info text-main0">EXPLORER</div>
                  <div>
                    <a
                      className="tp-body1 fs-16"
                      href={
                        refEntity.type !== EntityType.Website
                          ? refEntity.url
                          : refEntity.volume?.url
                      }
                      target="_blank"
                      referrerPolicy="no-referrer"
                    >
                      <IconText iconName="square-up-right">
                        <Text as={'span'}>
                          {ellipseText(
                            refEntity.type !== EntityType.Website
                              ? refEntity.url
                              : refEntity.volume?.url || '',
                            80,
                          )}
                        </Text>
                      </IconText>
                    </a>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Separator />
                <TextGradient type="h7" as="h2" color="main0">
                  Linked Resource
                </TextGradient>
                <Text as={'span'}>
                  The target resource is missing or has been deleted.{' '}
                </Text>
              </>
            )}
          </NoisyContainer>

          <div tw="mt-20 text-center">
            <ButtonLink variant="primary" href="/configure/domain/new">
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
