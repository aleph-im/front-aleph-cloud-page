import {
  createContext,
  useReducer,
  Dispatch,
  ReactNode,
  useContext,
} from 'react'
import { Action, initialState, reducer, State } from '@/helpers/store'

export type AppState = [state: State, dispatch: Dispatch<Action>]

export type AppStateProviderProps = {
  children: ReactNode
}

export const AppStateContext = createContext<AppState>([
  initialState,
  () => null,
])

export function AppStateProvider({ children }: AppStateProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <AppStateContext.Provider value={[state, dispatch]}>
      {children}
    </AppStateContext.Provider>
  )
}

export function useAppState(): AppState {
  return useContext(AppStateContext)
}
