import React, { memo, useMemo } from 'react'
import { Button, Icon, Tooltip } from '@aleph-front/core'
import { ManageEntityHeaderProps } from './types'
import BackButton from '../../BackButton'
import { useTheme } from 'styled-components'
import Skeleton from '../../Skeleton'
import EntityStatus from '../EntityStatus'
import { RotatingLines } from 'react-loader-spinner'
import { PaymentType } from '@aleph-sdk/message'
import BorderBox from '../../BorderBox'
import ExternalLink from '../../ExternalLink'

export const ManageEntityHeader = ({
  // Basic data
  name,
  isAllocated,
  entity,
  type,

  // Status
  calculatedStatus,

  // Credit balance
  creditBalance,

  // Payment data
  paymentData,

  // Stop action
  showStop = false,
  stopDisabled,
  stopLoading = false,
  onStop: handleStop,
  // Start action
  showStart = false,
  startDisabled,
  startLoading = false,
  onStart: handleStart,
  // Reboot action
  showReboot = false,
  rebootDisabled,
  rebootLoading = false,
  onReboot: handleReboot,
  // Delete action
  showDelete = false,
  deleteDisabled,
  deleteLoading = false,
  onDelete: handleDelete,
  // Download action
  showDownload = false,
  downloadDisabled,
  downloadLoading = false,
  onDownload: handleDownload,
  // Go back action
  onBack: handleBack,
}: ManageEntityHeaderProps) => {
  const theme = useTheme()

  const cannotStart = useMemo(() => {
    const isStoppedOrNotAllocated =
      !isAllocated || calculatedStatus === 'stopped'

    if (!isStoppedOrNotAllocated) return false

    // Find credit payment to get the hourly cost
    const creditPayment = paymentData?.find(
      (payment) => payment.paymentType === PaymentType.credit,
    )

    if (!creditPayment?.cost) return false

    const hourlyCost = creditPayment.cost
    const minimumHours = 4
    const requiredCredits = hourlyCost * minimumHours

    const hasInsufficientCredits =
      !creditBalance || creditBalance < requiredCredits

    return hasInsufficientCredits
  }, [isAllocated, calculatedStatus, paymentData, creditBalance])

  return (
    <>
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
                  disabled={stopDisabled || stopLoading}
                >
                  {stopLoading ? (
                    <RotatingLines
                      strokeColor={theme.color.base2}
                      width=".8rem"
                    />
                  ) : (
                    <Icon name="stop" />
                  )}
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
                  disabled={startDisabled || startLoading || cannotStart}
                >
                  {startLoading ? (
                    <RotatingLines
                      strokeColor={theme.color.base2}
                      width=".8rem"
                    />
                  ) : (
                    <Icon name="play" />
                  )}
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
                  disabled={rebootDisabled || rebootLoading || cannotStart}
                >
                  {rebootLoading ? (
                    <RotatingLines
                      strokeColor={theme.color.base2}
                      width=".8rem"
                    />
                  ) : (
                    <Icon name="arrow-rotate-backward" />
                  )}
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
                  disabled={downloadDisabled || downloadLoading}
                >
                  {downloadLoading ? (
                    <RotatingLines
                      strokeColor={theme.color.base2}
                      width=".8rem"
                    />
                  ) : (
                    <Icon name="download" />
                  )}
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
                  disabled={deleteDisabled || deleteLoading}
                >
                  {deleteLoading ? (
                    <RotatingLines
                      strokeColor={theme.color.base2}
                      width=".8rem"
                    />
                  ) : (
                    <Icon name="trash" />
                  )}
                </Button>
              </Tooltip>
            )}
          </div>
        </div>
      </section>
      {cannotStart && (
        <section tw="px-12 py-0! md:pt-10! pb-6" className="tp-body1">
          <BorderBox $color="error">
            <p>
              ⛔️ <strong>This resource can&apos;t be started</strong> due to
              insufficiency of credits.
            </p>
            <p>
              <ExternalLink text="Top-up" color="disabled" underline disabled />{' '}
              your wallet to reactivate your instance again.
            </p>
          </BorderBox>
        </section>
      )}
    </>
  )
}
ManageEntityHeader.displayName = 'ManageEntityHeader'

export default memo(ManageEntityHeader) as typeof ManageEntityHeader
