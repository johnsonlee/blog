---
title: "A 262 MW Campus Expects to Use 4 MW When Permanent Power Arrives"
date: 2026-08-23 03:15:00
lang: en
i18n_key: data-center-site-energization
categories:
  - Investing
tags:
  - AI
  - Data Center
  - Infrastructure
  - Power Grid
---

A data center campus in Virginia originally wanted power in July 2025. Its permanent substation would not enter service until July 2027. Dominion's answer was bridging power from the nearby Cranes Corner Substation: one 7 MVA circuit, followed by another 11 MVA circuit. The campus would transfer to the permanent Centreport Substation once it was ready.

The project ultimately requested 262 MW. When permanent service arrived in 2027, its projected summer peak was only 4 MW. Full 262 MW buildout would not arrive until 2037.

The same campus therefore carries four numbers: 7 MVA, 11 MVA, 4 MW, and 262 MW. When a headline says that the data center "has been energized," how much of that capacity has actually become usable compute?

<!-- more -->

## Why can a 262 MW campus receive only 18 MVA first?

Cranes Corner and Garrisonville are the two existing substations closest to the campus. The issue is not whether lines appear on the map. Connecting the full 262 MW to either station would overload transformers and violate reliability requirements.

Dominion's Facility Interconnection Requirements also require a four-breaker ring bus for load interconnections above 100 MW. Neither Cranes Corner nor Garrisonville was built for that scale. The 18 MVA bridge can operate first because the load remains small and a permanent 2027 project exists to clear the constraint. Dominion also states that any bridging capacity above 18 MVA after 2026 would require more distribution infrastructure.

![Centreport temporary power, permanent service, and load ramp](/images/ai-site-energization-ramp.en.svg)

In July 2027, the service path moves from temporary circuits to Centreport Substation. Dominion projected only a 4 MW summer peak for that year. Demand then rises with campus buildings, IT deployment, and approved load increments until it reaches the 262 MW full-buildout forecast in 2037.

**The 18 MVA is a temporary service ceiling, 4 MW is one year's projected actual peak, and 262 MW is full-buildout demand a decade later.** They are not the same kind of capacity. Treating contract capacity as energized load, then treating energized load as available compute, overstates the result twice.

## Where does energization actually deliver power?

Regional transmission brings bulk power into the target area. Site Energization continues from the electrical boundary between the transmission owner and the campus. Regional transmission enters the interconnection substation; the utility and customer complete their respective connection facilities, protection, metering, and communications; and power reaches the service delivery point.

This scope excludes the transformers, switchgear, UPS systems, PDUs, busways, and power shelves inside the data center. Those belong to the facility power-distribution chain that follows. Site Energization answers one question: **under what conditions may the campus draw how much load from the grid?**

![Transmission Boundary to Data Center Service Delivery Point](/images/ai-site-energization-boundary.en.svg)

Initial Energization is the first time the utility applies voltage to customer facilities. The power may support only station service, equipment startup, a load bank, or commissioning. Commercial service is the contract state in which billing, minimum-demand charges, and other obligations may begin. Ready for Service (RFS) comes later, after the facility completes commissioning and is ready for delivery. The three dates can coincide. They can also be months apart.

An "energized 1 GW" therefore still needs four coordinates: which Point of Interconnection (POI), how many megawatts have been approved, which load-ramp step the site has reached, and whether service is temporary or permanent. Without them, energized capacity cannot be counted as available compute.

## Why can't a finished substation close its breaker?

Completed installation proves physical completion. It does not replace the utility's energization authorization. AEP's interconnection requirements divide the final delivery segment into the station, equipment, protection, SCADA, metering, telecommunications, station service, and transmission line. Different teams own those systems, but every one of them must be ready at the same time.

AEP requires real-time telemetry for interconnection facilities rated at 5 MVA or more. The control center needs voltage, current, real and reactive power, breaker and switch status, and alarms. AEP-owned interconnection facilities also need complete SCADA, RTU/IED integration, and supervisory control. AEP states the boundary plainly: it will not accept a new connection without adequate situational awareness and control.

