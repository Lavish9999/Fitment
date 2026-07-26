# Phase 0–1 execution plan

This branch stabilizes the native shell, removes remaining hardcoded host assumptions from mobile state, introduces a catalog repository abstraction, and prepares the Expo app for Supabase-backed catalog/auth without weakening the deterministic compatibility engine.

## Phase 0

- Correct floating tab sizing and scroll clearance on all iPhones.
- Add shared loading, empty, offline, and error presentation primitives.
- Compact empty Armory and Profile sections.
- Preserve native system typography and restrained motion.

## Phase 1 foundation

- Introduce selected-host state and persistence.
- Replace direct mobile imports of `demoHost` and `demoAccessories` with catalog repository queries.
- Add TanStack Query and Supabase mobile client scaffolding.
- Keep guest/local fallback functional when Supabase variables are absent.
- Add guided firearm selection and catalog search contracts.
- Add a first evidence-backed pistol-optic seed vertical only after source verification.
- Preserve deterministic engine behavior and all engine tests.

No branch is merged until Expo Doctor, strict TypeScript, engine tests, and iOS export pass.
