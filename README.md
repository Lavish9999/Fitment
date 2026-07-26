# FITMENT

**Know what fits before you buy.**

FITMENT is an evidence-driven firearm accessory compatibility, configuration, private ownership-record, and shopping-research platform. This repository begins with the deterministic compatibility foundation and a working web demonstration of the core loop.

> Demonstration records are marked `DEMO_UNVERIFIED`. They are not manufacturer claims and must not be used as purchase, installation, safety, or legal guidance.

## Current vertical slice

- exact demonstration firearm variant;
- accessory selection;
- direct and adapter-path evaluation;
- explicit unknown and conflict states;
- required-component explanation;
- known price and weight calculations;
- local immutable-style demo snapshots carrying the engine version;
- Supabase schema for authenticated builds, RLS-protected Armory records, encrypted sensitive fields, and sanitized public publication.

## Workspace

```text
apps/
  web/
packages/
  domain/
  compatibility-engine/
  catalog/
supabase/
  migrations/
  seed.sql
docs/
  architecture/
  compatibility/
  data-model/
  product/
  security/
tests/
```

## Prerequisites

- Node.js 22+
- pnpm 10+
- Supabase CLI for local database work

## Install

```bash
corepack enable
pnpm install
cp .env.example .env.local
```

## Run the web app

```bash
pnpm --filter @fitment/web dev
```

Then open `http://localhost:3000` and use the Builder route.

## Test the deterministic engine

The engine test does not require a running database:

```bash
pnpm test:engine
```

## Supabase local setup

```bash
supabase start
supabase db reset
```

The reset applies migrations and loads `supabase/seed.sql`.

## Validation commands

```bash
pnpm test:engine
pnpm typecheck
pnpm --filter @fitment/web build
```

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
- Supabase authentication UI and hosted project configuration are not wired yet.
- Mobile and dedicated admin apps are the next application shells.
- Retailer offers, live prices, community reports, and 3D are not implemented.
