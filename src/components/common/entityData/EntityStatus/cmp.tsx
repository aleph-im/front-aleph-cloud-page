import React, { memo, useMemo } from 'react'
import { Icon, Label } from '@aleph-front/core'
import {
  EntityStatusProps,
  EntityStatusPropsV1,
  EntityStatusPropsV2,
} from './types'
import { RotatingLines } from 'react-loader-spinner'
import { getMessageStatusDisplay } from '@/helpers/messageStatus'

const EntityStatusV2 = ({
  theme,
  calculatedStatus,
  cannotStart,
}: EntityStatusPropsV2) => {
  const labelVariant = useMemo(() => {
    if (cannotStart) return 'error'

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
  }, [calculatedStatus, cannotStart])

  const text = useMemo(() => {
    if (cannotStart) return 'STOPPED'

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
  }, [calculatedStatus, cannotStart])

  const showSpinner = useMemo(() => {
    if (cannotStart) return false

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
  }, [calculatedStatus, cannotStart])

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
  // A processed message only means the instance was accepted; it still has to be
  // created on its host CRN, which `isAllocated` reflects. Until then show
  // CREATING instead of READY.
  const { label, variant, spinner } = getMessageStatusDisplay(entity?.status, {
    ready: isAllocated,
  })

  return (
    <Label kind="secondary" variant={variant}>
      <div tw="flex items-center justify-center gap-2">
        <Icon name="alien-8bit" className={`text-${variant}`} />
        <div>{label}</div>
        {spinner && (
          <RotatingLines strokeColor={theme.color.base2} width=".8rem" />
        )}
      </div>
    </Label>
  )
}

export const EntityStatus = ({
  entity,
  isAllocated,
  calculatedStatus,
  cannotStart,
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
    <EntityStatusV2
      calculatedStatus={calculatedStatus}
      theme={theme}
      cannotStart={cannotStart}
    />
  )
}
EntityStatus.displayName = 'EntityStatus'

export default memo(EntityStatus) as typeof EntityStatus
