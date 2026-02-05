import React, { memo, useMemo } from 'react'
import { Icon, Label } from '@aleph-front/core'
import {
  EntityStatusProps,
  EntityStatusPropsV1,
  EntityStatusPropsV2,
} from './types'
import { RotatingLines } from 'react-loader-spinner'

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
      case 'starting':
        return 'info'
      case 'rebooting':
        return 'info'
      default:
        return 'warning'
    }
  }, [calculatedStatus])

  const text = useMemo(() => {
    switch (calculatedStatus) {
      case 'not-allocated':
        return 'NOT ALLOCATED'
      case 'stopped':
        return 'STOPPED'
      case 'stopping':
        return 'STOPPING'
      case 'running':
        return 'RUNNING'
      case 'preparing':
        return 'PREPARING'
      case 'starting':
        return 'STARTING'
      case 'rebooting':
        return 'REBOOTING'
      default:
        return 'UNKNOWN'
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
      case 'starting':
        return true
      case 'rebooting':
        return true
      default:
        return false
    }
  }, [calculatedStatus])

  return (
    <Label kind="secondary" variant={labelVariant}>
      <div tw="flex items-center justify-center gap-2">
        <Icon name="alien-8bit" className={`text-${labelVariant}`} />
        <div>{text}</div>
        {showSpinner && (
          <RotatingLines strokeColor={theme.color.base2} width=".8rem" />
        )}
      </div>
    </Label>
  )
}

const EntityStatusV1 = ({
  entity,
  isAllocated,
  theme,
}: EntityStatusPropsV1) => {
  const labelVariant = useMemo(() => {
    if (!entity) return 'warning'

    return entity.time < Date.now() - 1000 * 45 && isAllocated
      ? 'success'
      : 'warning'
  }, [entity, isAllocated])

  return (
    <Label kind="secondary" variant={labelVariant}>
      <div tw="flex items-center justify-center gap-2">
        <Icon name="alien-8bit" className={`text-${labelVariant}`} />
        {isAllocated ? (
          'ALLOCATED'
        ) : (
          <>
            <div>{entity ? 'CONFIRMING' : 'LOADING'}</div>
            <RotatingLines strokeColor={theme.color.base2} width=".8rem" />
          </>
        )}
      </div>
    </Label>
  )
}

export const EntityStatus = ({
  entity,
  isAllocated,
  calculatedStatus,
  theme,
}: EntityStatusProps) => {
  if (calculatedStatus === 'loading' || !entity) {
    return (
      <Label kind="secondary" variant="warning">
        <div tw="flex items-center justify-center gap-2">
          <div>Loading</div>
          <RotatingLines strokeColor={theme.color.base2} width=".8rem" />
        </div>
      </Label>
    )
  }

  return calculatedStatus === 'v1' ? (
    <EntityStatusV1 entity={entity} isAllocated={isAllocated} theme={theme} />
  ) : (
    <EntityStatusV2 calculatedStatus={calculatedStatus} theme={theme} />
  )
}
EntityStatus.displayName = 'EntityStatus'

export default memo(EntityStatus) as typeof EntityStatus
