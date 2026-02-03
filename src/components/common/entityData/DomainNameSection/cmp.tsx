import React, { memo, useState, useCallback } from 'react'
import {
  BulletItem,
  Button,
  Icon,
  NoisyContainer,
  TextInput,
} from '@aleph-front/core'
import { DomainNameSectionProps } from './types'
import Skeleton from '../../Skeleton'
import { Text } from '@/components/pages/console/common'
import FunctionalButton from '../../FunctionalButton'

export const DomainNameSection = ({
  domain,
  status,
  onSave: handleSave,
}: DomainNameSectionProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedName, setEditedName] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const handleConfigureClick = useCallback(() => {
    if (domain) {
      setEditedName(domain.name)
      setIsEditing(true)
    }
  }, [domain])

  const handleSaveClick = useCallback(async () => {
    if (!editedName.trim()) return

    // If the name hasn't changed, just exit edit mode
    if (domain && editedName.trim() === domain.name) {
      setIsEditing(false)
      return
    }

    setIsSaving(true)
    try {
      await handleSave(editedName.trim())
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to save domain name:', error)
    } finally {
      setIsSaving(false)
    }
  }, [editedName, handleSave, domain])

  return (
    <>
      <div className="tp-h7 fs-24" tw="uppercase mb-2">
        DOMAIN
      </div>
      <NoisyContainer>
        <div tw="flex flex-col gap-4">
          <div tw="flex items-stretch">
            <div tw="flex-1">
              {domain ? (
                <TextInput
                  name="domain-name"
                  value={isEditing ? editedName : domain.name}
                  disabled={!isEditing || isSaving}
                  onChange={(e) => setEditedName(e.target.value)}
                  button={
                    isEditing ? (
                      <Button
                        onClick={handleSaveClick}
                        disabled={isSaving || !editedName.trim()}
                      >
                        Save
                      </Button>
                    ) : (
                      <Button
                        as="a"
                        href={`https://${domain.name}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Icon name="check" />
                      </Button>
                    )
                  }
                />
              ) : (
                <TextInput
                  name="domain-name"
                  value=""
                  disabled
                  placeholder="Loading..."
                  button={
                    <Button disabled>
                      <Icon name="check" />
                    </Button>
                  }
                />
              )}
            </div>
          </div>
          <div tw="flex items-center justify-between">
            {!isEditing && (
              <div tw="flex items-center">
                {status !== undefined ? (
                  <>
                    <BulletItem
                      kind={status.status ? 'success' : 'warning'}
                      title=""
                    />
                    <Text tw="font-semibold">
                      {status.status ? 'Active' : 'Pending DNS'}
                    </Text>
                  </>
                ) : (
                  <Text>
                    <Skeleton width="5rem" />
                  </Text>
                )}
              </div>
            )}
            {isEditing && <div />}
            {!isEditing && (
              <FunctionalButton
                onClick={handleConfigureClick}
                disabled={!domain}
              >
                <Icon name="edit" />
                configure
              </FunctionalButton>
            )}
          </div>
        </div>
      </NoisyContainer>
    </>
  )
}
DomainNameSection.displayName = 'DomainNameSection'

export default memo(DomainNameSection) as typeof DomainNameSection
