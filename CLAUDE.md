# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Aleph Cloud Solutions - Frontend Guidelines

## Commands

```bash
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Create production build
npm run export       # Export build to static HTML
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Run ESLint with auto-fix
```

## Development Requirements

- Node.js 20
- Font Awesome Pro token in `.npmrc` file (required for proprietary icons)
- Run `npm i` after cloning

## Architecture Overview

This is a Next.js-based decentralized cloud platform frontend for the Aleph network:

### Key Directories
- **`src/domain/`** - Business logic and entity management (VMs, functions, storage, accounts, etc.)
- **`src/store/`** - Global state management using reducer pattern
- **`src/contexts/`** - React contexts (AppStateProvider, ReownProvider for Web3)
- **`src/components/`** - Atomic component structure with form components for resource deployment
- **`src/pages/`** - Next.js pages and routing
- **`src/hooks/`** - Custom React hooks for forms and common functionality
- **`src/helpers/`** - Utility functions and validation schemas

### Technology Stack
- **Next.js 13** with static export capability (supports GitHub Pages deployment)
- **Twin.macro** for combining Tailwind CSS with styled-components
- **@aleph-front/core** - Shared UI components and themes
- **Aleph SDK** - Integration with Aleph decentralized network
- **Reown (WalletConnect)** - Web3 wallet connections
- **React Hook Form + Zod** - Form handling and validation
- **TypeScript** - Strict typing throughout

### State Management
- Global state via React Context + useReducer pattern
- Entity management for VMs, functions, domains, volumes, etc.
- Connection state for Web3 wallets and Aleph network

## Store and Entity Loading Patterns

### Loading Entity Collections into Store

When loading entity collections that need to be shared across components,
use `useAppStoreEntityRequest` from `@/hooks/common/useStoreEntitiesRequest`
instead of `useLocalRequest`. This automatically dispatches the data to the
store entity, eliminating the need for manual state synchronization.

**Key Requirements**:
- The entity must be defined in `src/store/store.ts` using `getEntityReducer`
- The `name` parameter must match the store slice name
- No need for manual dispatch or state synchronization
- Data is automatically available via `state.[entityName].entities`

**Cache Strategies**:
- `'overwrite'` - Replaces all data in the store (use for full refreshes)
- `'merge'` - Adds to existing data (use for pagination or incremental loads)
- `'none'` - No caching (fetches fresh data each time)

**Example Hook Implementation**:
```typescript
import { useCallback } from 'react'
import { useCreditManager } from '@/hooks/common/useManager/useCreditManager'
import { CreditPaymentHistoryItem } from '@/domain/credit'
import { useAppStoreEntityRequest } from '@/hooks/common/useStoreEntitiesRequest'

export function useCreditPaymentHistory(): UseCreditPaymentHistoryReturn {
  const creditManager = useCreditManager()

  const fetchPayments = useCallback(async (): Promise<
    CreditPaymentHistoryItem[]
  > => {
    if (!creditManager) return []
    const payments = await creditManager.getPaymentHistory()
    return payments.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
  }, [creditManager])

  const {
    data: history = [],
    loading,
    error,
    request
  } = useAppStoreEntityRequest<CreditPaymentHistoryItem>({
    name: 'creditPayment',  // Must match store entity name
    doRequest: fetchPayments,
    onSuccess: () => null,
    flushData: false,
    triggerOnMount: true,
    triggerDeps: [creditManager],
    cacheStrategy: 'overwrite',  // Replace all data on fetch
  })

  return { history, loading, error, refetch: request }
}
```

**When to Use**:
- Entity collections need to be accessed by multiple components
- Data should persist across component mount/unmount cycles
- You want to avoid prop drilling or repeated API calls
- The entity represents a core resource (VMs, functions, payments, etc.)

**When NOT to Use**:
- Component-local state that doesn't need sharing
- One-off API calls that don't represent stored entities
- Temporary UI state (form inputs, modal visibility, etc.)

## Build Configuration

- Custom webpack configuration via `withTwin.js` for Twin.macro support
- Static export mode for deployment (`output: 'export'`)
- GitHub Pages support with configurable base path
- Node.js polyfills disabled for client-side bundles

## Code Style and Conventions

- **TypeScript**: Strict typing, explicit return types
- **Components**: PascalCase, atomic folder structure (index.ts, cmp.tsx, types.ts, styles.tsx)
- **Hooks**: camelCase with `use` prefix, component-specific hooks in separate files
- **Imports**: React first, third-party libs, internal imports (@/* aliases)
- **Styling**: Twin.macro with TailwindCSS + styled-components
- **Formatting**: Single quotes, no semicolons, 2-space indent, 80 char line limit
- **Error Handling**: Centralized error definitions in errors.ts
- **Component Pattern**:
  ```tsx
  export const Component = ({ prop1, prop2 }: ComponentProps) => {...}
  Component.displayName = 'Component'
  export default memo(Component)
  ```
- **Types**: Separate type files with descriptive naming (ComponentProps, UseHookReturn)
- **@aleph-front/core Components**: Always verify component props in the type definitions at `node_modules/@aleph-front/core/dist/index.d.ts` before use. Do not guess prop names (e.g., use `closeOnCloseButton` not `showCloseButton` for Modal component)

## Component Development Patterns

### Entity Forms
Form components follow a consistent pattern for deploying Aleph resources:
- VM deployment forms (specs, images, domains, volumes)
- Function deployment forms (runtime, code, persistence)
- Payment and duration selection

### Domain Logic
Business logic is centralized in domain files:
- Each resource type has its own domain file (instance.ts, program.ts, volume.ts)
- Manager classes handle entity operations and API calls
- Type definitions separate from implementation

### Web3 Integration
- Wallet connection via Reown (WalletConnect v2)
- Multi-chain support (Ethereum, Avalanche, Solana, Base)
- Account compatibility checks for PAYG features

## Automation Instructions

- Run `npm run lint:fix` after making code changes
- Never commit changes unless you're explicitly told to do so
- When commiting, don't mention or coauthor claude in the commits
- Test changes with `npm run build` before pushing

## Branch Structure

- **`main`**: Version without credit payments (only holding tier and pay-as-you-go)
- **`feat/credits-ui`**: Version with credit system and products payable using credits
