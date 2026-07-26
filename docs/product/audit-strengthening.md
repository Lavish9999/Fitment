# FITMENT specification audit and strengthening

## What was already strong

The product brief correctly prioritizes exact variants, deterministic rules, evidence provenance, privacy, complete installed cost, public/private separation, and explicit unknown states. Those principles remain the non-negotiable core.

## Strengthened decisions

1. **Closed-world versus open-world reasoning**
   A missing adapter path is not automatically an incompatibility. The engine now requires an explicit `VERIFIED_FOR_SCOPE` graph-completeness signal plus complete host and accessory records before absence can become `NOT_COMPATIBLE`. Otherwise the result is `UNKNOWN`.

2. **Claim-level and field-level provenance**
   Product records are not assigned one blanket source. Material fields and compatibility claims can each carry their own evidence, review status, reviewer, and normalized value.

3. **Immutable evaluation inputs**
   Every stored evaluation must preserve the engine version and catalog revision. Build snapshots preserve the exact component revision and result payload so historical builds do not silently mutate.

4. **Adapter graph governance**
   Adapter search is bounded, cycle-safe, and ordered by fewest connection points, then known price, then known weight. Multi-adapter paths lose confidence and must expose every required component.

5. **Three independent decision layers**
   Mechanical interface matching, manufacturer rating checks, and dimensional/clearance checks are evaluated separately. A mounting-standard match cannot override a failed rating or critical clearance check.

6. **Confidence is capped by evidence quality**
   Demo or weak evidence cannot produce a verified result merely because interface labels match. Confidence is capped by the weakest material evidence in the decision path.

7. **Public build projection, not redaction**
   Public builds are generated from an allowlisted sanitized projection. The system never copies an Armory record and attempts to remove sensitive fields afterward.

8. **Encrypted Armory boundary**
   Cloud-stored sensitive fields contain only ciphertext, nonce, and key version. Device-only values never enter the cloud table. Encryption keys must live outside the database record and outside logs.

9. **Regulatory review flags remain separate**
   The engine returns mechanical compatibility only. Potentially regulated configurations use a separate informational review system and can never be labeled “legal.”

10. **No affiliate-driven hidden ranking**
    Retailer ranking inputs must be explainable and commission must not silently affect ordering.

11. **High-risk catalog claims require controlled publishing**
    Catalog editors may draft claims, but verified compatibility and critical exclusions should require a verifier role and an audit event. Future implementation should support four-eyes approval for high-impact changes.

12. **Demo-data isolation**
    Demonstration records are visibly labeled `DEMO_UNVERIFIED`, excluded from verified counts, and unsuitable for real purchase or installation decisions.

## Product scope correction

The initial vertical slice intentionally proves one difficult loop well:

exact host variant → accessory selection → deterministic evaluation → required adapter explanation → transparent totals → immutable save model.

Broad catalog import, community, mobile parity, retailer feeds, and 3D remain downstream until this loop is trustworthy.
