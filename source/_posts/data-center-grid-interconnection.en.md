---
title: "Why Is an AWS Data Center Beside a Nuclear Plant Still Hard to Expand?"
date: 2026-08-23 02:15:00
lang: en
i18n_key: data-center-grid-interconnection
categories:
  - Investing
tags:
  - AI
  - Data Center
  - Infrastructure
  - Bottleneck
---

The data center campus AWS bought in Pennsylvania sits beside the Susquehanna nuclear plant. Power does not need to cross a state or wait for a transmission line hundreds of miles long. Two reactors stand across the fence, and the campus already used 300 MW through a direct connection.

Yet when Talen tried to expand that path from 300 MW to 480 MW, FERC rejected the amended Interconnection Service Agreement. AWS's requirement later doubled to 1,920 MW, but the direct-connect structure was replaced: nuclear output would enter the PJM grid first, then PPL would deliver electricity to the data center next door.

Why did a data center beside a nuclear plant still need the grid?

<!-- more -->

## Why didn't a direct wire bypass the grid?

Draw a power plant and a data center as adjacent boxes and the answer looks simple. Run a dedicated wire from the generator to the servers. PJM and PPL need not sit in between.

Susquehanna's original Behind-the-Meter (BTM) structure came close to that picture. After Talen sold the campus to AWS, it signed a long-term PPA with minimum commitments rising in 120 MW annual steps. The original contract allowed AWS to stop at 480 MW or continue toward 960 MW. The existing 300 MW co-located load sat on the generation side rather than crossing the public grid as ordinary retail load.

Physical distance, however, answers only how long the conductor must be. It does not decide who carries the load during a fault. In November 2023, one Susquehanna unit tripped. The co-located facility failed to transfer as intended and drew from the PJM grid for several hours. Talen later paid the applicable charges, changed the configuration, added protective equipment, and designed redundant signals to open an isolation breaker.

Those hours exposed the direct-connect boundary. **As long as the data center remains electrically synchronized with the grid, drawing no grid power in normal operation does not prove it will use no grid service during a fault.**

![How a Susquehanna unit trip crossed the direct-connect boundary](/images/susquehanna-grid-outage.en.svg)

## Why was 300 MW operating while 480 MW was rejected?

PJM's 2024 amended ISA sought to raise permitted co-located load from 300 MW to 480 MW. Its engineering analysis found no transmission upgrade was required up to 480 MW, and the protection scheme would isolate the data center following loss of generation. The extra 180 MW was not waiting for one missing transformer.

Nor did FERC reject the filing because Susquehanna lacked generation. The Commission found that PJM had not justified why this non-conforming agreement should depart from the existing tariff or how it would handle transmission service, backup supply, reliability, and costs to other customers. The order rejected the filing without prejudice. It did not permanently ban the structure; it found the existing record insufficient to establish the responsibility boundary.

That is the difference between a PPA and grid interconnection. A PPA states who sells power, how much, at what price, and for how long. An ISA and utility service arrangement answer a different set of questions:

- What injection and withdrawal are permitted at each Point of Interconnection?
- After a generator trip, line outage, or protection failure, is load disconnected or served by the grid?
- How does metering separate direct supply, grid imports, and grid exports?
- Who purchases transmission, distribution, ancillary, and backup services?
- Which upgrades must be built, who pays, and when can they enter service?

Writing 960 MW into a contract does not sign all five answers at once. A PPA secures energy supply. An executable grid connection secures how that load is served in both normal and faulted states.

## Why did 480 MW become 1,920 MW?

After FERC rejected the 480 MW amendment, Talen and AWS did not force all future capacity into the BTM model. In June 2025 they rewrote the PPA, doubled full quantity to 1,920 MW, and moved to Front-of-the-Meter (FTM). Susquehanna would inject into PJM, Talen Energy Marketing would act as the retail electric generation supplier, PPL would provide transmission and delivery, and the AWS campus would become grid load.

![How Susquehanna moved from direct connection to grid delivery](/images/data-center-grid-connection-boundary.en.svg)

The electricity appears to travel in a circle, but the commercial structure removes the hardest exception. FTM no longer needs 1,920 MW embedded in a special co-located-load ISA. Generation, transmission, retail supply, and load service return to established tariff and responsibility boundaries. Talen called the change a way to `de-risk PPA delivery`: it removed AWS's option to cap commitments at 480 MW and eliminated dependence on approval of the old FERC filing.

The tradeoff is that a neighboring nuclear plant no longer means instant delivery. PPL first had to complete transmission reconfiguration, and AWS load had to enter PJM's load forecast. The old BTM structure remained at 300 MW during transition. The revised PPA took effect in April 2026, then ramps through 240 MW, 360 MW, and 480 MW before reaching 1,680–1,920 MW no later than 2032.

The 1,920 MW is therefore not a thicker direct cable. It buys a repeatable delivery model. Talen can extend the same PPA to other AWS sites in Pennsylvania, the utility delivers across a standard boundary, and PJM can include the load in planning, capacity, and reliability models.

## What does an interconnection agreement deliver?

Grid interconnection is neither a generic permit to use electricity nor proof that construction is complete. It freezes technical and commercial boundaries so engineering can proceed against them.

At Susquehanna, the old ISA governed the generator's connection to the transmission system; the amendment tried to change how much generator output could remain with co-located load. Under the FTM model, generation continues to inject through its existing interconnection while AWS creates a separate withdrawal through PPL service facilities. The PPA reconciles the two financially, but each side still follows grid dispatch, metering, and protection.

