# Reinstall Auto-Allocate + Stepped Notification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** After a user confirms an instance reinstall, the instance is reinstalled **and** brought back to running automatically, with a two-step progress notification in the bottom-right corner.

**Architecture:** `handleReinstall` in `useExecutableActions.ts` stops being a thin `handleSendOperation('reinstall', ...)` wrapper and becomes a dedicated orchestrated callback — the same shape as `handleStart` and `handleDelete`. It drives two phases (`sendPostOperation('reinstall')` then `notifyCRNAllocation()`) and renders the existing `CheckoutNotification` stepped toast via `useCheckoutNotification`. A new `reset` function on `useCheckoutNotification` clears the step counter at the start of each run so a retry after a failure is clean.

**Tech Stack:** Next.js Pages Router, TypeScript, React hooks, `@aleph-front/core`, npm.

---

## Notes for the executor

- Repo root: `~/repos/front-aleph-cloud-page`. All paths below are repo-root-relative.
- **Work on the branch `feat/instance-reinstall-action`** — it already contains the base reinstall feature (button, modal, page wiring). Confirm with `git branch --show-current` before Task 1; if it prints something else, run `git checkout feat/instance-reinstall-action`.
- This plan builds on the base reinstall feature. The `ReinstallModal`, the `showReinstall` header button, the `ExecutableOperations` union, and the page wiring already exist and are **not** changed except for one copy edit in Task 3.
- The repo has **no test framework** and no test files — do not add tests. Verify each task with `npx tsc --noEmit` and `npm run lint`; the final task adds `npm run build` and a manual smoke test.
- `npm run build` currently fails on **5 pre-existing type errors** in `src/domain/file.ts`, `src/domain/volume.ts`, and `src/domain/website.ts` (`payment` not in `StorePublishConfiguration`). These are unrelated to this work and exist on the base branch. When verifying, filter them out:
  ```bash
  npx tsc --noEmit 2>&1 | grep -v -E 'src/domain/(file|volume|website)\.ts'
  ```
  A clean result from that filtered command means no new type errors.
- Commit after each task with the message given.

---

## Task 1: Add a `reset` function to `useCheckoutNotification`

**Files:**
- Modify: `src/hooks/form/useCheckoutNotification.tsx`

`useCheckoutNotification` keeps a `step` counter in a `useRef`. `stop()` resets it to `0`, but `stop()` also deletes the toast and sleeps 2 seconds — it is the success-path teardown. The reinstall flow needs to reset the counter **without** the sleep, and to clear any toast left open by a previously failed run, at the start of each run. `stop()` cannot do that. Add a dedicated `reset`.

- [ ] **Step 1: Add `reset` to the return type**

In `src/hooks/form/useCheckoutNotification.tsx`, find the `UseCheckoutNotificationReturn` type (lines 19-24):

```ts
export type UseCheckoutNotificationReturn = {
  next: (newSteps?: UseCheckoutNotificationSteps) => Promise<void>
  stop: () => Promise<void>
  // @todo: Export types form core
  noti?: any
}
```

Replace it with:

```ts
export type UseCheckoutNotificationReturn = {
  next: (newSteps?: UseCheckoutNotificationSteps) => Promise<void>
  stop: () => Promise<void>
  reset: () => void
  // @todo: Export types form core
  noti?: any
}
```

- [ ] **Step 2: Add the `handleReset` callback**

In the same file, find the `handleStop` callback (lines 61-68):

```ts
  const handleStop = useCallback(async () => {
    if (!noti) throw Err.NotificationsNotReady

    step.current = 0
    noti.del(stepsNotiId)

    await sleep(2000)
  }, [noti])
```

Immediately **after** it, add:

```ts

  const handleReset = useCallback(() => {
    step.current = 0
    noti?.del(stepsNotiId)
  }, [noti])
```

`handleReset` is synchronous and safe to call when `noti` is not ready (it just resets the counter). Unlike `handleStop`, it does not sleep — it is meant to run at the start of a flow, not as teardown.

- [ ] **Step 3: Return `reset`**

In the same file, find the return block (lines 70-74):

```ts
  return {
    next: handleNext,
    stop: handleStop,
    noti,
  }
```

Replace it with:

```ts
  return {
    next: handleNext,
    stop: handleStop,
    reset: handleReset,
    noti,
  }
```

- [ ] **Step 4: Type check and lint**

