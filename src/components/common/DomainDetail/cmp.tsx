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

        {/* Remove Link Section */}
        <div>
          <div className="tp-h7 fs-24" tw="uppercase mb-2">
            REMOVE LINK
          </div>
          <NoisyContainer>
            <div tw="p-6" className="bg-background">
              <div tw="flex items-center justify-between">
                <span className="tp-body fs-16">
                  Remove domain from this instance
                </span>
                <Button
                  kind="functional"
                  variant="error"
                  size="sm"
                  onClick={handleDeleteClick}
                  disabled={disabledDelete}
                >
                  <Icon name="trash-xmark" />
                </Button>
              </div>
            </div>
          </NoisyContainer>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        open={showDeleteModal}
        onClose={handleCancelDelete}
        width="34rem"
        header={<TextGradient type="h6">Delete</TextGradient>}
        content={
          <div tw="mb-8">
            <p className="tp-body text-base2">
              This will remove the linked domain{' '}
              <span className="tp-body3">{domain?.name}</span>
            </p>
            <p className="tp-body2 text-error">This action cannot be undone.</p>
          </div>
        }
        footer={
          <div tw="w-full flex justify-between">
            <Button
              type="button"
              kind="functional"
              variant="error"
              size="md"
              onClick={handleConfirmDelete}
            >
              Delete
              <Icon name="trash" tw="ml-2.5" />
            </Button>
            <Button
              type="button"
              variant="primary"
              kind="functional"
              size="md"
              onClick={handleCancelDelete}
            >
              Keep
            </Button>
          </div>
        }
      />
    </>
  )
}
DomainDetail.displayName = 'DomainDetail'

export default memo(DomainDetail) as typeof DomainDetail
