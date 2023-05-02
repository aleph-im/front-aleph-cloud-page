import Container from '@/components/CenteredContainer'
import HoldingRequirements from '@/components/HoldingRequirements'
import NewVolume from '@/components/NewVolume'
import { useNewVolumePage } from '@/hooks/pages/useNewVolumePage'
import { Button, TextGradient } from '@aleph-front/aleph-core'

export default function NewVolumePage() {
  const {
    volumeState,
    setVolumeProperty,
    setVolumeType,
    address,
    accountBalance,
    handleSubmit,
    isCreateButtonDisabled,
  } = useNewVolumePage()

  return (
    <>
      <form onSubmit={handleSubmit}>
        <section tw="px-0 pt-20 pb-6 md:py-10">
          <Container>
            <NewVolume
              isStandAlone
              volumeMountpoint={volumeState.mountpoint}
              volumeName={volumeState.name}
              volumeRefHash={volumeState.refHash}
              volumeUseLatest={volumeState.useLatest}
              volumeSize={volumeState.size}
              volumeSrc={volumeState.src}
              handleMountpointChange={(e) =>
                setVolumeProperty('mountpoint', e.target.value)
              }
              handleNameChange={(e) =>
                setVolumeProperty('name', e.target.value)
              }
              handleRefHashChange={(e) =>
                setVolumeProperty('refHash', e.target.value)
              }
              handleSizeChange={(e) =>
                setVolumeProperty('size', e.target.value)
              }
              handleSrcChange={(f) => setVolumeProperty('src', f)}
              handleUseLatestChange={(e) =>
                setVolumeProperty('useLatest', e.target.checked)
              }
              handleVolumeType={setVolumeType}
            />
          </Container>
        </section>
        <section
          className="fx-noise-light"
          tw="px-0 pt-6 pb-24 md:pt-16 md:pb-32"
        >
          <Container>
            <TextGradient type="h4">
              Estimated holding requirements
            </TextGradient>
            <div tw="my-5">
              <TextGradient color="main2" type="body">
                This amount needs to be present in your wallet until the
                function is removed. Tokens won &#39;t be locked nor consumed.
                The function will be garbage collected once funds are removed
                from the wallet.
              </TextGradient>
            </div>
            <HoldingRequirements
              address={address}
              storage={[volumeState]}
              unlockedAmount={accountBalance}
            />
            <div tw="my-7 text-center">
              <Button
                type="submit"
                color="main0"
                kind="neon"
                size="big"
                variant="primary"
                disabled={isCreateButtonDisabled}
              >
                Create volume
              </Button>
            </div>
          </Container>
        </section>
      </form>
    </>
  )
}