Run: `npx tsc --noEmit 2>&1 | grep -v -E 'src/domain/(file|volume|website)\.ts'`
Expected: no output (no new type errors).

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/hooks/form/useCheckoutNotification.tsx
git commit -m "feat: add reset function to useCheckoutNotification"
```

---

## Task 2: Rewrite `handleReinstall` as an orchestrated two-step flow

**Files:**
- Modify: `src/hooks/common/useExecutableActions.ts`

`handleReinstall` is currently a thin wrapper (lines 343-346) that calls `handleSendOperation('reinstall', setReinstallLoading)`. Replace it with a dedicated callback that runs the reinstall, then the CRN allocation, showing a two-step toast. The new callback needs `next`, `stop`, and `reset` from `useCheckoutNotification`, which is called lower in the file (line 359) — so the thin wrapper is removed from its current location and the full callback is added **after** the `useCheckoutNotification` call.

- [ ] **Step 1: Import the `UseCheckoutNotificationSteps` type**

In `src/hooks/common/useExecutableActions.ts`, find the `useCheckoutNotification` import (lines 22-25):

```ts
import {
  stepsCatalog,
  useCheckoutNotification,
} from '../form/useCheckoutNotification'
```

Replace it with:

```ts
import {
  stepsCatalog,
  useCheckoutNotification,
  UseCheckoutNotificationSteps,
} from '../form/useCheckoutNotification'
```

- [ ] **Step 2: Remove the thin `handleReinstall` wrapper**

In the same file, find the current `handleReinstall` (lines 343-346):

```ts
  const handleReinstall = useCallback(
    () => handleSendOperation('reinstall', setReinstallLoading),
    [handleSendOperation],
  )
```

Delete those four lines entirely. (`handleReboot` directly above it stays; `handleReinstall` is re-added in Step 4.) After this deletion the block reads:

```ts
  const handleReboot = useCallback(
    () => handleSendOperation('reboot', setRebootLoading),
    [handleSendOperation],
  )

  // ----------- LOGS
```

- [ ] **Step 3: Destructure `reset` from `useCheckoutNotification`**

In the same file, find the `useCheckoutNotification` call (line 359):

```ts
  const { next, stop } = useCheckoutNotification({})
```

Replace it with:

```ts
  const { next, stop, reset } = useCheckoutNotification({})