Hardware, data, contracts, and grid operations form four gates:

![Four evidence sets required before breaker close](/images/site-energization-authorization-gates.en.svg)

The first gate is physical completion. Breakers, disconnect switches, transformers, instrument transformers, surge arresters, station batteries, ground grids, and connection lines on both sides of the POI must be complete. Equipment ratings must also match the study results.

The second is protection and data. The owners exchange and coordinate relay settings, then resolve any coordination issue. SCADA, telemetry, revenue metering, communications, and the dynamic model must work. Protection can remove hundreds of megawatts of load in milliseconds. It cannot be left for the morning of energization.

The third is commercial and regulatory readiness. Interconnection agreements, construction authorizations, Electric Service Agreements (ESAs), financial security, Contributions in Aid of Construction (CIAC), rights of way, permits, and any required state commission approval must each be settled. A completed project will still sit idle if no agreement says who bears the cost.

The fourth is operational authorization. The load has to appear in operating models. Operator contacts, switching procedures, outage coordination, ramp plans, and consumption limits must be current. In ERCOT, an energization request for a new standalone Large Load must receive ERCOT approval before the Transmission or Distribution Service Provider closes the breaker. The provider must contact the ERCOT control room immediately before the operation as well.

The four gates use AND logic. If one stays open, the campus remains de-energized no matter how quickly the other three finish.

## What can run in parallel and what must wait?

Four gates do not mean four sequential workstreams. Dominion explicitly identifies the site plan, load letter, short- and long-term power plans, design, right-of-way acquisition, permitting, material procurement, regulatory filings, and construction as work that can proceed concurrently. The data center building, utility substation, and protection design can move at the same time too.

Delay appears where those parallel schedules have to meet again.

![Parallel work and shared dependencies before site energization](/images/site-energization-interface-dependencies.en.svg)

The first convergence point is the design basis. The utility study determines voltage, topology, fault current, network upgrades, and the permitted load ramp. The final one-line diagram, equipment ratings, and relay settings all depend on it. A customer can order early, but equipment specified against the wrong parameters can cost more time than waiting for the study.

The second is notice to proceed. AEP Ohio requires the customer to demonstrate site control, submit a specific location and load ramp, and pay a load-study fee. Once the service plan is complete, the customer must execute both a Letter of Agreement (LOA) and an ESA. Without construction authorization, security, or advance funding, the utility will not order long-lead equipment for a project that may disappear.

The third is field testing. Utility and customer construction can proceed in parallel; energization waits for both sides. AEP may inspect equipment and grounding from the POI through the first protective fault-interrupting device. Its scope includes breakers, switches, instrument transformers, relays, station batteries, and the associated test results. At least five business days before the planned energization, the parties must also confirm that series equipment and SCADA commissioning are complete.

The last convergence point sits in the control room. AEP requires notice at least 45 days before in-service, or the longer RTO/RTE period, to verify telemetry, models, communications, and operating procedures. A construction completion date becomes an energization date only after the project appears correctly in the grid's operating model.

The project manager is managing the intersection of five schedules: utility, customer, RTO, equipment supplier, and commissioning team. The critical path often sits at an interface with no single owner, not inside one piece of equipment.

## Why can't the campus ramp to full load after closing?

Moving onto the permanent service path solves only where the power comes from. A large campus still climbs through de-energized, station auxiliary power, initial energization, commissioning load, approved load increments, and finally full contract capacity. Every state has its own MW ceiling.

NERC's 2026 guideline for Emerging Large Loads puts load forecasting, day-ahead studies, outage coordination, SCADA/PMU communications, dynamic-model verification, ramp ability, and maximum consumption inside commissioning. A tiered campus buildout can last months or years. Increasing maximum consumption or making a material facility change may require parts of the study and commissioning process to run again.

The problem is larger than whether the grid has enough electricity. AI workloads can add tens or hundreds of megawatts in seconds or minutes. They can also disappear together. The Balancing Authority has to schedule generation, reserves, and ramping; the Transmission Operator needs to understand how protection and reconnection will change voltage and power flow.

