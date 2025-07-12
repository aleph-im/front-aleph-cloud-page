import React, { memo, useMemo } from 'react'
import { Button, Icon, Label, Tooltip } from '@aleph-front/core'
import {
  EntityStatusProps,
  EntityStatusPropsV1,
  EntityStatusPropsV2,
  ManageEntityHeaderProps,
} from './types'
import BackButton from '../../BackButton'
import { useTheme } from 'styled-components'
import { RotatingLines } from 'react-loader-spinner'
import Skeleton from '../../Skeleton'

const EntityStatusV2 = ({ theme, calculatedStatus }: EntityStatusPropsV2) => {
  const labelVariant = useMemo(() => {
    switch (calculatedStatus) {
      case 'not-allocated':
        return 'warning'
      case 'stopped':
        return 'error'
      case 'stopping':
        return 'warning'
      case 'running':
        return 'success'
      case 'preparing':
        return 'warning'
    }
  }, [calculatedStatus])

  const text = useMemo(() => {
    switch (calculatedStatus) {
      case 'not-allocated':
        return 'NOT ALLLOCATED'
      case 'stopped':
        return 'STOPPED'
      case 'stopping':
        return 'STOPPING'
      case 'running':
        return 'RUNNING'
      case 'preparing':
        return 'PREPARING'
    }
  }, [calculatedStatus])

  const showSpinner = useMemo(() => {
    switch (calculatedStatus) {
      case 'not-allocated':
        return false
      case 'stopped':
        return false
      case 'stopping':
        return true
      case 'running':
        return false
      case 'preparing':
        return true
    }
  }, [calculatedStatus])

  return (
    <>
      <Icon name="alien-8bit" className={`text-${labelVariant}`} />
      <div>{text}</div>
      {showSpinner && (
        <RotatingLines strokeColor={theme.color.base2} width=".8rem" />
      )}
    </>
  )
}

const EntityStatusV1 = ({
  entity,
  isAllocated,
  labelVariant,
  theme,
}: EntityStatusPropsV1) => {
  return (
    <>
      <Icon name="alien-8bit" className={`text-${labelVariant}`} />
      {isAllocated ? (
        'ALLOCATED'
      ) : (
        <>
          <div>{entity ? 'CONFIRMING' : 'LOADING'}</div>
          <RotatingLines strokeColor={theme.color.base2} width=".8rem" />
        </>
      )}
    </>
  )
}

const EntityStatus = ({
  entity,
  isAllocated,
  labelVariant,
  status,
  calculatedStatus,
  theme,
}: EntityStatusProps) => {
  if (calculatedStatus === 'loading')
    return (
      <>
        <div>Loading</div>
        <RotatingLines strokeColor={theme.color.base2} width=".8rem" />
      </>
    )

  return status?.version === 'v1' ? (
    <EntityStatusV1
      entity={entity}
      isAllocated={isAllocated}
      labelVariant={labelVariant}
      theme={theme}
    />
  ) : (
    <EntityStatusV2 calculatedStatus={calculatedStatus} theme={theme} />
  )
}

export const ManageEntityHeader = ({
  // Basic data
  name,
  labelVariant,
  isAllocated,
  entity,
  type,

  // Status
  status,
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
          <Label kind="secondary" variant={labelVariant}>
            <div tw="flex items-center justify-center gap-2">
              <EntityStatus
                status={status}
                calculatedStatus={calculatedStatus}
                entity={entity}
                labelVariant={labelVariant}
                isAllocated={isAllocated}
                theme={theme}
              />
            </div>
          </Label>
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
