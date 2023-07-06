import NoisyContainer from '@/components/common/NoisyContainer'
import { EntityType } from '@/helpers/constants'
import ManageSSHKey from '@/components/pages/dashboard/manage/ManageSSHKey/cmp'
import ManageVolume from '../ManageVolume/cmp'
import { Container } from '../common'
import { useDashboardManagePage } from '@/hooks/pages/dashboard/useDashboardManagePage'

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
    return <ManageVolume />
  } else if (type === EntityType.Instance) {
    return <ManageVolume />
  }
}
