# CRN `reinstall` operation leaves the instance networkless

**Date:** 2026-05-22
**Reported by:** console frontend testing (`feat/instance-reinstall-action`)
**Component:** CRN — `POST /control/machine/{vmId}/reinstall`
**Severity:** High — results in loss of all network access to a running, paid instance.

## Summary

After issuing a `reinstall` control operation to a CRN, the instance is
re-allocated and its status reports `running`, but the VM has **no working
network**. Neither the instance's public IPv6 nor its IPv4 port-forwarded SSH
port is reachable. SSH access worked on the same instance before the reinstall.

The CRN host itself stays reachable, and the CRN's status API keeps reporting a
valid SSH port mapping (`22 → 24020`) — so the failure is in the VM's network
provisioning, not in the API responses.

## Environment

- **CRN host (IPv4):** `46.247.131.210`
- **Instance public IPv6:** `2a01:240:ad00:2503:3:f999:c7db:7841`
- **SSH port forwarding:** `22 → 24020` (as reported by the CRN status API)
- **Instance name:** `PLANE-BKP`
- **Instance hash / vmId:** _(to be filled in by the reporter — known to the account owner)_
- **Client:** macOS, with working IPv4 and IPv6 connectivity (verified below).

## Reproduction

1. Start from a `running` instance with working SSH access (IPv6 direct and
   IPv4 via port forwarding).
2. Issue `POST /control/machine/{vmId}/reinstall` to the allocation CRN.
3. The instance transitions to `not-allocated`.
4. Re-allocate it (`POST /control/allocation/notify`) — the same call used by
   a normal Start, which works correctly on non-reinstalled instances.
5. The instance status reports `running` again.
6. Attempt SSH.

## Expected

After the reinstall and re-allocation, the instance boots from the base image
with networking restored — the public IPv6 is reachable and the IPv4
port-forwarding rules are re-applied — so SSH access works again, as it did
before the reinstall.

## Actual

The instance reports `running` but is completely unreachable on the network.

### Evidence

SSH worked on this instance **before** the reinstall.

CRN host is reachable:

```
$ ping 46.247.131.210
64 bytes from 46.247.131.210: icmp_seq=0 ttl=55 time=12.633 ms
```

Client has working IPv6:

```
$ ping6 google.com
16 bytes from 2a00:1450:4001:c13::65, icmp_seq=0 hlim=114 time=11.757 ms
```

Instance's public IPv6 — no response at all:

```
$ ping6 2a01:240:ad00:2503:3:f999:c7db:7841
69 packets transmitted, 0 packets received, 100.0% packet loss
```

IPv6 SSH (direct to instance, port 22):

```
ssh: connect to host 2a01:240:ad00:2503:3:f999:c7db:7841 port 22: Network is unreachable
```

IPv4 SSH (CRN host, forwarded port 24020):

```
ssh: connect to host 46.247.131.210 port 24020: Network is unreachable
```

Waiting and retrying after several minutes produced the same result — this is
not a boot-time delay.

## Diagnosis

- The CRN host is up (ICMP reply in ~12 ms).
- The client has working IPv6 (ICMP reply to `google.com` in ~12 ms).
- The instance's **public IPv6 does not answer ICMP at all** (0/69) — so the VM
  has no working network, independent of any port forwarding.
- The IPv4 path returns `Network is unreachable` (not `Connection refused`),
  consistent with the CRN rejecting a port that is not actually forwarded —
  even though the status API still advertises the `22 → 24020` mapping.

The instance is re-allocated and reports `running`, but its networking is never
brought up. Because the public IPv6 is dead, this is not only a
port-forwarding problem — the VM itself has no network after the reinstall.

A normal Start (`/control/allocation/notify` without a preceding reinstall)
produces a fully reachable instance. The only differing step is the
`reinstall` operation, which points at the reinstall path on the CRN.

## Impact

- A reinstalled instance reports `running` but cannot be reached by its owner.
- The reinstall already wipes the disk; combined with this, the user loses both
  their data and all access to the instance, with no recovery path from the
  console.
- This blocks shipping the Reinstall action in the console frontend
  (`feat/instance-reinstall-action`). The frontend correctly sends the
  operation and correctly reports the status the CRN returns; the gap is in the
  CRN's reinstall handling.

## Suggested investigation (CRN side)

- After a `reinstall`, confirm the VM actually boots and brings up its network
  interface (IPv6 address assignment, default route).
- Confirm the port-forwarding rules from the instance's port-forwarding
  aggregate are re-applied to the re-allocated VM.
- Confirm that the status reported as `running` reflects an actually-network-up
  VM, rather than only the allocation/process state.

## Frontend status

`feat/instance-reinstall-action` (Reinstall button, type-to-confirm modal, page
wiring for standard + GPU instances) and the auto-allocate enhancement plan
(`docs/superpowers/plans/2026-05-22-reinstall-auto-allocate.md`) are **parked**
pending the CRN fix. They are not merged.
