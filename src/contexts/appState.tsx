import {
  createContext,
  useReducer,
  Dispatch,
  ReactNode,
  useContext,
} from 'react'
import {
  StoreAction,
  storeInitialState,
  storeReducer,
  StoreState,
} from '@/store/store'

export type AppContextValue = [StoreState, Dispatch<StoreAction>]

export type AppStateProviderProps = {
  children: ReactNode
}

export const AppStateContext = createContext<AppContextValue>([
  storeInitialState,
  () => null,
])

export function AppStateProvider({ children }: AppStateProviderProps) {
  const value = useReducer(storeReducer, storeInitialState)

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  )
}

export function useAppState(): AppContextValue {
  return useContext(AppStateContext)
}
