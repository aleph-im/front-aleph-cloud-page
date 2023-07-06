import NoisyContainer from '@/components/common/NoisyContainer'
import { useDashboardManagePage } from '@/hooks/pages/dashboard/useDashboardManagePage'
import { EntityType } from '@/helpers/constants'
import { Container } from '../common'
import ManageSSHKey from '../ManageSSHKey'
import ManageVolume from '../ManageVolume'
import ManageInstance from '../ManageInstance'
import ManageFunction from '../ManageFunction'

export default function DashboardManagePage() {
  const { type } = useDashboardManagePage()

  if (!type) {
    return (
      <Container>
        <NoisyContainer>Loading...</NoisyContainer>
      </Container>
    )
  }

  if (type === EntityType.SSHKey) {
    return <ManageSSHKey />
  } else if (type === EntityType.Volume) {
    return <ManageVolume />
  } else if (type === EntityType.Program) {
    return <ManageFunction />
  } else if (type === EntityType.Instance) {
    return <ManageInstance />
  }
}
