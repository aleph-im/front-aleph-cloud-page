# Reinstall Auto-Allocate + Stepped Notification — Design

**Date:** 2026-05-22
**Branch:** `feat/instance-reinstall-action`
**Status:** Approved

## Problem

The instance Reinstall action (standard + GPU instances) currently sends a
single `reinstall` CRN control operation. The CRN wipes the disk, reinstalls
the OS, and leaves the VM **not-allocated** — so the user has to click **Start**
manually afterwards. Instance *creation*, by contrast, installs *and*
auto-allocates in one flow. Reinstall should behave the same way, and should
surface progress as a stepped notification rather than just a button spinner.

## Goal

After the user confirms the reinstall, the instance is reinstalled **and**
brought back to running automatically, with a two-step progress notification
in the bottom-right corner.

## Approach

`handleReinstall` in `src/hooks/common/useExecutableActions.ts` stops being a
thin `handleSendOperation('reinstall', ...)` wrapper and becomes a dedicated
orchestrated callback — the same shape as `handleStart` and `handleDelete`.

It drives a two-phase sequence and renders the existing `CheckoutNotification`
stepped toast via the already-imported `useCheckoutNotification` hook.

Rejected alternatives:
- **Chain `handleReinstall` → `handleStart()`** — `handleStart` owns its own
  loading state and error toast, so a single stepped notification can't wrap
  both phases cleanly.
- **Custom progress toast** — reinvents `CheckoutNotification`, which already
  exists and is used by every deploy/delete flow.

## Behavior

When the user confirms the `ReinstallModal`, `handleReinstall` runs:

1. **Reinstalling** — `sendPostOperation('reinstall')`. The CRN wipes the disk
   and reinstalls the OS.
2. **Starting up** — the network-compatibility check (`checkNetworkCompatibility`),
   then `notifyCRNAllocation(crn, executable.id)` — the same call behind the
   Start button — then `triggerBoostPolling({ expectedStatuses: ['running'] })`
   to watch the VM boot.

Throughout the sequence:
- The header Reinstall button shows its spinner via `reinstallLoading`.
- A bottom-right toast shows the two numbered steps with the active one
  highlighted.

On success the toast closes (`stop()`), `reinstallLoading` clears once status
polling reaches `running`, and the instance is running — no manual Start.

## Stepped notification

Two custom steps are passed directly to `useCheckoutNotification`'s `next()` as
`{ title, content }` objects. The `CheckoutStepType` enum and `stepsCatalog` are
**not** extended — `next()` accepts an explicit `steps` array.

| Step | Title | Content |
|------|-------|---------|
| 1 | `Reinstalling` | Wiping the instance disk and reinstalling the OS from the base image. |
| 2 | `Starting up` | Notifying the CRN to allocate and boot the reinstalled instance. |

`next(steps)` is called before each phase: the first call shows step 1 active,
the second shows step 2 active. `stop()` closes the toast on success.

## Error handling

Each phase runs inside the orchestrated callback's `try`. On any failure:
- An error toast appears (`noti.add({ variant: 'error', ... })`) with the
  error message.
- The stepped toast stays visible on the failed step — `stop()` is **not**
  called — so it is clear which phase broke.
- `reinstallLoading` is cleared so the header button is usable again.

The `useCheckoutNotification` step counter (`step.current`) is reset at the
**start** of each `handleReinstall` run, so a retry after a failure starts
clean even though the previous run left its toast open.

A step-2 failure leaves the instance reinstalled-but-not-allocated; the user
can click **Start** to retry just the allocation. The reinstall itself is not
repeated.

## Scope

In scope:
- Rewrite `handleReinstall` in `src/hooks/common/useExecutableActions.ts`.
- Reset logic for the checkout-notification step counter at run start.
- Minor `ReinstallModal` copy update: the instance is reinstalled *and
  restarted automatically* (drop any wording implying a manual start step).

Out of scope (unchanged from the original reinstall plan):
- `ReinstallModal` type-to-confirm component.
- The `showReinstall` button in `ManageEntityHeader`.
- Page wiring in `ManageInstance` and `ManageGpuInstance`.
- `reinstall` in the `ExecutableOperations` union.

Applies to both standard and GPU instances — both consume `useExecutableActions`.

## Verification

No test framework in the repo. Verify with `npx tsc --noEmit`, `npm run lint`,
`npm run build`, and a manual smoke test:
- Confirm a reinstall on a running instance; the two-step toast appears
  bottom-right and advances Reinstalling → Starting up.
- The instance returns to running without a manual Start.
- Force a step-2 failure (e.g. wrong network) and confirm the error toast
  appears and the stepped toast stays on the failed step.
