import React, { useCallback, useMemo, useState } from 'react'
import tw from 'twin.macro'
import { useRouter } from 'next/router'
import { PaymentType } from '@aleph-sdk/message'
import { InstancesTabContentProps } from './types'
import ButtonLink from '@/components/common/ButtonLink'
import {
  convertByteUnits,
  ellipseText,
  humanReadableSize,
  isVolumePersistent,
  isVolumeEphemeral,
} from '@/helpers/utils'
import EntityTable from '@/components/common/EntityTable'
import { Instance } from '@/domain/instance'
import ExternalLink from '@/components/common/ExternalLink'
import { NAVIGATION_URLS, EntityType } from '@/helpers/constants'
import InstanceRowActions from '../InstanceRowActions'
import InstanceStatusCell from '../InstanceStatusCell'
import InstanceSSHKeysCell from '../InstanceSSHKeysCell'
import InstanceDomainsCell from '../InstanceDomainsCell'
import InstanceVolumesCell from '../InstanceVolumesCell'
import { VolumeWithDetails } from '../InstanceVolumesCell/types'
import { useRequestExecutableStatus } from '@/hooks/common/useRequestEntity/useRequestExecutableStatus'
import { useRequestSSHKeys } from '@/hooks/common/useRequestEntity/useRequestSSHKeys'
import { useRequestDomains } from '@/hooks/common/useRequestEntity/useRequestDomains'
import { useRequestVolumes } from '@/hooks/common/useRequestEntity/useRequestVolumes'
import { calculateExecutableStatus } from '@/helpers/executableStatus'
import CopyToClipboard from '@/components/common/CopyToClipboard'
import SidePanel from '@/components/common/SidePanel'
import SSHKeyDetail from '@/components/common/SSHKeyDetail'
import DomainDetail from '@/components/common/DomainDetail'
import VolumeDetail from '@/components/common/VolumeDetail'
import { SSHKey } from '@/domain/ssh'
import { Domain } from '@/domain/domain'
import { ImmutableVolume } from '@aleph-sdk/message'

type SidePanelState = {
  isOpen: boolean
  type?: 'sshKey' | 'domain' | 'volume'
  selectedSSHKey?: SSHKey
  selectedDomain?: Domain
  selectedVolume?: VolumeWithDetails
}

