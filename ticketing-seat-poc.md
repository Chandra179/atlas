# POC Brief — Atomic Contiguous Seat Holds

Scope: Deep Dive 1 of [ticketing-seat-selection.md](ticketing-seat-selection.md). One question, one evening, throwaway code.

## The claim

A `u2`-packed bitfield per section, scanned and claimed inside a single Redis Lua script, gives **all-or-nothing contiguous seat holds** under concurrency:

* No partial holds — a request for 4 seats never leaves 2 held.
* No double-hold — no seat is ever held by two sessions.
* No hold spans a row boundary.
* Hold **attempts** sustained at ~20k/sec, the large majority of them rejections once sections fill.
* Attempt p99 stays within budget as occupancy rises and free runs fragment.

Note the unit: **attempts per second, not successful holds per second.** A 600-seat section is exhausted after ~150 four-seat holds — at 20k/sec that is 30 milliseconds, so "sustained 20k successful holds/sec" is not a thing that can exist at any section size. Rejection throughput is the realistic figure anyway: at on-sale, 87% of traffic is doomed by arithmetic, and the rejection path is what most requests actually execute. Duration comes from running many real-size sections, never from inflating one.

## Row representation

Rows are padded to a fixed stride, with unused slots marked `blocked` (state 3). A seat's row is `index / stride`, so the script needs no external geometry, and padding terminates a run naturally at the aisle. Any run-detection that crosses a `blocked` slot is a bug, and is one of the refutation criteria below.

## What would refute it

Any of these, and the approach needs rethinking rather than tuning:

* A partial hold appears in the final state.
* Sum of held seats ≠ sum of seats across all successful hold responses.
* A hold spans a row boundary — detectable post-hoc: any hold whose seat indices do not share `index / stride`.
* p99 degrades non-linearly as occupancy rises. A linear scan over 600 seats is the design's core assumption; if fragmentation makes it superlinear at high occupancy, the data structure is wrong.
* **Missed opportunity:** a request rejected while a valid run existed. Checked post-hoc against the final state, not live — a live oracle would need to observe true state concurrently, which is its own concurrency problem. Post-hoc: if the run ends with ≥ k contiguous free seats in some row and rejections occurred after the last successful hold, the scan is buggy.

## The control

Build the naive version **first**: read the section state into Go, scan for a run in application code, write the seats back. Under load it should visibly produce partial holds and double-holds. Record those counts.

Without this number, "zero partial holds" from the Lua version proves nothing — Redis executes scripts atomically, so the correct result is guaranteed by the runtime, not earned by the design. The control is what makes the comparison a result.

**Both builds expose an identical API surface** and are driven by the same unmodified k6 script. If the endpoints differ, the comparison isn't clean.

## What to build

```
seat-poc/
  main.go          # POST /holds {section, count, contiguous} -> 201 or 409
  hold.lua         # scan-and-claim, the thing under test
  hold_naive.go    # the control: read-modify-write in Go
  seat_test.go     # N goroutines, -race, invariants asserted directly
  k6.js            # constant-arrival-rate
  docker-compose.yml
```

No fanout, no WebSockets, no payment, no Postgres, no expiry, no best-available section selection. One endpoint, state in Redis only. Sections are just keys — Run B uses one, Run A uses a hundred — and the client picks which. Everything else in the design doc is out of scope; this exists to answer whether the primitive works.

## What to measure

**Sections stay at 600 seats in every run.** Section size is a load-bearing constant, not a test parameter: the scan is linear, so a 60k-seat section would scan ~18KB per attempt instead of ~180 bytes — ~300 MB/sec of scanning on one Redis thread at 20k/sec. That measures a cost profile the real system never incurs, and it would come out *badly*, which is worse than useless: it would read as a refutation of a design that is fine. When a test won't run at production dimensions, that is information about the rig, not permission to move the system's constants.

**Run A — throughput.** 100 real-size sections in parallel, so the run has both duration and a realistic write distribution. Section choice is made **client-side in k6, uniformly at random** — deliberately *not* the design's weighted selection, which stays out of scope. Uniform choice needs no weight cache, no counter reads, and no retry policy, so Run A measures the claim script under concurrent load and nothing else. Report aggregate attempt throughput, success/rejection split, and per-section p99.

**Run B — the occupancy curve.** One 600-seat section, seeded to 0%, 50%, 90%, 99%, measured in a **short window with a reset between windows** so it stays near its target occupancy for the duration. Seeding once and running to exhaustion measures the transition, not the level.

| Metric | Why |
|---|---|
| Partial holds | Must be 0. Non-zero refutes the claim outright |
| Double-held seats | Must be 0 |
| Row-spanning holds | Must be 0 |
| Attempt p99, per occupancy level | **The headline result.** Latency vs fragmentation is the curve that matters |
| Attempts/sec, success vs rejection | Throughput ceiling of per-section serialization |
| Missed opportunities | Post-hoc; a correctness bug in the scan, not contention |

Latency is *expected* to rise with occupancy — free runs get scarce and the scan works harder. The question is the shape. Gentle is a pass; a cliff at 90% means the linear scan needs an index and the design changes.

Report p99 at each level, never one aggregate. An average across occupancy levels hides exactly the effect being tested.

## Method

* Assert invariants in `go test -race` first — N goroutines against real Redis, same properties as the load test, in milliseconds instead of minutes. miniredis does not execute Lua faithfully enough to trust.
* Baseline k6 against a stub handler returning 201 immediately, to establish the load generator's ceiling on this hardware. The SUT and k6 share a machine.
* `constant-arrival-rate`, reporting arrival RPS — not VU count.

## Done when

A README with: the naive build's partial-hold and double-hold counts, the same tests passing at zero on the Lua build, and the p99-vs-occupancy curve at four levels.

## Explicitly not proven here

* **Best-available section selection.** The weighted-random scheme in the design doc's Deep Dive 1 — cached weight table, 500ms refresh, 3-retry cap — is what keeps the write path partitioned. Run A spreads uniformly from the client instead, which exercises the script across sections but proves nothing about the selection scheme. That is a separate, second POC and arguably the higher-risk claim: single-section atomicity is guaranteed by Redis, whereas cross-section load spreading is a design decision that could be wrong.
* Fanout, expiry, payment, recovery.

If the curve is flat-ish, Deep Dive 1 holds and the next POC is section selection under a full tier. If it cliffs, this brief did its job.
