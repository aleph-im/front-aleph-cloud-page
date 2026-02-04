import React, { memo, useState, useCallback } from 'react'
import { DomainDetailProps } from './types'
import { useDomainDetail } from './hook'
import DomainNameSection from '../entityData/DomainNameSection'
import DomainDnsConfiguration from '../entityData/DomainDnsConfiguration'
import {
  Button,
  Icon,
  Modal,
  NoisyContainer,
  TextGradient,
} from '@aleph-front/core'

export const DomainDetail = ({ domainId }: DomainDetailProps) => {
  const {
    domain,
    status,
    account,
    handleRetry,
    handleSaveName,
    handleDelete,
    disabledDelete,
  } = useDomainDetail({ domainId })

  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const handleDeleteClick = useCallback(() => {
    setShowDeleteModal(true)
  }, [])

  const handleCancelDelete = useCallback(() => {
    setShowDeleteModal(false)
  }, [])

  const handleConfirmDelete = useCallback(() => {
    setShowDeleteModal(false)
    handleDelete()
  }, [handleDelete])

  return (
    <>
      <div tw="flex flex-col gap-6">
        <DomainNameSection
          domain={domain}
          status={status}
          onSave={handleSaveName}
        />
        <DomainDnsConfiguration
          domain={domain}
          status={status}
          account={account}
          onRetry={handleRetry}
        />

        {/* Remove Domain Section */}
        <div>
          <div className="tp-h7 fs-24" tw="uppercase mb-2">
            DANGER ZONE
          </div>
          <NoisyContainer>
            <div tw="flex items-center justify-between">
              <span className="tp-body1 fs-18">
                Remove domain from this instance
              </span>
              <Button
                kind="functional"
                variant="error"
                size="md"
                onClick={handleDeleteClick}
                disabled={disabledDelete}
              >
                <Icon name="trash" />
              </Button>
            </div>
          </NoisyContainer>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        open={showDeleteModal}
        onClose={handleCancelDelete}
        width="34rem"
        header={<TextGradient type="h6">Remove Domain</TextGradient>}
        content={
          <div tw="mb-8">
            <p className="tp-body">
              Are you sure you want to remove this domain?
            </p>
            <p className="tp-body">This action cannot be undone.</p>
          </div>
        }
        footer={
          <div tw="w-full flex justify-between">
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={handleCancelDelete}
            >
              Keep
            </Button>
            <Button
              type="button"
              color="error"
              kind="functional"
              variant="warning"
              size="md"
              onClick={handleConfirmDelete}
            >
              Remove Domain
            </Button>
          </div>
        }
      />
    </>
  )
}
DomainDetail.displayName = 'DomainDetail'

export default memo(DomainDetail) as typeof DomainDetail