An event in July 2024 gives the problem a scale. A fault on a 230 kV transmission line produced six voltage depressions in 82 seconds, each lasting 42 to 66 milliseconds. About 1,500 MW of data-center-type load dropped at once. No utility breaker disconnected it. Customer-side UPS systems, protection, and controls caused the reduction. The grid cleared the fault as designed, and customer equipment protected the IT load as designed. Two control systems doing what they were built to do still created an unanticipated 1.5 GW load swing.

Sustained loading means riding through normal disturbances, withdrawing at an agreed rate, and reconnecting on an agreed ramp. Initial Energization grants the first permission to consume power. It does not grant the final one.

## Who proves the campus can increase its load?

There is no universal certificate that an EPC contractor can sign on its own. Each owner supplies evidence for the segment it controls. The utility and system operator then decide whether those records support initial energization or the next load increase.

![Site Energization Commissioning and Acceptance Matrix](/images/ai-site-energization-commissioning-matrix.en.svg)

For primary equipment and grounding, the facility owner supplies drawings, as-built data, and test results; the utility inspection determines whether the facilities can connect. Protection engineers own the short-circuit model, relay settings, and cross-boundary coordination. NERC PRC-027 requires owners of electrically joined facilities to exchange proposed settings and resolve coordination issues before implementation.

SCADA engineers prove that RTUs and IEDs, telemetry, status points, alarms, and remote controls send and receive correctly at the control center. The metering team verifies revenue-quality meters, CT/PT ratios, loss factors, ownership, and maintenance responsibility. Planning and operations teams check the steady-state and dynamic models, load forecast, ramp, ride-through behavior, operator contacts, and switching procedure.

A material change can invalidate an earlier acceptance. Replacing UPS systems, changing undervoltage settings, adding behind-the-meter generation, or increasing maximum consumption early will change the load behavior seen by the grid. Commissioning is the process that replaces design assumptions with as-built evidence.

## Which signature triggers which payment?

Once the technical gates are visible, the commercial chain becomes easier to follow. Contract names vary by utility, but payment milestones tend to move along the same transfer of risk. The customer first pays for the study, then secures the utility's construction commitment. Equipment suppliers bill against orders and progress. Long-term service obligations begin around actual energization.

![Contracts, Payments, and Acceptance Gates](/images/ai-site-energization-commercial-gates.en.svg)

AEP Ohio charges a one-time load-study fee for projects of 25 MW or more: $10,000 from 25 to 50 MW, $50,000 from 50 to 100 MW, and $100,000 at 100 MW or more. If the fee is not paid within 45 days, the service request is treated as withdrawn.

After the service plan is complete, the LOA transfers utility buildout risk to the customer. If the customer cancels before the target energization date, or delays the project by more than 12 months, it must reimburse AEP Ohio for the full buildout cost incurred. The ESA records the estimated energization date, load ramp, and contract capacity. Its term begins on the actual date of energization.

A customer that fails the credit and liquidity tests must post collateral equal to 50% of the minimum charges over the full contract term. The load-ramp period can run for no more than four years, with minimum contract-capacity steps of 50%, 65%, 80%, and 90%. The initial term equals the ramp period plus eight years. Drawing less power does not automatically remove the minimum-demand obligation attached to dedicated infrastructure.

Virginia is writing the same class of risk into its tariffs. New large-load customers signing after 2026 face at least a 14-year service obligation. They must pay at least 85% of transmission and distribution costs each month, while customers without sufficient credit may have to collateralize up to 60% of minimum charges over the contract term. The common purpose is to keep a canceled or slow-ramping campus from leaving stranded grid costs with other ratepayers.

There is no national template for these gates. In June 2026, FERC ordered PJM, MISO, SPP, CAISO, ISO-NE, and NYISO to justify or revise their large-load tariffs. The orders cover study processes, transmission-cost transparency, co-location, flexible service, and nearby generation. An LOA, ESA, minimum-demand charge, or collateral requirement only has meaning inside its specific utility, state, and RTO framework.

