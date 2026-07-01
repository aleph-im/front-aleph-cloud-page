import { schedulerApiUrl } from '@/helpers/constants'

export type SchedulerVmStatus =
  | 'scheduled'
  | 'dispatched'
  | 'migrating'
  | 'duplicated'
  | 'misplaced'
  | 'missing'
  | 'orphaned'
  | 'unscheduled'
  | 'unschedulable'
  | 'unknown'

export type SchedulerVmType = 'micro_vm' | 'persistent_program' | 'instance'

// Response shape of GET /api/v1/vms/{vm_hash} (scheduler-api VmResponse).
// `status` is the DERIVED effective status (scheduled = allocated but never
// observed, dispatched = observed on the allocated node, missing = observed
// nowhere); `scheduling_status` is the raw stored status.
export type SchedulerVm = {
  vm_hash: string
  name: string | null
  vm_type: SchedulerVmType
  allocated_node: string | null
  allocated_at: string | null
  observed_nodes: string[] | null
  last_observed_at: string | null
  status: SchedulerVmStatus
  scheduling_status: SchedulerVmStatus | null
  requirements_vcpus: number | null
  requirements_memory_mb: number | null
  requirements_disk_mb: number | null
  payment_type: string | null
  payment_status: 'validated' | 'invalidated' | null
  updated_at: string
  requires_confidential: boolean | null
  gpu_requirements: unknown[] | null
  cpu_architecture: string | null
  cpu_vendor: string | null
  cpu_features: string[] | null
  owner: string | null
  sender: string | null
  migration_target: string | null
  migration_started_at: string | null
}

// Response shape of GET /api/v1/nodes/{node_hash} (scheduler-api
// NodeResponse). Only the fields the console consumes are typed here.
export type SchedulerNode = {
  node_hash: string
  name: string | null
  owner: string | null
  address: string | null
  status: string
  staked: boolean
  supports_ipv6: boolean | null
  confidential_computing_enabled: boolean | null
  payment_receiver: string | null
  vm_count: number
  updated_at: string
}

/**
 * Fetches the scheduler allocation entry for a VM. Returns undefined when the
 * scheduler does not know the VM (404) or the request fails, so callers can
 * fall back to the legacy allocation resolution.
 */
export async function fetchSchedulerVm(
  vmHash: string,
): Promise<SchedulerVm | undefined> {
  try {
    const res = await fetch(`${schedulerApiUrl}/api/v1/vms/${vmHash}`)
    if (!res.ok) return

    return (await res.json()) as SchedulerVm
  } catch {
    return
  }
}

/**
 * Fetches a node record from the scheduler. Returns undefined when the
 * scheduler does not know the node (404) or the request fails. Used to
 * resolve the address of allocated CRNs that are missing from the node
 * collection.
 */
export async function fetchSchedulerNode(
  nodeHash: string,
): Promise<SchedulerNode | undefined> {
  try {
    const res = await fetch(`${schedulerApiUrl}/api/v1/nodes/${nodeHash}`)
    if (!res.ok) return

    return (await res.json()) as SchedulerNode
  } catch {
    return
  }
}
