# FITMENT

**Know what fits before you buy.**

FITMENT is an iOS-first mobile application for evidence-driven firearm accessory compatibility, build planning, private ownership records, and shopping research. The production customer experience is React Native with Expo—not a consumer website.

> Demonstration records are marked `DEMO_UNVERIFIED`. They are not manufacturer claims and must not be used as purchase, installation, safety, or legal guidance.

## Current native vertical slice

- portrait iPhone application using Expo Router;
- native safe-area layout and mobile touch targets;
- exact demonstration firearm variant;
- native accessory selection sheet;
- direct and adapter-path evaluation;
- explicit unknown and conflict states;
- required-component explanation;
- evidence-limited confidence wording;
- known price and weight calculations;
- haptic feedback for selections and build actions;
- on-device build snapshots through AsyncStorage;
- Supabase schema for future authenticated builds, RLS-protected Armory records, encrypted sensitive fields, and sanitized public sharing.

## Workspace

```text
apps/
  mobile/          # iOS-first customer application
  web/             # legacy Phase 1 test harness; not the product surface
packages/
  domain/
  compatibility-engine/
  catalog/
supabase/
  migrations/
  seed.sql
docs/
tests/
```

The web harness is excluded from the product CI path and is scheduled for removal after the native vertical slice is verified on-device.

## Prerequisites

- Node.js 22.13+
- pnpm 10+
- Expo Go on an iPhone for the fastest device test
- Xcode on macOS for the iOS Simulator or native development build
- Supabase CLI only when testing database migrations

## Install

```bash
corepack enable
pnpm install
```

## Run on an iPhone with Expo Go

```bash
pnpm mobile
```

Scan the QR code with the iPhone Camera app and open it in Expo Go. The phone and computer should be on the same network. If LAN discovery is blocked, run:

```bash
pnpm --filter @fitment/mobile start --tunnel
```

## Run in the iOS Simulator

```bash
pnpm ios
```

This requires macOS with Xcode and an iOS Simulator installed.

## Validate the native app

```bash
pnpm test:engine
pnpm --filter @fitment/mobile typecheck
pnpm export:ios
```

The iOS export validates that Metro can bundle the mobile application and the shared workspace packages.

## Supabase local setup

```bash
supabase start
supabase db reset
```

The reset applies migrations and loads `supabase/seed.sql`.

## Security boundaries

- Missing data never becomes a verified compatibility result.
- Persisted evaluations preserve engine version and catalog revision.
- Public builds are allowlisted projections, not redacted Armory records.
- Cloud sensitive fields store ciphertext only.
- Device-only sensitive values never enter Supabase.
- Admin authority is server-side and audit logged.

## Documentation

- `docs/product/audit-strengthening.md`
- `docs/architecture/system-overview.md`
- `docs/compatibility/engine.md`
- `docs/security/privacy-model.md`
- `docs/data-model/catalog.md`
- `docs/product/roadmap.md`

## Current limitations

- Demo catalog only; it is intentionally too weak to produce verified claims.
- Supabase authentication and cloud build persistence are not wired yet.
- The mobile vertical slice currently contains one Builder screen rather than the complete tab system.
- Retailer offers, live prices, community reports, admin tooling, and 3D are not implemented.
