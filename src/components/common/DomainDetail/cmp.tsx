import React, { memo } from 'react'
import { DomainDetailProps } from './types'
import {
  BulletItem,
  Button,
  Icon,
  Label,
  NoisyContainer,
  Tag,
  TextGradient,
} from '@aleph-front/core'
import IconText from '../IconText'
import { Separator, Text } from '@/components/pages/console/common'
import { ellipseAddress } from '@/helpers/utils'
import { useDomainDetail } from './hook'
import {
  EntityDomainType,
  EntityDomainTypeName,
  EntityTypeName,
} from '@/helpers/constants'
import Skeleton from '../Skeleton'
import Link from 'next/link'

export const DomainDetail = ({
  domainId,
  showDelete = false,
}: DomainDetailProps) => {
  const {
    domain,
    status,
    refEntity,
    account,
    handleDelete,
    disabledDelete,
    handleUpdate,
    disabledUpdate,
    handleRetry,
    handleCopyHash,
    handleCopyRef,
  } = useDomainDetail({ domainId })

  return (
    <>
      <div tw="flex justify-between pb-5">
        <div tw="flex flex-wrap items-center">
          <Icon name="input-text" tw="mr-4" className="text-main0" />
          <div className="tp-body2">
            {domain ? (
              domain.name || ellipseAddress(domain.id)
            ) : (
              <Skeleton width="10rem" />
            )}
          </div>
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
            onClick={() => handleUpdate()}
            disabled={disabledUpdate}
          >
            Update
          </Button>
          {showDelete && (
            <Button
              kind="functional"
              variant="error"
              size="md"
              onClick={handleDelete}
              disabled={disabledDelete}
            >
              <Icon name="trash" />
            </Button>
          )}
        </div>
      </div>

      <NoisyContainer>
        <div tw="flex items-center justify-start overflow-hidden">
          <Tag variant="accent" tw="mr-4 whitespace-nowrap">
            {domain ? (
              EntityTypeName[domain.type]
            ) : (
              <Skeleton width="5rem" height="1.3rem" />
            )}
          </Tag>
          <div tw="flex-auto">
            <div className="tp-info text-main0">NAME</div>
            {domain ? (
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
            ) : (
              <Text>
                <Skeleton width="12rem" />
              </Text>
            )}
          </div>
        </div>

        <Separator />

        <div tw="my-5 flex flex-row">
          <div>
            <div className="tp-info text-main0">TARGET</div>
            <div>
              <Text>
                {domain ? (
                  (domain.target && EntityDomainTypeName[domain.target]) || '-'
                ) : (
                  <Skeleton width="5rem" />
                )}
              </Text>
            </div>
          </div>
          <div tw="pl-12">
            <div className="tp-info text-main0">UPDATED ON</div>
            <div>
              {domain ? (
                <Text className="fs-10 tp-body1">{domain.date}</Text>
              ) : (
                <Skeleton width="5rem" />
              )}
            </div>
          </div>
        </div>

        <div tw="my-5">
          <div className="tp-info text-main0">REF</div>
          <div>
            <IconText iconName="copy" onClick={handleCopyRef}>
              <Text>{domain ? domain.ref : <Skeleton width="12rem" />}</Text>
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

            {domain &&
              (!status.tasks_status.cname ||
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
                      After configuring the domain records you can retry to link
                      them again here
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

        {domain && refEntity ? (
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
            <Text>The target resource is missing or has been deleted. </Text>
          </>
        )}
      </NoisyContainer>
    </>
  )
}
DomainDetail.displayName = 'DomainDetail'

export default memo(DomainDetail) as typeof DomainDetail
