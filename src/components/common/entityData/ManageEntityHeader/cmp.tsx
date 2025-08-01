import React, { memo } from 'react'
import { Button, Icon, Tooltip } from '@aleph-front/core'
import { ManageEntityHeaderProps } from './types'
import BackButton from '../../BackButton'
import { useTheme } from 'styled-components'
import Skeleton from '../../Skeleton'
import EntityStatus from '../EntityStatus'

export const ManageEntityHeader = ({
  // Basic data
  name,
  isAllocated,
  entity,
  type,

  // Status
  calculatedStatus,

  // Stop action
  showStop = false,
  stopDisabled,
  onStop: handleStop,
  // Start action
  showStart = false,
  startDisabled,
  onStart: handleStart,
  // Reboot action
  showReboot = false,
  rebootDisabled,
  onReboot: handleReboot,
  // Delete action
  showDelete = false,
  deleteDisabled,
  onDelete: handleDelete,
  // Download action
  showDownload = false,
  downloadDisabled,
  onDownload: handleDownload,
  // Go back action
  onBack: handleBack,
}: ManageEntityHeaderProps) => {
  const theme = useTheme()

  return (
    <section tw="px-12 py-0! md:pt-10! pb-6">
      <div tw=" px-0 py-0! md:pt-10! flex items-center justify-between gap-8">
        <div tw="flex-1">
          <BackButton handleBack={handleBack} />
        </div>
        <div tw="flex flex-col md:flex-row text-center gap-2 items-center justify-center">
          <EntityStatus
            calculatedStatus={calculatedStatus}
            entity={entity}
            isAllocated={isAllocated}
            theme={theme}
          />
          <div className="tp-h7 fs-18" tw="uppercase">
            {entity ? name : <Skeleton width="20rem" />}
          </div>
        </div>
        <div tw="flex-1 flex flex-wrap md:flex-nowrap justify-end items-center gap-4">
          {showStop && (
            <Tooltip
              content={`Stop ${type}`}
              my="bottom-center"
              at="top-center"
            >
              <Button
                kind="functional"
                variant="secondary"
                size="sm"
                onClick={handleStop}
                disabled={stopDisabled}
              >
                <Icon name="stop" />
              </Button>
            </Tooltip>
          )}

          {showStart && (
            <Tooltip
              content={`Reallocate ${type}`}
              my="bottom-center"
              at="top-center"
            >
              <Button
                kind="functional"
                variant="secondary"
                size="sm"
                onClick={handleStart}
                disabled={startDisabled}
              >
                <Icon name="play" />
              </Button>
            </Tooltip>
          )}

          {showReboot && (
            <Tooltip
              content={`Reboot ${type}`}
              my="bottom-center"
              at="top-center"
            >
              <Button
                kind="functional"
                variant="secondary"
                size="sm"
                onClick={handleReboot}
                disabled={rebootDisabled}
              >
                <Icon name="arrow-rotate-backward" />
              </Button>
            </Tooltip>
          )}

          {showDownload && (
            <Tooltip
              content={`Download ${type}`}
              my="bottom-center"
              at="top-center"
            >
              <Button
                variant="tertiary"
                color="main0"
                kind="default"
                forwardedAs="a"
                size="sm"
                onClick={handleDownload}
                disabled={downloadDisabled}
              >
                <Icon name="download" />
              </Button>
            </Tooltip>
          )}

          {showDelete && (
            <Tooltip
              content={`Remove ${type}`}
              my="bottom-center"
              at="top-center"
            >
              <Button
                kind="functional"
                variant="error"
                size="sm"
                onClick={handleDelete}
                disabled={deleteDisabled}
              >
                <Icon name="trash" />
              </Button>
            </Tooltip>
          )}
        </div>
      </div>
    </section>
  )
}
ManageEntityHeader.displayName = 'ManageEntityHeader'

export default memo(ManageEntityHeader) as typeof ManageEntityHeader
