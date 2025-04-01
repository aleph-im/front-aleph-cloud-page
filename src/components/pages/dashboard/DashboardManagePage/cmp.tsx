import { NoisyContainer } from '@aleph-front/core'
import { useDashboardManagePage } from '@/components/pages/dashboard/DashboardManagePage/hook'
import { EntityType } from '@/helpers/constants'
import { Container } from '../common'
import ManageSSHKey from '../ManageSSHKey'
import ManageVolume from '../ManageVolume'
import ManageInstance from '../ManageInstance'
import ManageDomain from '../ManageDomain'
import ManageWebsite from '../ManageWebsite'
import ManageFunction from '../ManageFunction'

export default function DashboardManagePage() {
  const { type } = useDashboardManagePage()

  if (!type) {
    return (
      <Container>
        <NoisyContainer tw="my-4">Loading...</NoisyContainer>
      </Container>
    )
  }

  if (type === EntityType.SSHKey) {
    return <ManageSSHKey />
  } else if (type === EntityType.Domain) {
    return <ManageDomain />
  } else if (type === EntityType.Volume) {
    return <ManageVolume />
  } else if (type === EntityType.Program) {
    return <ManageFunction />
  } else if (type === EntityType.Instance) {
    return <ManageInstance />
  } else if (type === EntityType.Website) {
    return <ManageWebsite />
  }
}
