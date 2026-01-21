import { ComponentType, useEffect, useRef } from 'react'

type DependencyMap = Record<string, unknown>

type RenderReason = 'props' | 'state' | 'hook' | 'parent' | 'initial'

function logChanges(
  name: string,
  changes: Record<string, { from: unknown; to: unknown }>,
  reason?: RenderReason,
) {
  const hasChanges = Object.keys(changes).length > 0

  if (!hasChanges && !reason) return

  console.group(`[WhyDidYouRender] ${name}`)

  if (reason && !hasChanges) {
    console.log(`Re-rendered due to: ${reason}`)
  }

  if (hasChanges) {
    console.log('Changed:')
    Object.entries(changes).forEach(([key, { from, to }]) => {
      console.log(`  ${key}:`)
      console.log('    from:', from)
      console.log('    to:', to)
    })
  }

  console.groupEnd()
}

function getChanges(
  prev: DependencyMap | undefined,
  current: DependencyMap,
): Record<string, { from: unknown; to: unknown }> {
  if (!prev) return {}

  const changes: Record<string, { from: unknown; to: unknown }> = {}
  Object.keys(current).forEach((key) => {
    if (prev[key] !== current[key]) {
      changes[key] = { from: prev[key], to: current[key] }
    }
  })
  return changes
}

export function useWhyDidYouRender(
  componentName: string,
  deps: DependencyMap,
): void {
  const previousDeps = useRef<DependencyMap>()
  const renderCount = useRef(0)

  renderCount.current++

  useEffect(() => {
    const changes = getChanges(previousDeps.current, deps)
    const isInitial = !previousDeps.current
    const hasChanges = Object.keys(changes).length > 0

    if (isInitial) {
      logChanges(componentName, {}, 'initial')
    } else if (hasChanges) {
      logChanges(componentName, changes)
    } else {
      logChanges(componentName, {}, 'state')
    }

    previousDeps.current = deps
  })
}

export function useWhyDidYouRenderWithState(
  componentName: string,
  props: DependencyMap,
  state: DependencyMap,
): void {
  const previousProps = useRef<DependencyMap>()
  const previousState = useRef<DependencyMap>()

  useEffect(() => {
    const propsChanges = getChanges(previousProps.current, props)
    const stateChanges = getChanges(previousState.current, state)
    const isInitial = !previousProps.current

    if (isInitial) {
      console.log(`[WhyDidYouRender] ${componentName} - initial render`)
    } else {
      const hasPropsChanges = Object.keys(propsChanges).length > 0
      const hasStateChanges = Object.keys(stateChanges).length > 0

      if (hasPropsChanges || hasStateChanges) {
        console.group(`[WhyDidYouRender] ${componentName}`)

        if (hasPropsChanges) {
          console.log('Props changed:')
          Object.entries(propsChanges).forEach(([key, { from, to }]) => {
            console.log(`  ${key}:`)
            console.log('    from:', from)
            console.log('    to:', to)
          })
        }

        if (hasStateChanges) {
          console.log('State changed:')
          Object.entries(stateChanges).forEach(([key, { from, to }]) => {
            console.log(`  ${key}:`)
            console.log('    from:', from)
            console.log('    to:', to)
          })
        }

        console.groupEnd()
      } else {
        console.log(`[WhyDidYouRender] ${componentName} - parent re-rendered (no prop/state changes)`)
      }
    }

    previousProps.current = props
    previousState.current = state
  })
}

export function withWhyDidYouRender<P extends object>(
  WrappedComponent: ComponentType<P>,
  displayName?: string,
): ComponentType<P> {
  const name = displayName || WrappedComponent.displayName || WrappedComponent.name || 'Component'

  const WithWhyDidYouRender = (props: P) => {
    const previousProps = useRef<P>()
    const isInitial = useRef(true)

    useEffect(() => {
      const changes = getChanges(
        previousProps.current as DependencyMap | undefined,
        props as DependencyMap,
      )

      if (isInitial.current) {
        console.log(`[WhyDidYouRender] ${name} - initial render`)
        isInitial.current = false
      } else if (Object.keys(changes).length > 0) {
        logChanges(name, changes, 'props')
      } else {
        console.log(`[WhyDidYouRender] ${name} - re-rendered (no prop changes, likely parent re-render)`)
      }

      previousProps.current = props
    })

    return <WrappedComponent {...props} />
  }

  WithWhyDidYouRender.displayName = `WithWhyDidYouRender(${name})`

  return WithWhyDidYouRender
}

export default useWhyDidYouRender
