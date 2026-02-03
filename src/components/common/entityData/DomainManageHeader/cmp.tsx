import React, { memo } from 'react'
import { Button, Icon, Tooltip } from '@aleph-front/core'
import { DomainManageHeaderProps } from './types'
import BackButton from '../../BackButton'
import { useTheme } from 'styled-components'
import Skeleton from '../../Skeleton'
import { RotatingLines } from 'react-loader-spinner'
import EntityStatusBadge from '../../EntityStatusBadge'

export const DomainManageHeader = ({
  domain,
  name,
  status,

  // Update action
  updateDisabled,
  updateLoading = false,
  onUpdate: handleUpdate,

  // Delete action
  deleteDisabled,
  deleteLoading = false,
  onDelete: handleDelete,

  // Go back action
  onBack: handleBack,
}: DomainManageHeaderProps) => {
  const theme = useTheme()

  return (
    <section tw="px-12 py-0! md:pt-10! pb-6">
      <div tw="px-0 py-0! md:pt-10! flex items-center justify-between gap-8">
        <div tw="flex-1">
          <BackButton handleBack={handleBack} />
        </div>
        <div tw="flex flex-col md:flex-row text-center gap-2 items-center justify-center">
          <div tw="ml-4">
            <EntityStatusBadge
              icon={!!status ? 'alien-8bit' : undefined}
              showSpinner={!status}
              text={status?.status ? 'READY' : 'DNS PENDING'}
              variant={status?.status ? 'success' : 'warning'}
            />
          </div>
          <div className="tp-h7 fs-18" tw="uppercase">
            {domain ? name : <Skeleton width="20rem" />}
          </div>


        </div>
        <div tw="flex-1 flex flex-wrap md:flex-nowrap justify-end items-center gap-4">
          <Tooltip content="Update Domain" my="bottom-center" at="top-center">
            <Button
              kind="default"
              variant="tertiary"
              size="sm"
              onClick={handleUpdate}
              disabled={updateDisabled || updateLoading}
            >
              {updateLoading ? (
                <RotatingLines strokeColor={theme.color.base2} width=".8rem" />
              ) : (
                <>
                  <Icon name="edit" tw="mr-2" />
                  Update
                </>
              )}
            </Button>
          </Tooltip>

          <Tooltip content="Delete Domain" my="bottom-center" at="top-center">
            <Button
              kind="functional"
              variant="error"
              size="sm"
              onClick={handleDelete}
              disabled={deleteDisabled || deleteLoading}
            >
              {deleteLoading ? (
                <RotatingLines strokeColor={theme.color.base2} width=".8rem" />
              ) : (
                <Icon name="trash" />
              )}
            </Button>
          </Tooltip>
        </div>
      </div>
    </section>
  )
}
DomainManageHeader.displayName = 'DomainManageHeader'

export default memo(DomainManageHeader) as typeof DomainManageHeader
