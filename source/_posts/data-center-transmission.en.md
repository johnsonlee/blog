---
title: "Not One of 36 Data Centers Can Connect to the Existing Transmission Grid"
date: 2026-08-23 03:00:00
lang: en
i18n_key: data-center-transmission
categories:
  - Investing
tags:
  - AI
  - Data Center
  - Infrastructure
  - Bottleneck
---

In November 2025, AEP Ohio completed load studies for 36 queued data center sites. The model assumed adequate generation, then placed 13,022.7 MW of new load onto PJM's regional grid.

The result was that none of it could be served. The first group had to wait until the fourth quarter of 2031. Another group received a planning estimate of 2033.

If generation was no longer the modeled constraint, why did the data centers still have to wait six years?

<!-- more -->

## Why can adequate generation still fail to reach a data center?

AEP's assumption needs one boundary around it. “Adequate generation” does not mean that the real plants have already been built. The study deliberately did not test generation sufficiency. It held supply constant and asked whether the existing transmission network could reliably accept the new load.

Even then, the answer was no. Having electricity and delivering it to the target region are separate conditions.

An AC grid is not a dedicated pipe from one plant to one data center. A generator injects power at one node, a load withdraws it at another, and the incremental flow divides among multiple paths according to network impedance. Operators can change generation dispatch, network topology, and power-flow controls. They cannot command a particular 1 GW to follow the shortest line on a map.

![How new load changes flows across an AC network](/images/central-ohio-power-flow.en.svg)

The question is therefore not whether a nearby line has a 1 GW nameplate. It is whether the full network still has a valid power-flow solution under both normal and contingency conditions after that load is added.

## Why is spare capacity beside the campus not enough?

Delivering the load with every element in service passes only the easiest test. The grid must also lose one line or transformer, the familiar N-1 condition. It must study another loss after the system has stabilized during an outage, or N-1-1.

