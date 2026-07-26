# Compatibility engine

## Statuses

- `VERIFIED_DIRECT`: exact required interface is provided and evidence/confidence meets the verified threshold.
- `VERIFIED_WITH_ADAPTER`: a verified bounded adapter path exists and meets the verified threshold.
- `LIKELY_COMPATIBLE`: structured match exists but evidence or noncritical checks prevent verification.
- `NEEDS_MEASUREMENT`: a critical dimensional or rating value is unresolved.
- `CONFLICT_DETECTED`: a verified critical restriction or clearance check fails.
- `NOT_COMPATIBLE`: an explicit exclusion exists, or a fully reviewed closed scope has no direct or adapter path.
- `UNKNOWN`: evidence, variant details, or graph coverage is insufficient.

## Fail-closed behavior

Missing data never becomes a confident fitment claim. Demo evidence caps confidence below verified thresholds. A direct label match is only one part of the decision.

## Adapter graph

The graph is directed from adapter input interface to output interface. Search is breadth-first, cycle-safe, and bounded by maximum hop count. Candidate paths rank by:

1. fewest adapters;
2. lowest fully known price;
3. lowest fully known weight.

Every adapter in the selected path is returned as a mandatory required component.

## Checks

Interface checks, rating checks, and dimensional checks remain distinct. A critical `FAIL` produces `CONFLICT_DETECTED`. A critical `UNKNOWN` produces `NEEDS_MEASUREMENT` even when the interface path is known.

## Evidence priority

Manufacturer documentation, manufacturer support, and physical staff verification cap confidence highest. Verified user evidence can support but does not automatically equal manufacturer verification. Retailer and unverified community evidence receive lower caps.
