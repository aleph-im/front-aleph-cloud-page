import { memo } from 'react'
import { StyledProgressContainer, StyledFakeProgressBar } from './styles'
import { FakeProgressBarProps } from './types'
import { useFakeProgressBar } from './hook'

export const FakeProgressBar = (props: FakeProgressBarProps) => {
  const { loading, progress, skipTransition, shouldMount } =
    useFakeProgressBar(props)

  return (
    <StyledProgressContainer $show={shouldMount || loading}>
      <StyledFakeProgressBar
        $progress={progress}
        $skipTransition={skipTransition}
      />
    </StyledProgressContainer>
  )
}

FakeProgressBar.displayName = 'FakeProgressBar'

export default memo(FakeProgressBar)