```

- [ ] **Step 4: Add the full `handleReinstall` callback**

In the same file, immediately **after** the line from Step 3 (the `useCheckoutNotification` call) and **before** the `handleDelete` callback (`const handleDelete = useCallback(async () => {`), insert:

```ts

  // ----------- REINSTALL

  const handleReinstall = useCallback(async () => {
    const reinstallSteps: UseCheckoutNotificationSteps = [
      {
        title: 'Reinstalling',
        content:
          'Wiping the instance disk and reinstalling the OS from the base image.',
      },
      {
        title: 'Starting up',
        content:
          'Notifying the CRN to allocate and boot the reinstalled instance.',
      },
    ]

    try {
      if (!manager) throw Err.ConnectYourWallet
      if (!executable) throw Err.InstanceNotFound
      if (!nodeUrl) throw Err.InvalidNode
      if (!crn) throw Err.InvalidCRNAddress

      setReinstallLoading(true)
      reset()

      // Step 1: reinstall the OS
      await next(reinstallSteps)
      await manager.sendPostOperation({
        hostname: nodeUrl,
        operation: 'reinstall',
        vmId: executable.id,
      })

      // Step 2: re-allocate so the instance boots back up
      await next(reinstallSteps)

      const incompatibleNetwork = checkNetworkCompatibility(
        executable.payment?.chain,
      )
      if (incompatibleNetwork) {
        throw Err.NetworkMismatch(incompatibleNetwork)
      }

      await manager.notifyCRNAllocation(crn, executable.id)

      triggerBoostPolling({
        expectedStatuses: ['running'],
        onComplete: () => setReinstallLoading(false),
      })

      await stop()
    } catch (e) {
      setReinstallLoading(false)
      noti?.add({
        variant: 'error',
        title: 'Error',
        text: (e as Error)?.message,
      })
    }
  }, [
    manager,
    executable,
    nodeUrl,
    crn,
    next,
    stop,
    reset,
    checkNetworkCompatibility,
    triggerBoostPolling,
    noti,
  ])
```

Notes:
- Preconditions throw **inside** the `try`, so a missing wallet/node/CRN surfaces as an error toast rather than an unhandled rejection.
- `reset()` clears the step counter and any toast left open by a prior failed run, so each run starts at step 1.
- Each `next(reinstallSteps)` call advances the toast: the first shows "Reinstalling" active, the second shows "Starting up" active.
- On success, `triggerBoostPolling` clears `reinstallLoading` once the instance reaches `running`, and `await stop()` closes the toast.
- On any failure, `stop()` is **not** reached, so the toast stays visible on the step that failed, alongside the error toast. `reinstallLoading` is cleared so the header button is usable again.
- `setReinstallLoading` is a stable `useState` setter and is intentionally omitted from the dependency array, matching `handleStart`/`handleDelete` in this file.

- [ ] **Step 5: Type check and lint**

Run: `npx tsc --noEmit 2>&1 | grep -v -E 'src/domain/(file|volume|website)\.ts'`
Expected: no output (no new type errors).

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add src/hooks/common/useExecutableActions.ts
git commit -m "feat: auto-allocate and show stepped notification on reinstall"
```

---

## Task 3: Update the `ReinstallModal` copy

**Files:**
- Modify: `src/components/common/ReinstallModal/cmp.tsx`

The modal currently implies the reinstall just wipes the disk. Now that the instance restarts automatically, say so.

- [ ] **Step 1: Update the header description**

In `src/components/common/ReinstallModal/cmp.tsx`, find the description paragraph in the modal `header`:

```tsx
          <p tw="m-0">
            This wipes the instance disk and reinstalls the OS from the base
            image. All data on the VM will be permanently lost. This cannot be
            undone.
          </p>
```

Replace it with:

```tsx
          <p tw="m-0">
            This wipes the instance disk, reinstalls the OS from the base
            image, and restarts the instance automatically. All data on the VM
            will be permanently lost. This cannot be undone.
          </p>
```

- [ ] **Step 2: Type check and lint**

Run: `npx tsc --noEmit 2>&1 | grep -v -E 'src/domain/(file|volume|website)\.ts'`
Expected: no output (no new type errors).

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/common/ReinstallModal/cmp.tsx
git commit -m "docs: note auto-restart in ReinstallModal copy"
```

---

## Task 4: Final verification

**Files:** none (verification only).

- [ ] **Step 1: Type check**

Run: `npx tsc --noEmit 2>&1 | grep -v -E 'src/domain/(file|volume|website)\.ts'`
Expected: no output. (The 5 unfiltered errors in `file.ts`/`volume.ts`/`website.ts` are pre-existing and unrelated — see "Notes for the executor".)

- [ ] **Step 2: Lint**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: the build still fails **only** on the 5 pre-existing `StorePublishConfiguration` type errors in `src/domain/file.ts`, `src/domain/volume.ts`, `src/domain/website.ts`. No errors in any file touched by this plan (`useCheckoutNotification.tsx`, `useExecutableActions.ts`, `ReinstallModal/cmp.tsx`). If a touched file appears in the build output, fix it before continuing.

- [ ] **Step 4: Manual smoke test**

Run `npm run dev`, connect a wallet that owns a running instance, and open that instance's manage page:
- Click **Reinstall**, type the instance name, confirm.
- A two-step toast appears bottom-right and advances **Reinstalling → Starting up**; the header Reinstall button shows its spinner throughout.
- On success the toast closes and the instance returns to **running** with no manual Start click.
- Repeat on a **GPU instance** manage page — same behaviour (both pages use `useExecutableActions`).
- Force a step-2 failure (e.g. switch the wallet to a different network before confirming): an error toast appears, and the stepped toast stays visible on the **Starting up** step.

- [ ] **Step 5: Commit the plan and spec documents**

```bash
git add docs/superpowers/plans/2026-05-22-reinstall-auto-allocate.md
git commit -m "docs: add reinstall auto-allocate implementation plan"
```

(The design spec `docs/superpowers/specs/2026-05-22-reinstall-auto-allocate-design.md` is already committed.)

---

## Self-review notes

- **Spec coverage:** auto-allocate after reinstall (Task 2, Step 4 — `notifyCRNAllocation`); two-step bottom-right notification (Task 2 — `reinstallSteps` + `next`); step-counter reset at run start (Task 1 + Task 2 `reset()` call); error toast + toast stays on failed step (Task 2 catch block, no `stop()` on error); modal copy update (Task 3). All spec sections are covered.
- **Type consistency:** `UseCheckoutNotificationSteps` is imported in Task 2 Step 1 and used in Task 2 Step 4. `reset` is defined on `UseCheckoutNotificationReturn` in Task 1 Step 1, returned in Task 1 Step 3, and consumed in Task 2 Steps 3-4. `reinstallSteps` entries use `{ title, content }`, matching the `stepsCatalog` entry shape in the same file.
- **Scope:** confined to three files. The base reinstall feature (button, modal structure, page wiring, `ExecutableOperations`) is untouched except the one copy edit in Task 3. Applies to standard and GPU instances because both consume `useExecutableActions`.
- **No tests:** the repo has no test framework; verification is the type checker, linter, build, and manual smoke test.