Equipment suppliers run on an earlier clock. Eaton reported $2.365 billion of customer deposits and billings in the first half of 2026 and $1.159 billion of deferred revenue at quarter-end. Some custom power-distribution contracts recognize revenue over time as work progresses; other products recognize revenue on shipment or delivery. Those milestones can enter backlog, revenue, and cash flow before campus energization, but Eaton serves many end markets. The figures cannot all be assigned to data centers.

## Does controlling the last switch create pricing power?

The utility controls the final service gate, and the customer cannot bypass the electrical boundary. That looks like pricing power. A regulated utility, however, is not auctioning a scarce delivery slot. It first builds transmission, substation, and distribution assets; state commissions or FERC then determine which costs enter rate base, what return is allowed, and when tariffs recover the investment.

The utility therefore captures economics through rate-base growth, depreciation, interest recovery, and an allowed equity return on approved investment. It does not earn the gross margin of a scarce equipment supplier. Customer-funded CIAC, disallowed projects, regulatory lag, and expensive financing can all prevent control of the breaker from becoming per-share earnings.

EPC and commissioning contractors earn one-time design, construction, and acceptance revenue. OEMs capture purchase orders, deposits, shipments, and service. The data center owner captures the time value of receiving usable megawatts earlier. Only the utility spans the physical gate, commercial contract, and recurring tariff, and regulation constrains all three.

AEP is a useful test of that economics. It operates across 11 states and owns about 40,000 line-miles of transmission. The same company publishes facility interconnection requirements and, through utilities such as AEP Ohio, connects the load study, LOA, ESA, collateral, energization, and minimum-demand charge into one commercial chain.

## How much of AEP's 69 GW is already in the price?

In its second quarter of 2026, AEP increased contracted load growth through 2030 to 69 GW and set a 2026-2030 capital plan of $77.937 billion. The plan allocates $40.879 billion to Vertically Integrated Utilities, $22.537 billion to Transmission and Distribution Utilities, and $12.855 billion to AEP Transmission Holdco. The 69 GW includes data center and industrial load. It is planned incremental demand backed by signed agreements, not energized load.

Fix the valuation date at August 21, 2026. AEP closed at $120.94. Q2 diluted shares were 550.6 million, producing an equity value of roughly $66.59 billion. At June 30, total debt was $52.836 billion and cash was $375 million, for net debt of approximately $52.461 billion and enterprise value of about $119.05 billion. Debt to total capital had risen from 60.3% at year-end 2025 to 61.4%.

EV/Sales does not reconnect rate base, financing, and per-share dilution for a leveraged regulated utility. A reverse valuation built on operating EPS and dividends is more direct. AEP raised 2026 operating EPS guidance to $6.25-$6.55, with a $6.40 midpoint. Its quarterly dividend is $0.95, or $3.80 annualized.

Assume four years from FY2026 through FY2030 and an 8% required annual total return. The first full-year dividend in 2027 grows 5% from the current $3.80 annualized rate, then grows 5% each year and is reinvested at 8%. Use three possible FY2030 operating P/E multiples: 16x, 18x, and 20x.

> Required EPS 2030 = [Current Price × (1 + Required Return)^4 - Future Value of Dividends] / Exit P/E

![AEP Site Energization Reverse Price-In](/images/aep-site-energization-price-in.en.svg)

At a 16x exit P/E, today's price requires $9.08 of operating EPS in 2030, a four-year CAGR of 9.1%. At 18x, the result is $8.07 and 6.0%. At 20x, it is $7.26 and 3.2%. AEP's long-term operating EPS growth target is 7%-9%, which would produce roughly $8.39-$9.04 in 2030.

There is no answer that survives independently of the terminal multiple. Accept an 18x exit, and the current price discounts most of the low end of guidance without requiring all 69 GW to materialize. Normalize the multiple to 16x, and AEP must deliver almost the top of guidance for the shares to return 8% annually. **The price is not betting on the 69 GW headline. It is betting that enough contracted load energizes on schedule, the resulting assets enter rate base without a long delay, and financing does not consume the per-share growth.**

## What would falsify this chain?

