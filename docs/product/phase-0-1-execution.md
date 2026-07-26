# Phase 0–1 execution plan

This branch stabilizes the native shell, removes hardcoded host assumptions from mobile state, introduces a catalog repository abstraction, and prepares the Expo app for Supabase-backed catalog/auth without weakening the deterministic compatibility engine.

## Completed in this slice

### Phase 0

- Increased floating-tab internal height and centralized safe-area geometry.
- Increased screen clearance beneath the floating navigation.
- Split confidence score from evidence-quality copy.
- Compacted empty Armory sections.
- Stopped presenting a selected build firearm as an ownership record.
- Preserved native system typography, restrained motion, and haptics.

### Phase 1 foundation

- Added selected exact-host state and local persistence.
- Bound current and saved builds to a host variant.
- Added host-aware saved evaluation snapshots, engine version, and catalog revision.
- Removed direct mobile-screen dependencies on `demoHost` and `demoAccessories`.
- Added TanStack Query and an optional Expo/Supabase client using React Native session persistence.
- Added a catalog repository boundary with a safe bundled fallback.
- Added guided firearm search and manufacturer filters.
- Added component search from the active catalog.
- Added manufacturer-sourced GLOCK G19 MOS and SIG P365-XMACRO records.
- Added an evidence-backed P365-XMACRO → ROMEOZero Elite verified-direct path.
- Added a GLOCK MOS Plate 02 adapter path while keeping demo optic evidence limited.
- Added exact-host engine tests proving compatibility changes when the selected host changes.

## Validation

- Compatibility engine and Phase 1 catalog tests: passing.
- Expo Doctor: passing.
- Strict mobile TypeScript: passing.
- iOS Expo export: passing.

## Still required before Phase 1 is complete

- Apply and validate the Supabase migrations against a linked project.
- Add database integration and RLS tests.
- Activate the remote catalog repository only after row mapping is proven.
- Expand to the minimum seed target: 15 firearm variants, 40 accessories, 15 interfaces, 10 adapters, 80 relationships, and 15 exclusions.
- Add real product imagery and catalog-admin CRUD/verification workflows.
- Add authenticated guest-to-account upgrade and cloud build persistence.

No branch is merged until the user reviews the Expo Go behavior and explicitly approves the merge.
