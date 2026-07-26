begin;

create table public.builds (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  host_variant_id uuid not null references public.product_variants(id),
  intended_use text,
  visibility public.build_visibility not null default 'PRIVATE',
  current_revision integer not null default 1,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.build_items (
  id uuid primary key default gen_random_uuid(),
  build_id uuid not null references public.builds(id) on delete cascade,
  product_variant_id uuid not null references public.product_variants(id),
  role text not null,
  position_data jsonb not null default '{}'::jsonb,
  added_at timestamptz not null default now(),
  unique (build_id, product_variant_id, role)
);

create table public.compatibility_evaluations (
  id uuid primary key default gen_random_uuid(),
  build_id uuid references public.builds(id) on delete cascade,
  host_variant_id uuid not null references public.product_variants(id),
  accessory_variant_id uuid not null references public.product_variants(id),
  status public.compatibility_status not null,
  confidence_score integer not null check (confidence_score between 0 and 100),
  engine_version text not null,
  catalog_revision bigint not null,
  result jsonb not null,
  evaluated_at timestamptz not null default now(),
  check (jsonb_typeof(result) = 'object')
);

create table public.build_snapshots (
  id uuid primary key default gen_random_uuid(),
  build_id uuid not null references public.builds(id) on delete cascade,
  revision integer not null,
  snapshot jsonb not null,
  engine_version text not null,
  catalog_revision bigint not null,
  created_at timestamptz not null default now(),
  unique (build_id, revision),
  check (jsonb_typeof(snapshot) = 'object')
);

create table public.public_build_snapshots (
  id uuid primary key default gen_random_uuid(),
  source_build_id uuid not null references public.builds(id) on delete cascade,
  owner_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  sanitized_snapshot jsonb not null,
  published_at timestamptz not null default now(),
  withdrawn_at timestamptz,
  check (jsonb_typeof(sanitized_snapshot) = 'object'),
  unique (source_build_id)
);

create table public.armory_items (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  firearm_variant_id uuid not null references public.product_variants(id),
  nickname text,
  acquisition_date date,
  purchase_price_cents integer,
  condition text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.armory_sensitive_fields (
  id uuid primary key default gen_random_uuid(),
  armory_item_id uuid not null references public.armory_items(id) on delete cascade,
  owner_id uuid not null references public.profiles(id) on delete cascade,
  field_name text not null,
  storage_mode public.armory_sensitive_storage not null default 'CLOUD_ENCRYPTED',
  ciphertext bytea not null,
  nonce bytea not null,
  key_version text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (armory_item_id, field_name)
);

create table public.audit_logs (
  id bigint generated always as identity primary key,
  actor_id uuid references public.profiles(id),
  action text not null,
  entity_table text not null,
  entity_id uuid,
  safe_metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  check (jsonb_typeof(safe_metadata) = 'object')
);

commit;
