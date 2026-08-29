---
title: "Final Data Center Acceptance Deliberately Creates Failures"
date: 2026-08-23 06:00:00
lang: en
i18n_key: data-center-commissioning
categories:
  - Investing
tags:
  - AI
  - Data Center
  - Infrastructure
  - Bottleneck
---

A data center had already completed several commissioning exercises. Its DRUPS carried the IT load, its mechanical generators started, and each test ended with fuel still in the day tanks.

The final Tier facility demonstration kept the generators running for an entire day. A few hours in, multiple DRUPS raised low-fuel alarms.

The engines were not at fault. The problem sat in the fuel-transfer sequence: when a day tank requested fuel, a solenoid valve opened first and the transfer pump started after a delay. Engineers removed that delay, giving the defect a straightforward fix.

Did the original delivery date still hold? What did the previous PASS records still prove, which tests had to run again, and who could sign Ready for Service while the issue log remained open?

<!-- more -->

## Why did earlier tests miss it?

In this [case documented by Uptime Institute](https://journal.uptimeinstitute.com/avoiding-data-center-construction-problems/), each short test stopped before the day tanks emptied. A full night separated one run from the next. Even with the pump pushing against a closed valve, a small amount of fuel crept through and refilled each tank before the next exercise.

The all-day run changed the test boundary. Fuel had to enter from the bulk tank while the day tank was being consumed. Gravity moved fuel through the opened solenoid valve before the pump started, triggering an automatic leak-detection valve to close. The delayed pump then started against that closed valve. Earlier tests had proved that the generators could start and survive a short transition. They had never proved that the fuel system could sustain generator mode.

Once the test ran longer, the test object changed with it. A short run covered the state transition; an all-day run reached steady state. Batteries discharge and recharge, day tanks deplete and refill, equipment and pipes warm up, and control states accumulate. If a slow variable never completes a cycle, the PASS applies only to that shorter operating window.

[Uptime Institute's commissioning guidance](https://journal.uptimeinstitute.com/improve-project-success-through-mission-critical-commissioning/) recommends at least eight continuous hours for critical-equipment load-bank tests and considers up to 24 hours a best practice. A project should not copy that duration mechanically. Fuel autonomy, thermal behavior, battery recharge, and its own acceptance criteria have to define the test window together.

## Where the power is cut defines what the old evidence proves

Duration is one boundary. The fault-injection point changes the test object as well.

[Uptime Institute's 2023 analysis of pull-the-plug tests](https://journal.uptimeinstitute.com/are-utility-companies-needed-for-pull-the-plug-testing/) describes three common approaches. The utility provider can interrupt incoming power and give the facility a real grid loss. The project can open an isolation device upstream of the transformer. It can also pull transformer fuses so the PLC receives a power-loss signal.

All three can start the generators without exercising the same path. If the PLC monitors the isolation device, opening it may directly trigger the backup sequence and bypass loss detection tied to transformer state. Pulling fuses can leave real grid power in place until generators are online, so UPS batteries discharge only briefly and some ancillary processes may never run.

An old PASS therefore has to retain its fault-injection point. It proves the behavior of one topology, load point, and controls baseline under one failure boundary. Move the breaker, or replace a simulated loss with a real grid interruption, and the scope of that evidence changes.

## One outage puts four paths on the same timeline

A complete utility-loss Integrated Systems Test is not a handoff between a UPS and a generator.

The power path has to detect loss of source, move the UPS to battery, start the generators, establish acceptable voltage and frequency, and transfer the critical bus to on-site power. Cooling follows its own ride-through and restart sequence. Pumps, CRAHs, CDUs, and controls may not share the same UPS; some depend on battery-backed power, some on thermal inertia, and some wait for a stable generator bus before restarting.

The BMS, EPMS, and plant controllers must place breaker positions, generator state, flow, temperature, alarms, and restart commands on one timestamped record. Operations is part of that timeline too. Alarms have to match the actual state, the Emergency Operating Procedure must fit the event, and operators need a defined intervention point if automatic recovery fails.

![How one utility interruption crosses power, cooling, controls, and operations](/images/data-center-integrated-systems-test.en.svg)

[Uptime Institute's description of a Tier facility demonstration](https://journal.uptimeinstitute.com/tiercertificationpreparation/) calls for interrupting incoming utility power, using the UPS to maintain critical load until engine generators take over, and confirming that cooling carries the load through the transition. Load banks also need to approximate the rack distribution inside the data hall so electrical distribution and airflow see a realistic load. Liquid-cooling systems need a separate arrangement that applies thermal and hydraulic load to the TCS and CDUs.

The PASS for a utility-loss IST therefore belongs to the whole timeline. Keeping IT power online proves only that the electrical path stayed inside its limits. A late cooling recovery, incorrect alarm sequence, or unusable EOP can still fail the same scenario.

## Which tests survive after the delay changes?

After the fuel-transfer delay is removed, the generator is unchanged but the test object now has a new sequence. The failed record must remain, and old PASS evidence cannot sign for the new configuration by itself.

Uptime Institute says that when programming or control wiring changes to correct a failed step, the complete affected test procedure should run again. Any change during Level 5 also needs an evaluation of which tests must be repeated. That does not mean restarting all of Level 5 after every line changes. It also does not mean waiting only for the low-fuel alarm to disappear.

The CxA first performs a change-impact review. The upstream trigger is the day-tank low-level request. The direct actions are the solenoid valve and pump. Downstream responses include tank level, fuel pressure, and alarms. Every generator-mode scenario that shares this logic needs another scope decision. An affected procedure runs from prerequisites and fault injection through sustained operation and recovery, long enough for the day tank to deplete and refill online.

A PASS is therefore bound to configuration and evidence: the single-line and sequence versions, setpoints and firmware, fault-injection point, applied load, permitted thresholds, and timestamped power-quality, flow, temperature, alarm, and operator records. Once the configuration changes, impact review decides which evidence remains valid and which has expired.

One passing retest does not erase the first failure. The issue log still needs the root cause, owner, change, affected scope, and witness. That record proves the defect closed instead of proving only that the team found an easier script.

## Does one FAIL move the RFS date?

The answer is not in a generic Level 1 through Level 5 definition. It is in the project contract.

A public 2026 [colocation agreement between Digi Power X and Cerebras](https://www.sec.gov/Archives/edgar/data/1854368/000121390026053566/ea028958501ex10-1.htm) defines RFS for each phase through project-specific criteria: the space has been constructed, commissioned, and tested; contracted IT load is available to energize customer equipment; and the phase meets the relevant contract exhibits. The operator's RFS notice must include a commissioning report from the Engineer of Record. The customer can then inspect for material deviations, and a bona fide deficiency has to be corrected and verified again.

The same agreement connects RFS to a commercial event. The Phase Commencement Date is the RFS date, when the corresponding monthly colocation fee begins. Missing the delivery date can produce daily RFS credits. Passing the final outside date can give the customer a right to terminate the service order.

Return to the fuel-transfer case. If the acceptance criteria require generator mode to sustain critical load, a refill failure exposed by low-fuel alarms is a blocking defect. Removing the delay completes the correction. The operator regains evidence for an RFS notice only after a sufficiently long generator-mode retest passes.

Other open items depend on the contract, legal requirements, and an authorized exception process. A test waiting for seasonal conditions, or a label or document tail that does not alter function, may enter a deferred list. A fuel sequence that cannot maintain required critical load cannot become a PASS merely because the owner writes down residual risk.

## How time to pass enters the economics

The next payment now has a trigger. One day of RFS delay can postpone an operator's recurring fee while also creating a delay credit. A failed IST adds CxA and OEM technician time, load-bank rental, generator fuel, and retest days. The operational constraint has crossed through RFS into the contract and cash flow.

That still does not create alpha for every controls vendor, CxA, or OEM. The next questions are who owns the sequence, who pays for the correction, whether the contract uses fixed price, time and materials, or a performance incentive, and whether an extra retest becomes revenue, uncompensated rework, or liquidated damage. Only then can the effect reach segment revenue, margin, and cash flow.

The public record does not identify the suppliers or contract behind the fuel-transfer case. Nor does it map a specific commissioning failure at the Digi Power X project to a listed supplier. The company-level economics are not established, so price-in remains Unverified. A shorter time to pass matters. Who can retain its value still needs supplier awards, contractual responsibility, and financial data.

Whether one failed utility-loss test delays delivery does not turn on whether the generator starts again or whether the issue log loses one row. It turns on which RFS criterion failed, which old evidence the change invalidated, and whether the affected scenario passed again under the same fault boundary for long enough.

After RFS, facility capacity can accept IT load. The next boundary sits at the rack: once the GPUs, CPUs, HBM, NICs, power shelves, and cold plates arrive, why can it still not move straight into the data hall?
