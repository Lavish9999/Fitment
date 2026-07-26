# System overview

## Boundaries

- `apps/web`: public research, builder, account flows, and authenticated build management.
- `apps/mobile`: planned Expo client after the web vertical slice stabilizes.
- `apps/admin`: planned dedicated catalog and verification console.
- `packages/domain`: stable domain contracts shared across clients and services.
- `packages/compatibility-engine`: deterministic, side-effect-free evaluation logic.
- `packages/catalog`: normalized catalog access and explicitly isolated demo records.
- Supabase: authentication, PostgreSQL, RLS, storage, audit events, and server-side persistence.

## Trust boundaries

Clients may request an evaluation and display its explanation, but authoritative persisted evaluations are recalculated server-side. Admin permissions are never inferred from client state. Sensitive Armory fields are encrypted before persistence and are never accepted as plaintext logging metadata.

## Evaluation data flow

1. Resolve the exact host and accessory revisions.
2. Load normalized interfaces, verified adapter edges, exclusions, ratings, dimensions, dependencies, and evidence.
3. Run the versioned deterministic engine.
4. Return status, confidence, explanation, unknowns, required components, sources, and engine version.
5. Persist the complete result with catalog revision when attached to a build or verification workflow.

## Public/private separation

Armory records and public builds are separate tables and payloads. Publication calls a server-side function that constructs an allowlisted public projection containing only build title, selected host, intended use, revision, and component identifiers. It does not query Armory sensitive fields.
