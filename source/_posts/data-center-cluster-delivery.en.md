---
title: "99% GPU Health Can Leave Only 28% Cluster Capacity"
date: 2026-08-23 10:00:00
lang: en
i18n_key: data-center-cluster-delivery
categories:
  - Investing
tags:
  - AI
  - Data Center
  - Infrastructure
  - Bottleneck
---

The facility has reached Ready for Service (RFS). All 128 GB200 NVL72 racks are powered, and the hardware inventory contains 9,216 GPUs. Rack installation reads 100% complete on the project schedule, while the health dashboard reports 9,124 GPUs as Healthy, roughly 99%.

The hardware-led view has a simple answer: repair the remaining 92 GPUs and the project will have a 100%-Healthy supercluster. Production still cannot accept a percentage. Individually healthy GPUs do not prove that NVLink, the scale-out network, storage paths, and scheduler allocations form one working system.

**Do healthy GPUs make a supercluster?** Production needs to know how many GPUs the scheduler can repeatedly deliver to a particular workload and in what shape.

<!-- more -->

## Why Is There Still No Supercluster After RFS?

RFS closes the facility scope. Power, heat rejection, fire protection, and control systems have reached their delivery criteria. Once the racks power on, the project starts delivering another object: a resource that a workload can use.

[NVIDIA's requirements for AI clouds](https://docs.nvidia.com/dsx/ncp/nvidia-requirements-for-ai-clouds/home) separate Delivered, Healthy, Reserved, and Active/In-Use. Hardware arrival, hardware health, resource reservation, and active workload use are different states. The same requirements track per-host health alongside aggregate status for logical primitives such as clusters, node groups, and reservations.

Each step changes the object being delivered. Racks sit in the asset inventory. Nodes belong to the management plane. Topology blocks are resources the scheduler can reserve. Only a running job reaches Active/In-Use.

## Why Must 9,216 GPUs Become the Same Machine?

A newly installed node begins as a serial number, BMC, MAC address, switch port, and rack position. The project reconciles it with inventory, assigns the software image for its category, and applies the disk layout, kernel, drivers, network configuration, and scheduler registration.

[NVIDIA Base Command Manager](https://docs.nvidia.com/dgx-superpod/administration-guide-dgx-superpod/latest/cluster-management.html) defines a software image as the blueprint for a node's local filesystem. An image can be locked or resynchronized. The first successful boot proves little. The first and thousandth nodes must emerge from the same pipeline in comparable, reproducible states.

One OS image is still insufficient. GPU, NIC, NVLink switch, and management-controller firmware must also match the approved baseline. [NVIDIA Mission Control](https://docs.nvidia.com/mission-control/docs/systems-administration-guide/2.3.0/autonomous-hardware-recovery.html) compares installed firmware with expected versions in a Source of Truth (SOT) file. Test thresholds and other expected values come from the Golden Config File. A version can run and still sit outside the baseline qualified for this cluster.

Provisioning turns 9,216 powered GPUs into baseline-matched nodes. It solves consistency, not how much usable capacity those nodes can form.

## How Can the Same 99% Health Rate Create a 6,480-GPU Gap?

Suppose the health dashboard reports 9,124 Healthy GPUs. The obvious calculation counts all 9,124 as usable compute. The scheduler receives a resource request with a node count and topology constraints, not an instruction to return as many GPUs as possible.

A job waits when enough resources are unavailable. With block topology enabled, the scheduler must place the job inside a contiguous block while limiting fragmentation. [Slurm's topology documentation](https://slurm.schedmd.com/topology.html) states that a node request conflicting with block placement receives no allocation, and nonadjacent blocks cannot be combined for one request.

[NVIDIA's NVL72 Enterprise Reference Architecture](https://docs.nvidia.com/enterprise-reference-architectures/nvl72-ai-factory/latest/overview.html) places 72 GPUs in one NVLink domain. The full rack can behave as one massive GPU, while each compute tray can also run independently. A project may therefore deliver trays, nodes, complete racks, or larger multi-rack blocks. Workload and acceptance scope determine the unit.

Take a strict definition to make the difference visible: the customer requires complete NVL72 racks, and any rack containing an unavailable GPU is temporarily excluded from delivery.

![How the same GPU health rate produces different complete-rack capacity](/images/ai-cluster-health-topology.en.svg)

If 92 unavailable GPUs are concentrated in two racks, 126 complete racks remain, representing 9,072 GPUs. Spread those same failures across 92 racks and only 36 complete racks remain, representing 2,592 GPUs. Both fleets contain 9,124 Healthy GPUs. Their complete-rack capacity differs by 6,480.

This example is not a yield forecast. It exposes what a health rate omits: fault location, delivery-unit size, and job topology. A four-GPU workload may still use much of an incomplete rack. An eight-rack workload needs complete racks that also form a larger contiguous block, so fragmentation removes another layer of feasible capacity.

**Cluster capacity depends on the workload. The health map, topology, and allocation shape determine it together.**

## Why Can't Per-Host Healthy Results Be Added?

Adding the per-host results of 18 compute nodes does not automatically produce one Healthy NVLink domain. A host check can catch GPU memory, temperature, firmware, or NIC faults. It cannot observe the NVLink shared among nodes. Multi-rack scope adds the scale-out fabric, storage paths, and scheduler placement. The accepting party may stay the same while the object expands from Node to Rack, Topology Block, and finally a complete Job Allocation.

Mission Control extends baseline testing from compute nodes to complete racks and multi-rack configurations. Firmware first matches the SOT, while test parameters come from the Golden Config. Periodic alarms start after Single Rack Testing passes. Multi-rack testing then exercises scale-out paths and a larger failure domain.

![From per-host health to a deliverable topology block](/images/ai-cluster-handoff-gates.en.svg)

Each scope validates a larger object. Per-host health excludes bad nodes. Rack testing validates an NVLink domain. Multi-rack testing validates a topology block. A representative workload then checks whether scheduling, storage, checkpointing, and failure recovery hold together. The unit of deliverable capacity changes with the scope.

The same distinction continues in operation. Mission Control's Slurm lifecycle checks are disabled by default and can start after nodes are initially confirmed healthy. Once enabled, a failed Prolog check marks the node DRAIN and requeues the job. The dashboard reports fewer available GPUs, but the scheduler no longer places a known-bad node into a distributed job. A lower available count can mean that the health gate has started reporting the cluster honestly.

## What Does Production Actually Accept?

Production cannot accept a statement that only says 9,124 GPUs are Healthy. It needs the topology of those resources, the workload passed by each block, the firmware, OS, driver, and container baseline, every open exception, and the validation scope a drained node must repeat before rejoining the partition.

![How Production Handoff fixes the capacity definition](/images/ai-cluster-production-handoff.en.svg)

An auditable handoff fits into one complete statement: under a specified baseline, a given number of topology blocks with a defined shape passed a workload and failure-recovery threshold and can be repeatedly reserved by the scheduler. GPU count, scope, version, pass conditions, and time must exist together. Remove one and capacity falls back to inventory accounting.

Production Handoff is not a permanent stamp. A firmware, driver, network-topology, or scheduler-policy change leaves the original acceptance evidence valid only for the unchanged scope. One sign-off can close project delivery. Continuous health gates preserve operational capacity afterward.

## Who Captures the Economics at Acceptance?

When the customer buys complete topology blocks, value continues beyond server shipment. Control over the golden baseline, cross-layer validation, exception closure, and block rejoin sits closer to the result the customer is waiting for.

That control point does not map cleanly to one stock. [NVIDIA's SuperPOD FAQ](https://docs.nvidia.com/dgx-superpod/faq/latest/dgx-superpod.html) defines SuperPOD as a turnkey solution with a bill of materials, installation, support, and guaranteed performance. Under the AI-cloud model, a cloud partner delivers capacity to NVIDIA instead. Contract structure moves the boundary among the OEM, NVIDIA, system integrator, cloud operator, and the customer's Production team.

Shipment revenue cannot prove that one company captures acceptance economics. Public software reporting does not isolate accepted topology blocks, first-pass block yield, time to handoff, or recovery SLOs. The evidence chain breaks before reaching a company segment, so the current price-in disposition is **Unverified**.

A calculated view would need the revenue trigger for acceptance, weekly first-pass topology-block output, rework time, support pricing, and a bridge from those measures to segment margin and cash flow. The thesis weakens if customers pay at shipment, standard tools automate validation, and handoff times converge across integrators. That outcome leaves little additional economics at this control point.

## What Is the Delivery Unit for a Supercluster?

Return to the opening numbers. The 9,216 GPUs are installed inventory. The 9,124 are per-host Healthy. Under a complete-NVL72 delivery unit, those same Healthy GPUs can form 9,072 GPUs of full-rack capacity or only 2,592 when failures are dispersed. A multi-rack training job adds topology placement and workload acceptance.

Production Handoff closes a different question from hardware installation: **can the scheduler repeatedly deliver these GPUs, in the agreed shape and under the agreed baseline, to the agreed workload?**

Facility, Rack, and Cluster have now crossed their own delivery boundaries. Training and Inference will impose different allocation shapes, run lengths, and fault-tolerance models on the same healthy cluster. The next layer is no longer GPU count. It is how much work the same megawatt can finish.