That is why one project can have several dates that all sound like "power secured":

1. PPA effective: buyer and seller assume contractual obligations.
2. Interconnection and service arrangement effective: connection and responsibility boundaries are approved.
3. Required upgrades complete: the external system is physically ready.
4. Site energized: the utility closes at the delivery point.
5. Load ramp accepted: new megawatts can rise on schedule.

Without any of the first four, the final ramp remains a contract axis. The deliverable from interconnection is not a megawatt-hour. It is **a supply path that remains valid under specified operating and fault conditions.**

## Who turns this gate into cash flow?

Under BTM, Talen controlled generation, the direct-connect campus, and the PPA, shortening the value chain and concentrating the regulatory dispute at one boundary. FTM separates the roles. Talen receives generation and contracted PPA margin. PPL earns regulated returns on transmission and delivery. PJM applies market and reliability rules. AWS assumes purchase commitments that grow with the ramp.

No participant gains pricing power merely by "owning the approval." The stronger control point is the ability to reroute the project onto another deliverable path. After FERC rejected 480 MW BTM, Talen replaced "nuclear plant next door" with "nuclear PPA plus standard grid delivery" and quadrupled capacity. It did not monetize an ISA fee. It moved 1,920 MW of nuclear output from merchant exposure toward long-term contracted cash flow.

Talen estimates the AWS PPA contributes about $1.55 of Adjusted Free Cash Flow per share in 2026, $4.00–$5.75 in 2029, and $7.00–$8.25 in 2032 at a 1,680–1,920 MW ramp. It also says a capped shortfall make-whole could preserve 50%–65% of full impact even if AWS draws no power. Interconnection and ramp matter without placing all contract value on one energization date.

## How much of 1,920 MW is priced in?

TLN closed at $314.46 on August 21, 2026, for a market capitalization near $14.4 billion. The 2026 PPA contribution of $1.55 is only 0.5% of the share price, but the market is not buying the first 240 MW alone. It is buying the subsequent rise in contracted cash flow.

Treat Talen's 2032 contribution of $7.00–$8.25 as steady state, discount it six years at 10%, and apply terminal multiples of 10, 15, and 20 times. The implied present value of the AWS PPA is about $40–$93 per share, or 13%–30% of the current price. This is not a price target. It turns "the market sees 1,920 MW" into assumptions that can be recomputed.

![Talen AWS PPA price-in scenarios](/images/talen-aws-price-in.en.svg)

The remaining 70%–87% cannot be called unpriced. TLN also contains merchant and capacity earnings from Susquehanna, other generation assets, acquisitions, capital structure, and future contracts. Conversely, adding all $18 billion of notional PPA revenue to market value would ignore a ramp ending in 2032, delivery cost, tax, share count, and time value.

Four observations would falsify the path: actual ramp falls below 240, 360, and 480 MW in 2026–2028; per-share PPA contribution misses $1.55, $2.00, and $2.50; volume remains far below the 1,680 MW minimum in 2032; or acquisition financing and dilution prevent AWS cash flow from reaching each share.

## What can "has power" still mean?

Susquehanna stands across the fence from the AWS campus, and 300 MW was already operating. Yet a generator trip showed that physical direct connection had not removed grid dependency. Rejection of the 480 MW amendment then showed that adequate generation and transmission capacity could not replace a defined service boundary.

The 1,920 MW solution did not bypass the grid more completely. It put generation, transmission, delivery, and load back through the grid. The PPA secures seller and price. Interconnection defines responsibility in normal and faulted states. Transmission reconfiguration creates the physical path. Site energization finally hands power to the campus.

When a data center says it has secured 1 GW, the next question is not only where the electricity comes from. Is that 1 GW a PPA, an approved connection model, completed external infrastructure, or utility service ready to ramp?

The nuclear plant can be next door while the missing piece is still a grid-recognized supply path that survives a fault.

## Sources

- [FERC, PJM Susquehanna Co-Location Proposal, ER24-2172](https://www.ferc.gov/media/er24-2172-pjms-susquehanna-co-location-proposal)
- [FERC, Chairman Phillips Dissent in ER24-2172](https://www.ferc.gov/news-events/news/chairman-phillips-dissent-pjms-susquehanna-co-location-proposal-er24-2172)
- [FERC, Commissioner Christie Concurrence in ER24-2172](https://www.ferc.gov/news-events/news/commissioner-christies-concurrence-pjms-susquehanna-co-location-proposal-er24-2172)
- [Talen Energy, Amazon PPA Business Update](https://www.sec.gov/Archives/edgar/data/1622536/000162828025030559/a20250611talenbusinessup.htm)
- [Talen Energy, Q1 2026 Form 10-Q](https://www.sec.gov/Archives/edgar/data/1622536/000162253626000036/tln-20260331.htm)
- [Talen Energy, 2025 Form 10-K](https://www.sec.gov/Archives/edgar/data/1622536/000162253626000017/tln-20251231.htm)
- [Talen Energy, September 2025 Investor Update](https://www.sec.gov/Archives/edgar/data/1622536/000162253625000010/investorupdate090925_vf.htm)
- [Yahoo Finance, TLN Historical Prices](https://finance.yahoo.com/quote/TLN/history/)
