# Instance Reinstall Action Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a **Reinstall** lifecycle action to the instance manage page in `front-aleph-cloud-page`, gated by a type-to-confirm modal.

**Architecture:** Reinstall is a CRN control operation — `POST {crn}/control/machine/{vmId}/reinstall` — sent through the existing `ExecutableManager.sendPostOperation`. A new `handleReinstall` action in `useExecutableActions` mirrors `handleReboot`. The instance manage page opens a type-to-confirm `ReinstallModal` (built on `@aleph-front/core`'s `Modal`) before firing it. The button lives in the shared `ManageEntityHeader`, exposed only by the standard-instance page.

**Scope:** Standard instances only (`ManageInstance`). GPU instances, confidential VMs, and functions are intentionally **not** touched — `ManageEntityHeader`'s `showReinstall` prop defaults to `false`, so those pages keep the current behaviour by omission.

**Tech Stack:** Next.js Pages Router, TypeScript, styled-components + twin.macro, `@aleph-front/core` component library, npm. The repo has **no test framework** — verification is `npx tsc --noEmit`, `npm run lint`, `npm run build`, and manual smoke testing.

---

## Notes for the executor

- Repo root: `~/repos/front-aleph-cloud-page`. All paths below are repo-root-relative.
- **Before Task 1:** create the working branch from the credits branch:
  ```bash
  git checkout feat/credits-ui
  git pull --ff-only origin feat/credits-ui
  git checkout -b feat/instance-reinstall-action
  ```
  The PR for this work targets `feat/credits-ui`, not `main`.
- Commands run from the repo root: `npx tsc --noEmit` (type check), `npm run lint` (`next lint`), `npm run build`.
- There is no test framework and no test files — do not add tests; verify with the type checker, linter, and build.
- Commit after each task with the message given.
- Reinstall is **destructive** (full disk wipe, OS reinstall from base image). The type-to-confirm modal is a required part of the feature, not optional polish.

---

## Task 1: Add `reinstall` to the `ExecutableOperations` type

**Files:**
- Modify: `src/domain/executable.ts` (the `ExecutableOperations` type, around lines 148-154)

- [ ] **Step 1: Add the operation to the union**

Find this type in `src/domain/executable.ts`:

```ts
export type ExecutableOperations =
  | 'reboot'
  | 'expire'
  | 'erase'
  | 'stop'
  | 'update'
```

Replace it with:

```ts
export type ExecutableOperations =
  | 'reboot'
  | 'reinstall'
  | 'expire'
  | 'erase'
  | 'stop'
  | 'update'
```

`ExecutableOperations` is a project-local type. `sendPostOperation` (same file) uses the operation value directly as the URL path segment in `POST {hostname}/control/machine/{vmId}/{operation}` — adding `'reinstall'` to the union is the only SDK-layer change needed; no new method.

- [ ] **Step 2: Type check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/domain/executable.ts
git commit -m "feat: add reinstall to ExecutableOperations"
```

---

## Task 2: Add the reinstall action to `useExecutableActions`

**Files:**
- Modify: `src/hooks/common/useExecutableActions.ts`

This mirrors the existing `reboot` action exactly: a loading-state flag, a `disabled` memo, a handler that delegates to `handleSendOperation`, and three new entries on the return type and return object.

- [ ] **Step 1: Add the `reinstallLoading` state flag**

Find the loading-state block (around lines 97-101):

```ts
  // Loading states
  const [stopLoading, setStopLoading] = useState(false)
  const [startLoading, setStartLoading] = useState(false)
  const [rebootLoading, setRebootLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
```

Replace it with:

```ts
  // Loading states
  const [stopLoading, setStopLoading] = useState(false)
  const [startLoading, setStartLoading] = useState(false)
  const [rebootLoading, setRebootLoading] = useState(false)
  const [reinstallLoading, setReinstallLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
```

- [ ] **Step 2: Add the `reinstallDisabled` memo**

Find the `rebootDisabled` memo (around lines 298-309):

```ts
  const rebootDisabled = useMemo(() => {
    if (!crn) return true

    switch (calculatedStatus) {
      case 'v1':
        return !isAllocated
      case 'running':
        return false
      default:
        return true
    }
  }, [calculatedStatus, crn, isAllocated])
```

Immediately **after** it, add an identical memo for reinstall (reinstall, like reboot, requires a running, allocated instance):

```ts
  const reinstallDisabled = useMemo(() => {
    if (!crn) return true

    switch (calculatedStatus) {
      case 'v1':
        return !isAllocated
      case 'running':
        return false
      default:
        return true
    }
  }, [calculatedStatus, crn, isAllocated])
```

- [ ] **Step 3: Add the `handleReinstall` handler**

Find the `handleReboot` callback (around lines 321-324):

```ts
  const handleReboot = useCallback(
    () => handleSendOperation('reboot', setRebootLoading),
    [handleSendOperation],
  )
```

Immediately **after** it, add:

```ts
  const handleReinstall = useCallback(
    () => handleSendOperation('reinstall', setReinstallLoading),
    [handleSendOperation],
  )
```

- [ ] **Step 4: Extend the return type**

Find the `UseExecutableActionsReturn` type (lines 46-66). It currently contains, among others:

```ts
  rebootDisabled: boolean
  deleteDisabled: boolean
  logsDisabled: boolean
  stopLoading: boolean
  startLoading: boolean
  rebootLoading: boolean
  deleteLoading: boolean
  streamDetails?: StreamPaymentDetails
  handleStop: () => void
  handleStart: () => void
  handleReboot: () => void
  handleDelete: () => void
```

Replace that span with (three additions — `reinstallDisabled`, `reinstallLoading`, `handleReinstall`):

```ts
  rebootDisabled: boolean
  reinstallDisabled: boolean
  deleteDisabled: boolean
  logsDisabled: boolean
  stopLoading: boolean
  startLoading: boolean
  rebootLoading: boolean
  reinstallLoading: boolean
  deleteLoading: boolean
  streamDetails?: StreamPaymentDetails
  handleStop: () => void
  handleStart: () => void
  handleReboot: () => void
  handleReinstall: () => void
  handleDelete: () => void
```

- [ ] **Step 5: Extend the return object**

Find the `return { ... }` block at the end of the hook (lines 451-471):

```ts
  return {
    logs,
    nodeDetails,
    streamDetails,
    status,
    calculatedStatus,
    isAllocated,
    stopDisabled,
    startDisabled,
    rebootDisabled,
    deleteDisabled,
    logsDisabled: !logs,
    stopLoading,
    startLoading,
    rebootLoading,
    deleteLoading,
    handleStop,
    handleStart,
    handleReboot,
    handleDelete,
  }
```

Replace it with:

```ts
  return {
    logs,
    nodeDetails,
    streamDetails,
    status,
    calculatedStatus,
    isAllocated,
    stopDisabled,
    startDisabled,
    rebootDisabled,
    reinstallDisabled,
    deleteDisabled,
    logsDisabled: !logs,
    stopLoading,
    startLoading,
    rebootLoading,
    reinstallLoading,
    deleteLoading,
    handleStop,
    handleStart,
    handleReboot,
    handleReinstall,
    handleDelete,
  }
```

- [ ] **Step 6: Type check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 7: Commit**

```bash
git add src/hooks/common/useExecutableActions.ts
git commit -m "feat: add reinstall action to useExecutableActions"
```

---

## Task 3: Add the Reinstall button to `ManageEntityHeader`

**Files:**
- Modify: `src/components/common/entityData/ManageEntityHeader/types.ts`
- Modify: `src/components/common/entityData/ManageEntityHeader/cmp.tsx`

`ManageEntityHeader` is shared by the instance, GPU-instance, confidential, and function manage pages. The new `showReinstall` prop defaults to `false`, so only the page that passes it (the standard-instance page, Task 6) shows the button. The other pages are unaffected.

- [ ] **Step 1: Add the reinstall props to `types.ts`**

In `src/components/common/entityData/ManageEntityHeader/types.ts`, find the Reboot action block (lines 30-34):

```ts
  // Reboot action
  showReboot?: boolean
  rebootDisabled?: boolean
  rebootLoading?: boolean
  onReboot?: () => void
```

Immediately **after** it, add:

```ts

  // Reinstall action
  showReinstall?: boolean
  reinstallDisabled?: boolean
  reinstallLoading?: boolean
  onReinstall?: () => void
```

- [ ] **Step 2: Destructure the new props in `cmp.tsx`**

In `src/components/common/entityData/ManageEntityHeader/cmp.tsx`, find the Reboot destructuring (lines 39-43):

```tsx
  // Reboot action
  showReboot = false,
  rebootDisabled,
  rebootLoading = false,
  onReboot: handleReboot,
```

Immediately **after** it, add:

```tsx
  // Reinstall action
  showReinstall = false,
  reinstallDisabled,
  reinstallLoading = false,
  onReinstall: handleReinstall,
```

- [ ] **Step 3: Add the Reinstall button block**

In the same file, find the end of the `showReboot` button block and the start of the `showDownload` block (around lines 175-177):

```tsx
            )}

            {showDownload && (
```

Insert the Reinstall block between them, so it reads:

```tsx
            )}

            {showReinstall && (
              <Tooltip
                content={`Reinstall ${type}`}
                my="bottom-center"
                at="top-center"
              >
                <Button
                  kind="functional"
                  variant="error"
                  size="sm"
                  onClick={handleReinstall}
                  disabled={
                    reinstallDisabled || reinstallLoading || cannotStart
                  }
                >
                  {reinstallLoading ? (
                    <RotatingLines
                      strokeColor={theme.color.base2}
                      width=".8rem"
                    />
                  ) : (
                    <Icon name="arrow-rotate-forward" />
                  )}
                </Button>
              </Tooltip>
            )}

            {showDownload && (
```

Notes:
- `variant="error"` (red) signals the destructive nature, matching the Delete button.
- `Icon name="arrow-rotate-forward"` is the forward-rotation counterpart of Reboot's `arrow-rotate-backward`. After Step 4, visually confirm the icon renders (it is a FontAwesome name in the `@aleph-front/core` set); if it renders blank, fall back to `arrow-rotate-backward`.
- The `disabled` guard mirrors the Reboot button (`cannotStart` is the shared insufficient-credits guard).

- [ ] **Step 4: Type check and lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/common/entityData/ManageEntityHeader/types.ts src/components/common/entityData/ManageEntityHeader/cmp.tsx
git commit -m "feat: add reinstall button to ManageEntityHeader"
```

---

## Task 4: Create the `ReinstallModal` type-to-confirm component

**Files:**
- Create: `src/components/common/ReinstallModal/cmp.tsx`

A controlled modal built on `@aleph-front/core`'s `Modal`. The parent owns the `open` state; the modal owns the typed-confirmation text. The Reinstall button is disabled until the user types the instance name exactly. This mirrors the `Modal` usage in `src/components/modals/CreditTransferModal/cmp.tsx` and `ReportIssueModal/cmp.tsx`.

- [ ] **Step 1: Create the component**

Create `src/components/common/ReinstallModal/cmp.tsx`:

```tsx
import React, { memo, useState } from 'react'
import 'twin.macro'
import { Button, Modal, TextGradient, TextInput } from '@aleph-front/core'

export type ReinstallModalProps = {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  instanceName: string
}

export const ReinstallModal = ({
  open,
  onClose,
  onConfirm,
  instanceName,
}: ReinstallModalProps) => {
  const [confirmText, setConfirmText] = useState('')

  const canConfirm = confirmText === instanceName

  const handleClose = () => {
    setConfirmText('')
    onClose()
  }

  const handleConfirm = () => {
    if (!canConfirm) return
    setConfirmText('')
    onConfirm()
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      width="32rem"
      header={
        <div>
          <TextGradient type="h6" forwardedAs="h2" tw="mb-2">
            Reinstall instance?
          </TextGradient>
          <p tw="m-0">
            This wipes the instance disk and reinstalls the OS from the base
            image. All data on the VM will be permanently lost. This cannot be
            undone.
          </p>
        </div>
      }
      content={
        <div tw="flex flex-col gap-2 px-4">
          <p className="tp-body3 text-base2" tw="m-0">
            Type <strong>{instanceName}</strong> to confirm:
          </p>
          <TextInput
            name="reinstall-confirm"
            value={confirmText}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setConfirmText(e.target.value)
            }
            placeholder={instanceName}
          />
        </div>
      }
      footer={
        <div tw="flex justify-between items-center">
          <Button variant="textOnly" size="sm" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            kind="functional"
            variant="error"
            size="md"
            onClick={handleConfirm}
            disabled={!canConfirm}
          >
            Reinstall
          </Button>
        </div>
      }
    />
  )
}
ReinstallModal.displayName = 'ReinstallModal'

export default memo(ReinstallModal)
```

Behaviour: `confirmText` resets to `''` on both Cancel and a successful confirm, so reopening the modal always starts blank. `handleConfirm` is a no-op unless the typed text matches, in addition to the button being `disabled` — belt and suspenders.

- [ ] **Step 2: Type check and lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/common/ReinstallModal/cmp.tsx
git commit -m "feat: add ReinstallModal type-to-confirm component"
```

---

## Task 5: Wire the reinstall modal state into `useManageInstance`

**Files:**
- Modify: `src/components/pages/console/instance/ManageInstance/hook.ts`

`useManageInstance` already spreads `manageInstanceEntityProps`, which (after Task 2) includes `handleReinstall`, `reinstallLoading`, and `reinstallDisabled`. This task adds the modal open/close state and a confirm handler that fires the reinstall and closes the modal.

- [ ] **Step 1: Extend the return type**

In `src/components/pages/console/instance/ManageInstance/hook.ts`, find the `UseManageInstanceReturn` type (lines 15-22):

```ts
export type UseManageInstanceReturn = UseManageInstanceEntityReturn & {
  instance?: Instance
  instanceManager?: InstanceManager
  ports: ForwardedPort[]
  sshForwardedPort?: string
  handlePortsChange: (ports: ForwardedPort[]) => void
  creditBalance?: number
}
```

Replace it with:

```ts
export type UseManageInstanceReturn = UseManageInstanceEntityReturn & {
  instance?: Instance
  instanceManager?: InstanceManager
  ports: ForwardedPort[]
  sshForwardedPort?: string
  handlePortsChange: (ports: ForwardedPort[]) => void
  creditBalance?: number
  isReinstallModalOpen: boolean
  handleOpenReinstallModal: () => void
  handleCloseReinstallModal: () => void
  handleConfirmReinstall: () => void
}
```

- [ ] **Step 2: Add the modal state and handlers**

In the same file, find the `handlePortsChange` handler (lines 65-68):

```ts
  // Handler to update ports
  const handlePortsChange = (updatedPorts: ForwardedPort[]) => {
    setPorts(updatedPorts)
  }
```

Immediately **after** it, add:

```ts

  // Reinstall confirmation modal
  const { handleReinstall } = manageInstanceEntityProps

  const [isReinstallModalOpen, setIsReinstallModalOpen] = useState(false)

  const handleOpenReinstallModal = () => setIsReinstallModalOpen(true)
  const handleCloseReinstallModal = () => setIsReinstallModalOpen(false)
  const handleConfirmReinstall = () => {
    setIsReinstallModalOpen(false)
    handleReinstall()
  }
```

`useState` is already imported in this file. `handleReinstall` comes from `manageInstanceEntityProps` (typed by `UseManageInstanceEntityReturn`, which extends `UseExecutableActionsReturn` — extended in Task 2).

- [ ] **Step 3: Extend the return object**

In the same file, find the `return { ... }` block (lines 70-78):

```ts
  return {
    instance,
    instanceManager,
    ports,
    sshForwardedPort,
    handlePortsChange,
    creditBalance,
    ...manageInstanceEntityProps,
  }
```

Replace it with:

```ts
  return {
    instance,
    instanceManager,
    ports,
    sshForwardedPort,
    handlePortsChange,
    creditBalance,
    isReinstallModalOpen,
    handleOpenReinstallModal,
    handleCloseReinstallModal,
    handleConfirmReinstall,
    ...manageInstanceEntityProps,
  }
```

- [ ] **Step 4: Type check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/pages/console/instance/ManageInstance/hook.ts
git commit -m "feat: wire reinstall modal state into useManageInstance"
```

---

## Task 6: Wire the Reinstall action into the `ManageInstance` page

**Files:**
- Modify: `src/components/pages/console/instance/ManageInstance/cmp.tsx`

- [ ] **Step 1: Import the modal**

In `src/components/pages/console/instance/ManageInstance/cmp.tsx`, find the import of `NewDomainForm` (line 24):

```tsx
import NewDomainForm from '@/components/common/NewDomainForm'
```

Immediately **after** it, add:

```tsx
import ReinstallModal from '@/components/common/ReinstallModal/cmp'
```

- [ ] **Step 2: Destructure the new values from the hook**

Find the Reboot action group in the destructuring (lines 73-78):

```tsx
    rebootDisabled,
    rebootLoading,
    handleReboot,
    deleteDisabled,
    deleteLoading,
    handleDelete,
```

Replace it with:

```tsx
    rebootDisabled,
    rebootLoading,
    handleReboot,
    reinstallDisabled,
    reinstallLoading,
    deleteDisabled,
    deleteLoading,
    handleDelete,

    // Reinstall modal
    isReinstallModalOpen,
    handleOpenReinstallModal,
    handleCloseReinstallModal,
    handleConfirmReinstall,
```

(`reinstallDisabled` and `reinstallLoading` flow through from `useExecutableActions`; `name` is already destructured higher up.)

- [ ] **Step 3: Pass the reinstall props to `ManageEntityHeader`**

Find the Reboot action props on `<ManageEntityHeader>` (lines 131-135):

```tsx
        // Reboot action
        showReboot
        rebootDisabled={rebootDisabled}
        rebootLoading={rebootLoading}
        onReboot={handleReboot}
```

Replace it with:

```tsx
        // Reboot action
        showReboot
        rebootDisabled={rebootDisabled}
        rebootLoading={rebootLoading}
        onReboot={handleReboot}
        // Reinstall action
        showReinstall
        reinstallDisabled={reinstallDisabled}
        reinstallLoading={reinstallLoading}
        onReinstall={handleOpenReinstallModal}
```

- [ ] **Step 4: Render the modal**

Find the closing `</SidePanel>` near the end of the component (line 244):

```tsx
      </SidePanel>
    </>
  )
}
```

Replace it with:

```tsx
      </SidePanel>

      <ReinstallModal
        open={isReinstallModalOpen}
        onClose={handleCloseReinstallModal}
        onConfirm={handleConfirmReinstall}
        instanceName={name}
      />
    </>
  )
}
```

- [ ] **Step 5: Type check, lint, build**

Run: `npx tsc --noEmit && npm run lint && npm run build`
Expected: all pass — no type errors, no lint errors, build succeeds.

- [ ] **Step 6: Commit**

```bash
git add src/components/pages/console/instance/ManageInstance/cmp.tsx
git commit -m "feat: wire reinstall action into the instance manage page"
```

---

## Task 7: Final verification

**Files:** none (verification only).

- [ ] **Step 1: Type check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 2: Lint**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 4: Manual smoke test**

Run `npm run dev`, connect a wallet that owns a credit-paid instance, and open that instance's manage page (`/console/computing/instance/[hash]`):
- The Reinstall button (red, rotate icon) appears in the header, between Reboot and Delete.
- It is enabled only when the instance is running; disabled otherwise (same as Reboot).
- Clicking it opens the type-to-confirm modal. The modal's Reinstall button stays disabled until the instance name is typed exactly; Cancel closes it and clears the field.
- Confirming closes the modal, fires the operation, and the header Reinstall button shows its loading spinner.
- A failed operation surfaces an error notification.
- Open a GPU-instance, confidential, and function manage page and confirm **no** Reinstall button appears there.

- [ ] **Step 5: Commit the plan document**

```bash
git add docs/plans/2026-05-22-instance-reinstall-action-plan.md
git commit -m "docs: add instance reinstall action plan"
```

If `docs/` in this repo contains an architecture or decisions log, add a short note there describing the reinstall action; otherwise this step is just committing the plan.

---

## Self-review notes

- **Spec coverage:** SDK type (Task 1), action hook (Task 2), shared header button (Task 3), type-to-confirm modal (Task 4), modal state (Task 5), page wiring (Task 6), verification (Task 7). All layers from the investigation are covered.
- **Scope boundary:** `showReinstall` defaults to `false` in `ManageEntityHeader`; only `ManageInstance/cmp.tsx` passes it. GPU/confidential/function pages are untouched — verified in Task 7 Step 4.
- **Type consistency:** `reinstallDisabled`, `reinstallLoading`, `handleReinstall` are defined on `UseExecutableActionsReturn` (Task 2) and consumed unchanged in Tasks 3/5/6. `ReinstallModalProps` (`open`, `onClose`, `onConfirm`, `instanceName`) defined in Task 4 and matched exactly in Task 6 Step 4. The modal is imported via the direct `/cmp` path (matching the `SidePanel` import convention in the same file) — no `index.ts` needed.
- **No test steps:** the repo has no test framework; verification is the type checker, linter, build, and manual smoke test.