[NERC TPL-001-5.1](https://www.nerc.com/pa/Stand/Reliability%20Standards/TPL-001-5.1.pdf) requires planning models to avoid cascading and keep facility ratings, voltage, and stability within limits under defined contingencies. For these 36 sites, AEP specifically ran N-1 thermal, N-1-1 thermal, N-1-1 voltage-magnitude, and voltage-drop analyses.

The thermal violation is easiest to picture. Current heats and sags a conductor, and the first element to cross its rating may sit beside the campus or hundreds of miles away. Voltage is less visible. Long-distance real-power transfer needs reactive support. If voltage falls too far after a fault, the load still cannot connect even when no conductor overheats.

Transmission capacity is therefore neither a line nameplate nor the sum of local spare ratings. **It is the smallest load left after the system model applies every relevant contingency and constraint.**

## Which project is holding back the 13 GW?

Of the 36 requests, 32 Central Ohio sites totaled 9,807.7 MW and four sites outside the area totaled 3,215 MW. AEP did not assign 36 independent dates. It grouped the loads into three clusters according to the capacity released by regional projects.

![How AEP Ohio divided 13 GW of new load into three clusters](/images/central-ohio-load-clusters.en.svg)

Cluster 1 contains the first 5,454.5 MW in the Central Ohio queue. Cluster 3 contains the 3,215 MW outside the region. Both need regional project `2025W1-570`, or an equivalent solution, plus their own non-regional and local upgrades in parallel. Cluster 2 contains the remaining 4,353.2 MW in Central Ohio and still needs another regional solution after the first project is complete.

That changes what queue position means. It does not map directly to a construction date. It first determines whether a site lands in Cluster 1 or Cluster 2. A later project can move forward only when an earlier customer declines to execute its LOA and ESA.

## Why does one transmission project take six years?

When AEP performed the study, PJM had not selected a regional solution. AEP assumed that Proposal 570 would win and enter service in the fourth quarter of 2031. On February 12, 2026, the [PJM Board approved the portfolio as baseline project `b4068`](https://www.pjm.com/-/media/DotCom/committees-groups/committees/teac/2026/20260203/20260203-pjm-board-whitepaper-february-2026.pdf). The modeling assumption moved one step closer to reality, but the “one project” immediately opened into dozens of components.

The western path runs from Greentown in Indiana through Teddy to Marysville. Another 765 kV backbone links Guernsey, Conesville, West Millersport, and Adkins. The portfolio also adds 345 kV lines from Teddy toward Beatty and Cole, multiple 765/345 kV substations, STATCOMs, breakers, relays, and modifications to existing lines.

![PJM b4068 is a regional network rather than one line](/images/ohio-seven-year-scope.en.svg)

PJM's [constructability analysis](https://www.pjm.com/-/media/DotCom/committees-groups/committees/teac/2026/20260106/20260106-2025-rtep-window-1-constructability-and-cost-analysis-report.pdf) described Proposal 570 as 291.5 miles of new 765 kV and 35 miles of new 345 kV, with 277.4 greenfield miles. The submitted cost was $2.775 billion. PJM's independent estimate was $4.026 billion, about 45% higher.

Routing, state siting, environmental review, rights of way, and easements must converge before continuous field construction can proceed. Line and substation engineering, long-lead equipment, and outage planning can overlap, but protection, SCADA, telecommunications, phasing, and energization tests must all finish together. One missing easement or one late breaker can hold the entire path out of service.

## Is 2031 a commitment or an estimate?

It is a projected in-service date, not a guarantee.

In November 2025, Q4 2031 was AEP's modeling assumption for an unselected proposal. PJM later approved `b4068`, and the latest [baseline assessment](https://www.pjm.com/-/media/DotCom/planning/rtep-dev/baseline-reports/2025-rtep-baseline-assessment.pdf) now lists October 31, 2031 as the projected date for critical components including Greentown-Teddy, Conesville-West Millersport, and West Millersport-Adkins. The date has stronger evidence than it did at the start.

The same constructability analysis still rated schedule risk Medium and right-of-way and land-acquisition risk Medium-High. The gap between the $2.775 billion proposal and the $4.026 billion independent estimate leaves substantial execution uncertainty as well.

![The conditions behind the projected 2031 in-service date](/images/ohio-seven-year-risk.en.svg)

AEP also warned that signed LOAs and ESAs send formal load into a later PJM RTEP analysis, which may identify still more upgrades. The 2033 date for Cluster 2 is only a planning estimate because the additional regional solution that triggers its next competitive window has not been selected.

The year 2031 is not a countdown that automatically releases 13 GW. It is the gate that the first clusters may cross if project selection, routing, rights of way, equipment, construction, and system tests all close as planned.

## Why not extract more capacity from the existing grid first?

That should be tested first, but the remedy depends on the binding constraint.

Dynamic Line Rating replaces a conservative static rating with weather, conductor temperature, and live measurements. A cold, windy line can carry more power because it sheds heat faster. Power-flow controls and topology optimization move flow away from congested paths. Advanced reconductoring reuses towers and rights of way while installing a higher-capacity conductor.

In [DOE's survey of operating deployments](https://www.energy.gov/cmei/systems/articles/smart-transmission-tools-modernize-americas-power-grid), Oncor's DLR sensors raised line capacity by 6% to 14%, while a Duquesne Light pilot achieved 25%. PPL avoided a $12 million reconductoring project on 31 miles of line and reduced congestion costs by more than $64 million.

![Which remedy fits each transmission constraint](/images/transmission-remedy-matrix.en.svg)

Those tools can release headroom hidden by conservative ratings or inefficient flow distribution. They cannot create a missing regional transfer path. If the binding constraint is the corridor, voltage support, or system strength under N-1-1, a new conductor or a few sensors cannot replace a new EHV network. PJM's selection of a 291.5-mile 765 kV scope shows that Central Ohio was not short by a few percentage points on one line.

## Whose revenue does the $2.775 billion become first?

It does not become contractor revenue on the day PJM approves the project.

PJM documents first assign transmission owners, designated entities, cost allocation, and project scope. The rate base belongs to the qualifying transmission-asset owner. Engineering, towers, conductor, substations, and commissioning enter a contractor's or OEM's backlog only after separate procurement and contract awards.

Public `b4068` documents name Grid Growth Ohio LLC, AEP, ATSI, Dayton, and other designated entities or transmission owners. They do not identify a Quanta Services EPC award. The $2.775 billion is a proposal cost estimate, not a PWR order.

Quanta remains relevant because it spans transmission engineering, substations, line construction, and skilled labor. At the end of the second quarter of 2026, its [Electric segment reported $29.11 billion of RPO and $43.79 billion of backlog](https://investors.quantaservices.com/news-events/press-releases/detail/402/quanta-services-reports-second-quarter-2026-results). The backlog included $14.68 billion of estimated MSA and short-term non-fixed-price orders based partly on historical trends. Without a project award, industry demand cannot establish how much this project contributes to earnings.

The commercial events that matter are narrower: once routing and regulation converge, who receives a contract award or notice to proceed, how much enters RPO, and when procurement, construction, and commissioning milestones become revenue.

## How much has PWR already priced in?

PWR closed at $639.34 on August 21, 2026. Quanta's latest guidance calls for 2026 adjusted diluted EPS of $16.45 to $16.95, or $16.70 at the midpoint. The stock therefore trades at 38.3 times current-year adjusted earnings.

Require a 10% annual return and assign 2030 exit multiples of 25, 30, and 35 times adjusted EPS. The current price then requires 2030 adjusted EPS of $37.44, $31.20, and $26.74. Against the 2026 guidance midpoint, those outcomes imply four-year CAGRs of 22.4%, 16.9%, and 12.5%.

![The missing evidence between b4068 and PWR earnings](/images/pwr-transmission-evidence-bridge.en.svg)

That supports a more precise conclusion than “transmission is scarce”: **Quanta's long-term growth is substantially priced in, while the contribution of `b4068` to Quanta remains Unverified.**

Even if the market still pays 30 times adjusted EPS in 2030, Quanta must compound earnings at roughly 17% for four years to support a 10% required return from today's price. If the exit multiple falls to 25 times, the requirement rises to 22.4%. That path includes all of Quanta's Electric and Underground and Infrastructure businesses, acquisitions, and margins, not data-center transmission alone.

A project award would close only the first section of the evidence bridge. Awarded scope, RPO conversion, fixed-price execution, and margins all have to beat the path already implied by the share price before the transmission bottleneck becomes an expectation gap.

## Why is the data center still dark after the backbone is live?

Return to AEP's 13,022.7 MW. `b4068` addresses whether the target region can reliably accept the new load. It does not complete any campus's high-voltage interconnection, metering, protection, controls, testing, or staged energization.

Generation asks whether the system has enough supply. Transmission asks whether that power can reach the target region. At the site boundary, the regional network may be ready while the campus still has to complete its final connection before electricity appears on the data-center bus.

## Sources

- [AEP Ohio: DCT Load Study Letter, November 7, 2025](https://www.aepohio.com/lib/docs/ratesandtariffs/ohio/AEP-Ohio_DCT_Load_Study_Letter_25.11.7.pdf)
- [AEP Ohio: Data Center Tariff](https://www.aepohio.com/company/about/rates/data-center-tariff/)
- [PJM: TEAC Recommendations to the PJM Board, February 2026](https://www.pjm.com/-/media/DotCom/committees-groups/committees/teac/2026/20260203/20260203-pjm-board-whitepaper-february-2026.pdf)
- [PJM: 2025 RTEP Window 1 Constructability and Cost Analysis](https://www.pjm.com/-/media/DotCom/committees-groups/committees/teac/2026/20260106/20260106-2025-rtep-window-1-constructability-and-cost-analysis-report.pdf)
- [PJM: 2025-2040 Baseline Reliability Assessment](https://www.pjm.com/-/media/DotCom/planning/rtep-dev/baseline-reports/2025-rtep-baseline-assessment.pdf)
- [PJM: RTEP Development](https://www.pjm.com/planning/rtep-development)
- [NERC: TPL-001-5.1 Transmission System Planning Performance Requirements](https://www.nerc.com/pa/Stand/Reliability%20Standards/TPL-001-5.1.pdf)
- [U.S. Department of Energy: Smart Transmission Tools Modernize America's Power Grid](https://www.energy.gov/cmei/systems/articles/smart-transmission-tools-modernize-americas-power-grid)
- [Quanta Services: Second-quarter 2026 results](https://investors.quantaservices.com/news-events/press-releases/detail/402/quanta-services-reports-second-quarter-2026-results)
- [Quanta Services: Second-quarter 2026 Form 10-Q](https://investors.quantaservices.com/sec-filings/all-sec-filings/content/0001050915-26-000025/pwr-20260630.htm)
- [Yahoo Finance Japan: Quanta Services historical prices](https://finance.yahoo.co.jp/quote/PWR/history)
