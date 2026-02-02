# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Create production build
npm run export       # Export to static HTML
npm run lint:fix     # Run ESLint with auto-fix
```

## Requirements

- Node.js 20
- Font Awesome Pro token in `.npmrc`

## Code Style

- **TypeScript**: Strict typing, explicit return types
- **Components**: PascalCase, atomic folder structure (index.ts, cmp.tsx, types.ts, styles.tsx)
- **Hooks**: camelCase with `use` prefix
- **Imports**: React first, third-party libs, internal imports (@/* aliases)
- **Styling**: Twin.macro with TailwindCSS + styled-components
- **Formatting**: Single quotes, no semicolons, 2-space indent, 80 char line limit

**Component Pattern:**
```tsx
export const Component = ({ prop1, prop2 }: ComponentProps) => {...}
Component.displayName = 'Component'
export default memo(Component)
```

## Architecture Overview

This is a Next.js dApp for deploying and managing compute resources on the Aleph network.

### Directory Structure

```
src/
├── domain/          # Business logic and entity managers
├── store/           # Redux-like state (connection, entities, requests, filters)
├── contexts/        # React contexts (AppState, Reown wallet)
├── hooks/           # Custom hooks organized by feature
├── components/
│   ├── common/      # Reusable UI components
│   └── pages/       # Page-level components (console, account)
├── pages/           # Next.js routing (re-exports from components/pages)
└── helpers/         # Constants, utilities, validation schemas
```

### Entity Types

The app manages these Aleph network resources:
- **Compute**: Instance, GpuInstance, Confidential (TEE), Program (functions)
- **Storage**: Volume (New, Existing, Persistent)
- **Networking**: Domain, Website, ForwardedPorts
- **Config**: SSH keys, Permissions

### Domain Layer Pattern

All resources use the EntityManager pattern (`src/domain/types.ts`):

```typescript
interface EntityManager<T, AT> {
  getAll(): Promise<T[]>
  get(id: string): Promise<T>
  add(entity: AT): AsyncGenerator<void, AddReturn<T>>
  del(entity: T): AsyncGenerator<void, void>
  getAddSteps(entity: AT): Promise<CheckoutStepType[]>
  getDelSteps(entity: T): Promise<CheckoutStepType[]>
}
```

Managers use **async generators** for multi-step operations (volume creation, payment setup, domain linking).

### Store Architecture

State is managed via React Context + useReducer (`src/store/store.ts`):

- **connection**: Account, blockchain, balance, payment method
- **entity slices**: Each resource type has `{ keys, entities, loading, error }`
- **managers**: Instantiated domain managers (InstanceManager, VolumeManager, etc.)
- **requests**: Async request state for non-entity data
- **filters**: UI filter state

**Cascade Invalidation**: Deleting an entity clears related caches (e.g., deleting SSH key invalidates all compute resources).

### Hooks Layer

Key hook patterns in `src/hooks/`:

- `useRequest[Entity]()` - Fetch entities from store/managers
- `use[Entity]Manager()` - Access domain managers
- `useConnection()` - Wallet connection handling
- `useEntityCost()`, `useCanAfford()` - Cost calculations

### Payment System

Two payment methods for compute resources:
- **Hold**: Upfront ALEPH token hold
- **Stream**: Superfluid payment streams (80% to node, 20% to community)

### Web3 Integration

- **Reown** (formerly WalletConnect) for wallet connection
- **Superfluid** for payment streams
- Supports ETH, AVAX, BASE, Solana chains

## Automation Instructions

- Run `npm run lint:fix` after making code changes
- Test changes with `npm run build` before pushing
- Never commit changes unless explicitly told to do so
- When committing, don't mention or co-author Claude
