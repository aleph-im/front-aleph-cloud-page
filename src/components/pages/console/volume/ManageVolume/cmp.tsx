import Head from 'next/head'
import { useManageVolume } from './hook'
import { CenteredContainer } from '@/components/common/CenteredContainer'
import BackButtonSection from '@/components/common/BackButtonSection'
import VolumeDetail from '@/components/common/VolumeDetail'
import DeprecatedResourceBanner from '@/components/common/DeprecatedResourceBanner'
import { NAVIGATION_URLS } from '@/helpers/constants'

export default function ManageVolume() {
  const { volumeId, handleBack } = useManageVolume()

  return (
    <>
      <Head>
        <title>Console | Manage Volume | Aleph Cloud</title>
        <meta
          name="description"
          content="Manage your storage volumes on Aleph Cloud"
        />
      </Head>
      <BackButtonSection handleBack={handleBack} />
      <section tw="px-0 pt-20 pb-6 md:py-10">
        <CenteredContainer>
          <VolumeDetail volumeId={volumeId} showDelete />
          <DeprecatedResourceBanner
            resourceName="Volume"
            createUrl={NAVIGATION_URLS.creditConsole.storage.volumes.new}
          />
        </CenteredContainer>
      </section>
    </>
  )
}
