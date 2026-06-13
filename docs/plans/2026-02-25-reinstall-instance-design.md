# Reinstall Instance Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a "Reinstall" action to the instance detail page header, calling `POST /control/machine/{id}/reinstall` on the CRN.

**Architecture:** Extend the existing action pattern (ExecutableOperations → useExecutableActions → ManageEntityHeader) with a new `reinstall` operation. Add a reinstall button to ManageEntityHeader with a Modal confirmation dialog before executing.

**Tech Stack:** React, TypeScript, styled-components, twin.macro, @aleph-front/core

---

### Task 1: Add `reinstall` to ExecutableOperations type

**Files:**
- Modify: `src/domain/executable.ts:147-152`

**Step 1: Add the reinstall operation**

In `src/domain/executable.ts`, add `'reinstall'` to the union type:

```typescript
export type ExecutableOperations =
  | 'reboot'
  | 'expire'
  | 'erase'
  | 'stop'
  | 'update'
  | 'reinstall'
```

**Step 2: Verify no type errors**

Run: `npx tsc --noEmit 2>&1 | head -20`
Expected: No new errors

**Step 3: Commit**

```bash
git add src/domain/executable.ts
git commit -m "feat: add reinstall to ExecutableOperations type"
```

---

### Task 2: Add reinstall handler to useExecutableActions

**Files:**
- Modify: `src/hooks/common/useExecutableActions.ts`

**Step 1: Add reinstall loading state**

After line 100 (`const [deleteLoading, setDeleteLoading] = useState(false)`), add:

```typescript
const [reinstallLoading, setReinstallLoading] = useState(false)
```

**Step 2: Add reinstallDisabled memo**

After the `deleteDisabled` useMemo (lines 278-280), add:

```typescript
const reinstallDisabled = useMemo(() => {
  return !executable
}, [executable])
```

This mirrors deleteDisabled — always enabled as long as the instance exists.

**Step 3: Add handleReinstall callback**

After the `handleReboot` callback (lines 288-291), add:

```typescript
const handleReinstall = useCallback(
  () => handleSendOperation('reinstall', setReinstallLoading),
  [handleSendOperation],
)
```

This follows the exact same pattern as handleReboot — sends a POST to `/control/machine/{vmId}/reinstall` via `sendPostOperation`.

**Step 4: Update the return type**

In `UseExecutableActionsReturn` (lines 46-66), add:

```typescript
reinstallDisabled: boolean
reinstallLoading: boolean
handleReinstall: () => void
```

**Step 5: Update the return object**

In the return statement (lines 418-438), add:

```typescript
reinstallDisabled,
reinstallLoading,
handleReinstall,
```

**Step 6: Verify no type errors**

Run: `npx tsc --noEmit 2>&1 | head -20`
Expected: Errors about missing `reinstall*` props downstream (ManageInstanceEntity, etc.) — expected, we fix those next.

**Step 7: Commit**

```bash
git add src/hooks/common/useExecutableActions.ts
git commit -m "feat: add reinstall handler to useExecutableActions"
```

---

### Task 3: Add reinstall props to ManageEntityHeader

**Files:**
- Modify: `src/components/common/entityData/ManageEntityHeader/types.ts`
- Modify: `src/components/common/entityData/ManageEntityHeader/cmp.tsx`

**Step 1: Add reinstall props to types**

In `types.ts`, after the delete action block (lines 31-35), add:

```typescript
// Reinstall action
showReinstall?: boolean
reinstallDisabled?: boolean
reinstallLoading?: boolean
onReinstall?: () => void
```

**Step 2: Add reinstall props to component destructuring**

In `cmp.tsx`, after the download action props (lines 41-44), add:

```typescript
// Reinstall action
showReinstall = false,
reinstallDisabled,
reinstallLoading = false,
onReinstall: handleReinstall,
```

**Step 3: Add the dropdown menu with reinstall action**

In `cmp.tsx`, add new imports at the top:

```typescript
import React, { memo, useRef, useState } from 'react'
```

And add these imports:

```typescript
import {
  useClickOutside,
  useFloatPosition,
  useTransition,
  useWindowScroll,
  useWindowSize,
} from '@aleph-front/core'
import { Portal } from '@/components/common/Portal'
```

Inside the component, before the `return`, add the dropdown state and positioning:

```typescript
const [showActions, setShowActions] = useState(false)
const actionsRef = useRef<HTMLDivElement>(null)
const actionsButtonRef = useRef<HTMLButtonElement>(null)

const windowSize = useWindowSize(0)
const windowScroll = useWindowScroll(0)

const { shouldMount, stage } = useTransition(showActions, 250)
const isOpen = stage === 'enter'

const {
  myRef: floatRef,
  atRef: triggerRef,
  position: actionsPosition,
} = useFloatPosition({
  my: 'top-right',
  at: 'bottom-right',
  myRef: actionsRef,
  atRef: actionsButtonRef,
  deps: [windowSize, windowScroll, shouldMount],
})

useClickOutside(() => {
  if (showActions) setShowActions(false)
}, [floatRef, triggerRef])

const onReinstallClick = () => {
  setShowActions(false)
  const confirmed = window.confirm(
    'Reinstall Instance?\n\n' +
      'This will restore the instance to its original state. ' +
      'All persistent volumes will be erased. ' +
      'This action cannot be undone.',
  )
  if (confirmed) handleReinstall?.()
}
```

