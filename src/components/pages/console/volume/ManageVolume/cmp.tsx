import ButtonLink from '@/components/common/ButtonLink'
import { useManageVolume } from './hook'
import { CenteredContainer } from '@/components/common/CenteredContainer'
import BackButtonSection from '@/components/common/BackButtonSection'
import VolumeDetail from '@/components/common/VolumeDetail'

export default function ManageVolume() {
  const { volumeId, handleBack } = useManageVolume()

  return (
    <>
      <BackButtonSection handleBack={handleBack} />
      <section tw="px-0 pt-20 pb-6 md:py-10">
        <CenteredContainer>
          <VolumeDetail volumeId={volumeId} showDelete />

          <div tw="mt-20 text-center">
            <ButtonLink variant="primary" href="/storage/volume/new">
              Create new volume
            </ButtonLink>
          </div>
        </CenteredContainer>
      </section>
    </>
  )
}
