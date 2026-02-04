import React, { memo } from 'react'
import { DomainDetailProps } from './types'
import { Button, Icon, Tooltip } from '@aleph-front/core'
import { ellipseAddress } from '@/helpers/utils'
import { useDomainDetail } from './hook'
import Skeleton from '../Skeleton'
import EntityStatusBadge from '../EntityStatusBadge'
import DomainEntityDetails from '../entityData/DomainEntityDetails'
import DomainLinkedResource from '../entityData/DomainLinkedResource'
import DomainDnsConfiguration from '../entityData/DomainDnsConfiguration'

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
    handleCopyRef,
  } = useDomainDetail({ domainId })

  return (
    <>
      {/* Header Section */}
      <div tw="flex flex-col gap-4 pb-6">
        <div tw="flex items-center gap-3">
          <Icon name="input-text" className="text-main0" size="lg" />
          <div className="tp-h7 fs-18">
            {domain ? (
              domain.name || ellipseAddress(domain.id)
            ) : (
              <Skeleton width="10rem" />
            )}
          </div>
        </div>

        {status !== undefined && (
          <div>
            <EntityStatusBadge
              text={status.status ? 'READY' : 'DNS PENDING'}
              variant={status.status ? 'success' : 'warning'}
            />
          </div>
        )}

        <div tw="flex flex-wrap gap-3">
          <Tooltip content="Update Domain" my="bottom-center" at="top-center">
            <Button
              kind="default"
              variant="tertiary"
              size="md"
              onClick={handleUpdate}
              disabled={disabledUpdate}
            >
              <Icon name="edit" tw="mr-2" />
              Update
            </Button>
          </Tooltip>

          {showDelete && (
            <Tooltip content="Delete Domain" my="bottom-center" at="top-center">
              <Button
                kind="functional"
                variant="error"
                size="md"
                onClick={handleDelete}
                disabled={disabledDelete}
              >
                <Icon name="trash" />
              </Button>
            </Tooltip>
          )}
        </div>
      </div>

      {/* Content Sections in Single Column */}
      <div tw="flex flex-col gap-6">
        <DomainEntityDetails domain={domain} onCopyRef={handleCopyRef} />

        <DomainLinkedResource domain={domain} refEntity={refEntity} />

        <DomainDnsConfiguration
          domain={domain}
          status={status}
          account={account}
          onRetry={handleRetry}
        />
      </div>
    </>
  )
}
DomainDetail.displayName = 'DomainDetail'

export default memo(DomainDetail) as typeof DomainDetail