The first falsification point is the energization schedule. If signed load fails to pass studies, construction, commissioning, and load-ramp approvals on time, or if customers route around the plan through bridging power, behind-the-meter generation, flexible service, or other sites, the 69 GW will not become metered demand on the assumed schedule.

The second sits in cost recovery. Regulators may disallow part of the capital plan, CIAC and other customer-funded facilities may rise as a share of construction, or minimum-demand charges and collateral may still fail to cover stranded cost. Controlling the interconnection gate would then earn less than expected.

The third sits in the per-share bridge. AEP's $77.9 billion plan requires continued debt, hybrid-security, and common-stock issuance. If interest expense, leverage, or dilution grows faster than rate base, the company can get larger while EPS falls below guidance.

The last is valuation. Even if EPS grows 7%-9%, an interest-rate environment that takes the exit multiple to 16x uses almost all of the upside in the top end of guidance. Price-in is not a claim that "the market sees data centers." The earnings path, financing, and multiple have to hold together.

Return to Centreport. The 7 MVA, 11 MVA, 4 MW, and 262 MW figures never contradicted one another. They describe temporary supply capability, one year's projected load, and full-buildout demand.

Put those figures back on one timeline and the vague phrase "energized" becomes an engineering state that can be checked: which POI, which class of service, what switching date, how many megawatts are currently approved, and what remains before the next ramp step. Power is handed to the Data Center only when those conditions close together.

It has still reached only the service delivery point. The GPUs in the rack do not yet have a single watt.

## Sources

- [Dominion Energy, Centreport SCC Application](https://www.dominionenergy.com/-/media/content/about/power-line-projects/centreport/pdfs/application-volume-1-of-3-2024-centreport.pdf)
- [Dominion Energy, Data Center Requests](https://www.dominionenergy.com/virginia/large-business-services/data-center-requests)
- [AEP, Requirements for Connection of New Facilities or Changes to Existing Facilities](https://www.aep.com/assets/docs/requiredpostings/TransmissionStudies/Requirements/AEP_Interconnection_Requirements_Rev5.pdf)
- [NERC, FAC-001-4 Facility Interconnection Requirements](https://www.nerc.com/globalassets/standards/reliability-standards/fac/fac-001-4.pdf)
- [NERC, PRC-027-1 Coordination of Protection Systems](https://www.nerc.com/globalassets/standards/reliability-standards/prc/prc-027-1.pdf)
- [NERC, Risk Mitigation for Emerging Large Loads](https://www.nerc.com/globalassets/our-work/guidelines/reliability/RG_Risk-Mitigation-For-Emerging-Large-Loads.pdf)
- [NERC, Incident Review: Considering Simultaneous Voltage-Sensitive Load Reductions](https://www.nerc.com/globalassets/our-work/reports/event-reports/incident_review_large_load_loss.pdf)
- [ERCOT, Large Load Integration](https://www.ercot.com/services/rq/large-load-integration/)
- [ERCOT, PGRR145 Batch Zero Process for Large Load Interconnections](https://www.ercot.com/mktrules/issues/PGRR145)
- [AEP Ohio, Data Center Tariff](https://www.aepohio.com/company/about/rates/data-center-tariff/)
- [Virginia State Corporation Commission, Data Center Initiatives](https://www.scc.virginia.gov/about-the-scc/scc-facts/)
- [FERC, Large Load Integration Orders](https://www.ferc.gov/news-events/news/ferc-launches-aggressive-targeted-action-speed-large-load-integration)
- [Eaton, Q2 2026 Form 10-Q](https://www.sec.gov/Archives/edgar/data/1551182/000155118226000030/etn-20260630.htm)
- [AEP, Q2 2026 Earnings](https://www.aep.com/news/stories/view/12135/)
- [AEP, Q2 2026 Form 10-Q](https://www.sec.gov/Archives/edgar/data/4904/000000490426000059/aep-20260630.htm)
- [AEP, Stock and Dividends](https://www.aep.com/investors/stock/)
- [Nasdaq, AEP Historical Quotes](https://www.nasdaq.com/market-activity/stocks/aep/historical)
