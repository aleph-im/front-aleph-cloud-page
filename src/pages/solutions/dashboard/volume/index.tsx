import AutoBreadcrumb from "@/components/AutoBreadcrumb";
import CenteredSection from "@/components/CenteredSection";
import ExternalLink from "@/components/ExternalLink";
import HoldingRequirements from "@/components/HoldingRequirements";
import NewVolume from "@/components/NewVolume";
import { useNewVolumePage } from "@/hooks/pages/useNewVolumePage";
import { Button, TextGradient } from "@aleph-front/aleph-core";

export default function NewVolumePage(){
  const { volumeState, setVolumeProperty, setVolumeType, address, accountBalance, handleSubmit } = useNewVolumePage()
  return (
    <>
    <form onSubmit={handleSubmit}>
      <section>
        <AutoBreadcrumb name="Setup new volume" />
      </section>

      <CenteredSection>
        <NewVolume
          isStandAlone
          volumeMountpoint={volumeState.mountpoint}
          volumeName={volumeState.name}
          volumeRefHash={volumeState.refHash}
          volumeUseLatest={volumeState.useLatest}
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

      <section className="fx-noise-light" tw="p-5">
        <CenteredSection>
          <TextGradient type="h4">Estimated holding requirements</TextGradient>
          <div tw="my-5">
            <TextGradient
              color="main2"
              type="body">
                This amount needs to be present in your wallet until the function is removed. Tokens won	&#39;t be locked nor consumed. The function will be garbage collected once funds are removed from the wallet. 
            </TextGradient>
            <ExternalLink href="https://aleph.im" text="Learn about the benefits" />
          </div>

          <HoldingRequirements 
            address={address}
            storage={[volumeState]}
            unlockedAmount={accountBalance} />

          <div tw="my-7 text-center">
            <Button type="submit" color="main0" kind="neon" size="big" variant="primary">Create volume</Button>
          </div>
        </CenteredSection>
      </section>
    </form>
    </>
  )
}