import IconText from '@/components/common/IconText'
import { Label, NoisyContainer } from '@aleph-front/core'
import { useRouter } from 'next/router'
import Link from 'next/link'
import {
  EntityTypeName,
  EntityDomainType,
  EntityDomainTypeName,
} from '@/helpers/constants'
import { BulletItem, Button, Icon, Tag, TextGradient } from '@aleph-front/core'
import { useManageDomain } from '@/hooks/pages/solutions/manage/useManageDomain'
import { ellipseAddress } from '@/helpers/utils'
import { Container, Text, Separator } from '../common'
import ButtonLink from '@/components/common/ButtonLink'
import HoldTokenDisclaimer from '@/components/common/HoldTokenDisclaimer'
import BackButtonSection from '@/components/common/BackButtonSection'

export default function ManageDomain() {
  const {
    domain,
    status,
    refEntity,
    account,
    handleDelete,
    handleRetry,
    handleCopyHash,
    handleCopyRef,
    handleBack,
  } = useManageDomain()
  const router = useRouter()

  if (!domain) {
    return (
      <>
        <BackButtonSection handleBack={handleBack} />
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
      <BackButtonSection handleBack={handleBack} />
      <section tw="px-0 pt-20 pb-6 md:py-10">
        <Container>
          <div tw="flex justify-between pb-5">
            <div tw="flex flex-wrap items-center">
              <Icon name="input-text" tw="mr-4" className="text-main0" />
              <div className="tp-body2">{name}</div>
              <Label
                kind="secondary"
                variant={status?.status ? 'success' : 'error'}
                tw="ml-4 mt-1"
              >
                {status?.status
                  ? 'DOMAIN RECORDS CONFIGURED'
                  : 'DOMAIN RECORDS NOT CONFIGURED'}
              </Label>
            </div>
            <div tw="flex flex-wrap justify-end ml-2 gap-2 sm:gap-4">
              <Button
                kind="default"
                variant="tertiary"
                size="md"
                onClick={() =>
                  router.push(`/settings/domain/new/?name=${domain.id}`)
                }
              >
                Update
              </Button>
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
                {typeName}
              </Tag>
              <div tw="flex-auto">
                <div className="tp-info text-main0">NAME</div>
                <a
                  className="tp-body1 fs-16"
                  href={`https://${domain.name}`}
                  target="_blank"
                  referrerPolicy="no-referrer"
                >
                  <IconText iconName="square-up-right">
                    <Text>{domain.name}</Text>
                  </IconText>
                </a>
              </div>
            </div>

            <Separator />

            <div tw="my-5 flex flex-row">
              <div>
                <div className="tp-info text-main0">TARGET</div>
                <div>
                  <Text>
                    {(domain.target && EntityDomainTypeName[domain.target]) ||
                      '-'}
                  </Text>
                </div>
              </div>
              <div tw="pl-12">
                <div className="tp-info text-main0">UPDATED ON</div>
                <div>
                  <Text className="fs-10 tp-body1">{domain.date}</Text>
                </div>
              </div>
            </div>

            <div tw="my-5">
              <div className="tp-info text-main0">REF</div>
              <div>
                <IconText iconName="copy" onClick={handleCopyRef}>
                  <Text>{domain.ref}</Text>
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
                  <Text>
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
                      <Text>
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
                            {[
                              EntityDomainType.Instance,
                              EntityDomainType.Confidential,
                            ].includes(domain.target) && (
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
                        <Text>
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
                      <Text>
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
                      <Text>
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
                  <div className="tp-info text-main0">Target Resource</div>
                  <Link
                    className="tp-body1 fs-16"
                    href={
                      (domain.target === 'instance'
                        ? '/computing/instance/'
                        : domain.target === 'confidential'
                          ? '/computing/confidential/'
                          : domain.target === 'program'
                            ? '/computing/function/'
                            : '/storage/volume/') + refEntity.id
                    }
                  >
                    <IconText iconName="square-up-right">Details</IconText>
                  </Link>
                </div>
                <div tw="my-5">
                  <div className="tp-info text-main0">ITEM HASH</div>
                  <IconText iconName="copy" onClick={handleCopyHash}>
                    {refEntity.id}
                  </IconText>
                </div>
              </>
            ) : (
              <>
                <Separator />
                <TextGradient type="h7" as="h2" color="main0">
                  Linked Resource
                </TextGradient>
                <Text>
                  The target resource is missing or has been deleted.{' '}
                </Text>
              </>
            )}
          </NoisyContainer>

          <div tw="mt-20 text-center">
            <ButtonLink variant="primary" href="/settings/domain/new">
              Add new domain
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