export const InstancesTabContent = React.memo(
  ({ data }: InstancesTabContentProps) => {
    const router = useRouter()

    // Credit filtering - instances with credit payment type should be managed elsewhere
    const isNonCredit = useCallback((row: Instance) => {
      return row.payment?.type !== PaymentType.credit
    }, [])

    // Fetch status for all instances
    const { status: statusMap, loading: statusLoading } =
      useRequestExecutableStatus({
        entities: data,
      })

    // Fetch all SSH keys
    const { entities: sshKeys } = useRequestSSHKeys()

    // Fetch all domains
    const { entities: allDomains } = useRequestDomains()

    // Fetch all volumes (for enriching immutable volume refs)
    const { entities: allVolumes } = useRequestVolumes()

    // Side panel state
    const [sidePanel, setSidePanel] = useState<SidePanelState>({
      isOpen: false,
    })

    // Map instance authorized_keys to SSHKey objects
    const getInstanceSSHKeys = useCallback(
      (instance: Instance) => {
        if (!instance.authorized_keys || !sshKeys) return []
        return instance.authorized_keys.map((key) =>
          sshKeys.find((sshKey) => sshKey.key === key),
        )
      },
      [sshKeys],
    )

    // Get domains linked to an instance
    const getInstanceDomains = useCallback(
      (instance: Instance) => {
        if (!allDomains) return []
        return allDomains.filter(
          (domain) => domain.ref && instance.id.includes(domain.ref),
        )
      },
      [allDomains],
    )

    // Get volumes for an instance with enriched data
    const getInstanceVolumes = useCallback(
      (instance: Instance): VolumeWithDetails[] => {
        if (!instance.volumes) return []

        return instance.volumes.map((volume) => {
          // For immutable volumes, try to find the volume details
          if (!isVolumePersistent(volume) && !isVolumeEphemeral(volume)) {
            const immutableVol = volume as ImmutableVolume
            const volumeDetails = allVolumes?.find(
              (v) => v.id === immutableVol.ref,
            )
            return {
              ...volume,
              id: immutableVol.ref,
              size: volumeDetails?.size,
            }
          }

          // For persistent volumes, size_mib is already available
          if (isVolumePersistent(volume)) {
            return {
              ...volume,
              id: undefined, // Persistent volumes don't have a separate volume entity
            }
          }

          // For ephemeral volumes
          return {
            ...volume,
            id: undefined,
          }
        })
      },
      [allVolumes],
    )

    const handleManage = useCallback(
      (instance: Instance) => {
        if (!isNonCredit(instance)) return

        router.push(`/console/computing/instance/${instance.id}`)
      },
      [isNonCredit, router],
    )

    const handleDelete = useCallback(
      (instance: Instance) => {
        router.push(`/console/computing/instance/${instance.id}`)
      },
      [router],
    )

    const handleSSHKeyClick = useCallback((sshKey: SSHKey) => {
      setSidePanel({
        isOpen: true,
        type: 'sshKey',
        selectedSSHKey: sshKey,
      })
    }, [])

    const handleDomainClick = useCallback((domain: Domain) => {
      setSidePanel({
        isOpen: true,
        type: 'domain',
        selectedDomain: domain,
      })
    }, [])

    const handleVolumeClick = useCallback((volume: VolumeWithDetails) => {
      if (!volume.id) return
      setSidePanel({
        isOpen: true,
        type: 'volume',
        selectedVolume: volume,
      })
    }, [])

    const closeSidePanel = useCallback(() => {
      setSidePanel((prev) => ({
        ...prev,
        isOpen: false,
      }))
    }, [])

    const getSidePanelTitle = () => {
      switch (sidePanel.type) {
        case 'sshKey':
          return 'SSH Key'
        case 'domain':
          return 'Custom Domain'
        case 'volume':
          return 'Volume'
        default:
          return ''
      }
    }

    const columns = useMemo(
      () => [
        {
          label: 'Status',
          render: (row: Instance) => {
            const rowStatus = statusMap[row.id]
            const hasTriedFetching = !statusLoading && rowStatus !== undefined
            const calculatedStatus = calculateExecutableStatus(
              hasTriedFetching,
              rowStatus?.data,
              EntityType.Instance,
            )
            return <InstanceStatusCell calculatedStatus={calculatedStatus} />
          },
        },
        {
          label: 'Title',
          sortable: true,
          render: (row: Instance) =>
            (row?.metadata?.name as string) || 'Unnamed instance',
        },
        {
          label: 'Hash',
          sortable: true,
          render: (row: Instance) => (
            <span onClick={(e) => e.stopPropagation()}>
              <CopyToClipboard
                text={
                  <span className="tp-body1 fs-14">
                    {ellipseText(row.id, 10, 5)}
                  </span>
                }
                textToCopy={row.id}
              />
            </span>
          ),
        },
        {
          label: 'Cores',
          align: 'right' as const,
          sortable: true,
          render: (row: Instance) => row?.resources?.vcpus || 0,
        },
        {
          label: 'RAM',
          align: 'right' as const,
          sortable: true,
          render: (row: Instance) =>
            convertByteUnits(row?.resources?.memory || 0, {
              from: 'MiB',
              to: 'GiB',
              displayUnit: true,
            }),
        },
        {
          label: 'HDD',
          align: 'right' as const,
          sortable: true,
          render: (row: Instance) => humanReadableSize(row.size, 'MiB'),
        },
        {
          label: 'Volume',
          align: 'center' as const,
          render: (row: Instance) => (
            <InstanceVolumesCell
              volumes={getInstanceVolumes(row)}
              onVolumeClick={handleVolumeClick}
            />
          ),
        },
        {
          label: 'Domain',
          align: 'center' as const,
          render: (row: Instance) => (
            <InstanceDomainsCell
              domains={getInstanceDomains(row)}
              onDomainClick={handleDomainClick}
            />
          ),
        },
        {
          label: 'SSH',
          align: 'center' as const,
          render: (row: Instance) => (
            <InstanceSSHKeysCell
              sshKeys={getInstanceSSHKeys(row)}
              onSSHKeyClick={handleSSHKeyClick}
            />
          ),
        },
        {
          label: '',
          width: '100%',
          align: 'right' as const,
          render: (row: Instance) => (
            <InstanceRowActions
              onManage={() => handleManage(row)}
              onDelete={() => handleDelete(row)}
              disabled={!isNonCredit(row)}
            />
          ),
          cellProps: () => ({
            css: tw`pl-3!`,
          }),
        },
      ],
      [
        statusMap,
        statusLoading,
        getInstanceVolumes,
        handleVolumeClick,
        getInstanceDomains,
        handleDomainClick,
        getInstanceSSHKeys,
        handleSSHKeyClick,
        handleManage,
        handleDelete,
        isNonCredit,
      ],
    )

    return (
      <>
        {data.length > 0 ? (
          <>
            <div tw="overflow-auto max-w-full">
              <EntityTable
                borderType="none"
                rowNoise
                rowKey={(row) => row.id}
                rowProps={(row) => ({
                  css: isNonCredit(row)
                    ? ''
                    : tw`opacity-40 cursor-not-allowed!`,
                  onClick: () => handleManage(row),
                })}
                rowTooltip={(row) => {
                  if (isNonCredit(row)) return null

                  return (
                    <p>
                      To manage this instance, go to the{' '}
                      <ExternalLink
                        text="Credits console App."
                        color="main0"
                        href={
                          NAVIGATION_URLS.creditConsole.computing.instances.home
                        }
                      />
                    </p>
                  )
                }}
                clickableRows
                data={data}
                columns={columns}
              />
            </div>

            <div tw="mt-20 text-center">
              <ButtonLink
                variant="primary"
                href="/console/computing/instance/new"
              >
                Create instance
              </ButtonLink>
            </div>
          </>
        ) : (
          <div tw="mt-10 text-center">
            <ButtonLink
              variant="primary"
              href="/console/computing/instance/new"
            >
              Create your first instance
            </ButtonLink>
          </div>
        )}

        {/* Side Panel */}
        <SidePanel
          title={getSidePanelTitle()}
          isOpen={sidePanel.isOpen}
          onClose={closeSidePanel}
        >
          {sidePanel.type === 'sshKey' && sidePanel.selectedSSHKey && (
            <SSHKeyDetail sshKeyId={sidePanel.selectedSSHKey.id} />
          )}
          {sidePanel.type === 'domain' && sidePanel.selectedDomain && (
            <DomainDetail domainId={sidePanel.selectedDomain.id} />
          )}
          {sidePanel.type === 'volume' && sidePanel.selectedVolume?.id && (
            <VolumeDetail volumeId={sidePanel.selectedVolume.id} />
          )}
        </SidePanel>
      </>
    )
  },
)
InstancesTabContent.displayName = 'InstancesTabContent'

export default InstancesTabContent
