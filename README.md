# FITMENT

**Know what fits before you buy.**

FITMENT is an iOS-first mobile application for evidence-driven firearm accessory compatibility, build planning, private ownership records, and shopping research. The customer product is built with React Native and Expo—not as a consumer website.

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

## Project folder

The Git repository root is the folder named `Fitment`. The iPhone application itself is inside:

```text
Fitment/apps/mobile
```

On Windows, the full path depends on where the repository was cloned. Examples:

```text
C:\Users\YOUR-NAME\Fitment\apps\mobile
C:\Users\YOUR-NAME\Desktop\Fitment\apps\mobile
C:\Users\YOUR-NAME\Downloads\Fitment\apps\mobile
```

You normally run commands from the root `Fitment` folder, not from `apps/mobile`.

## Workspace

```text
apps/
  mobile/          # iOS-first customer application
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

## Prerequisites

- Node.js 22.13+
- pnpm 10+
- Expo Go from the iOS App Store
- iPhone and computer connected to the same Wi-Fi network
- Supabase CLI only when testing database migrations

## Install

Open PowerShell in the root `Fitment` folder and run:

```powershell
corepack enable
pnpm install
```

## Run on an iPhone with Expo Go

From the root `Fitment` folder:

```powershell
pnpm mobile
```

Then:

1. Open Expo Go on the iPhone.
2. Scan the QR code shown in PowerShell.
3. Allow the project to open in Expo Go.

If the phone cannot find the computer over the local network, stop the server with `Ctrl+C` and run:

```powershell
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
pnpm --filter @fitment/mobile run doctor
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