After the delete button block and before the closing `</div>` of the actions row (before line 194), add the dropdown:

```tsx
{showReinstall && (
  <div tw="relative">
    <Tooltip
      content="More actions"
      my="bottom-center"
      at="top-center"
    >
      <Button
        ref={actionsButtonRef}
        kind="functional"
        variant="secondary"
        size="sm"
        onClick={() => setShowActions(!showActions)}
        disabled={reinstallLoading}
      >
        {reinstallLoading ? (
          <RotatingLines
            strokeColor={theme.color.base2}
            width=".8rem"
          />
        ) : (
          <Icon name="ellipsis-vertical" />
        )}
      </Button>
    </Tooltip>
    <Portal>
      {shouldMount && (
        <div
          ref={actionsRef}
          tw="fixed z-40"
          style={{
            transform: `translate3d(${actionsPosition.x}px, ${actionsPosition.y}px, 0)`,
            opacity: isOpen ? 1 : 0,
            transition: 'opacity ease-in-out 250ms',
          }}
        >
          <div
            tw="flex flex-col py-2 min-w-[10rem]"
            style={{
              background: theme.color.background,
              boxShadow: `0px 4px 24px ${theme.color.main0}26`,
              backdropFilter: 'blur(50px)',
            }}
          >
            <button
              tw="px-4 py-3 text-left"
              style={{
                color: theme.color.text,
              }}
              css={`
                &:hover {
                  background-color: ${theme.color.purple2};
                }
              `}
              onClick={onReinstallClick}
              disabled={reinstallDisabled || reinstallLoading}
            >
              <Icon name="arrow-rotate-right" tw="mr-2" />
              Reinstall
            </button>
          </div>
        </div>
      )}
    </Portal>
  </div>
)}
```

**Step 4: Verify no type errors**

Run: `npx tsc --noEmit 2>&1 | head -20`
Expected: No new errors from this file

**Step 5: Commit**

```bash
git add src/components/common/entityData/ManageEntityHeader/types.ts
git add src/components/common/entityData/ManageEntityHeader/cmp.tsx
git commit -m "feat: add reinstall dropdown menu to ManageEntityHeader"
```

---

### Task 4: Pass reinstall props through the instance page

**Files:**
- Modify: `src/components/pages/console/instance/ManageInstance/cmp.tsx`

**Step 1: Destructure reinstall props from hook**

In the destructuring of `useManageInstance()` (around line 66-77 in the action buttons section), add:

```typescript
reinstallDisabled,
reinstallLoading,
handleReinstall,
```

**Step 2: Pass reinstall props to ManageEntityHeader**

In the `<ManageEntityHeader>` JSX (lines 104-132), add before the `onBack` prop:

```tsx
// Reinstall action
showReinstall
reinstallDisabled={reinstallDisabled}
reinstallLoading={reinstallLoading}
onReinstall={handleReinstall}
```

**Step 3: Verify no type errors**

Run: `npx tsc --noEmit 2>&1 | head -20`
Expected: May have errors about `useManageInstance` return type — we fix that next.

**Step 4: Commit**

```bash
git add src/components/pages/console/instance/ManageInstance/cmp.tsx
git commit -m "feat: pass reinstall props to ManageEntityHeader in instance page"
```

---

### Task 5: Thread reinstall through intermediate hooks

The props flow is: `useExecutableActions` → `useManageInstanceEntity` → `useManageInstance` → component.

Since `useManageInstanceEntity` spreads `...executableActions` and its return type extends `UseExecutableActionsReturn`, the reinstall props should flow through automatically. But verify this.

**Files:**
- Check: `src/hooks/common/useEntity/useManageInstanceEntity.ts`

**Step 1: Verify the spread pattern**

Read `useManageInstanceEntity.ts` and confirm it does `return { ...executableActions, ... }`. The return type `UseManageInstanceEntityReturn` extends `UseExecutableActionsReturn`, so the new reinstall fields should propagate automatically.

If the return type is explicitly listed (not using spread/extends), add the reinstall fields.

**Step 2: Verify the full chain compiles**

Run: `npx tsc --noEmit 2>&1 | head -30`
Expected: No errors

**Step 3: Commit (if changes needed)**

```bash
git add src/hooks/common/useEntity/useManageInstanceEntity.ts
git commit -m "feat: thread reinstall props through useManageInstanceEntity"
```

---

### Task 6: Lint and build verification

**Step 1: Run linter**

Run: `npm run lint:fix`
Expected: Clean output or only pre-existing warnings

**Step 2: Run build**

Run: `npm run build`
Expected: Build succeeds

**Step 3: Commit any lint fixes**

```bash
git add -u
git commit -m "fix: lint fixes for reinstall feature"
```

---

### Task 7: Manual smoke test

**Step 1: Run dev server**

Run: `npm run dev`

**Step 2: Verify**

- Navigate to an instance detail page
- Confirm the ellipsis (⋮) button appears after the delete button
- Click it — dropdown should open with "Reinstall" option
- Click "Reinstall" — browser confirm dialog should appear
- Cancel — nothing should happen
- Confirm — POST should be sent to CRN, loading spinner should appear
