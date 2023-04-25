import AutoBreadcrumb from "@/components/AutoBreadcrumb";
import CenteredSection from "@/components/CenteredSection";
import NewVolume from "@/components/NewVolume";
import { useNewVolumePage } from "@/hooks/pages/useNewVolumePage";

export default function NewVolumePage(){
  const { volumeState, setVolumeProperty, setVolumeType } = useNewVolumePage()
  return (
    <>
      <section>
        <AutoBreadcrumb name="Setup new volume" />
      </section>

      <CenteredSection>
        <NewVolume
          isStandAlone
          volumeMountpoint={volumeState.mountpoint}
          volumeName={volumeState.name}
          volumeRefHash={volumeState.refHash}
          volumeSize={volumeState.size}
          volumeSrc={volumeState.src}
          handleMountpointChange={e => setVolumeProperty('mountpoint', e.target.value)}
          handleNameChange={e => setVolumeProperty('name', e.target.value)}
          handleRefHashChange={e => setVolumeProperty('refHash', e.target.value)}
          handleSizeChange={e => setVolumeProperty('size', e.target.value)}
          handleSrcChange={f => setVolumeProperty('src', f)}
          handleUseLatestChange={e => setVolumeProperty('useLatest', e.target.checked)}
          handleVolumeType={setVolumeType}
        />
      </CenteredSection>
    </>
  )
}