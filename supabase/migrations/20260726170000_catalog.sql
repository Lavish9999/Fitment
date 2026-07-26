begin;

create extension if not exists pgcrypto;

create type public.catalog_publish_status as enum ('DRAFT', 'IN_REVIEW', 'PUBLISHED', 'DEPRECATED');
create type public.interface_direction as enum ('PROVIDES', 'REQUIRES', 'ACCEPTS', 'OUTPUTS');
create type public.verification_status as enum ('DEMO_UNVERIFIED', 'UNVERIFIED', 'PARTIAL', 'VERIFIED');
create type public.compatibility_status as enum (
  'VERIFIED_DIRECT', 'VERIFIED_WITH_ADAPTER', 'LIKELY_COMPATIBLE', 'NEEDS_MEASUREMENT',
  'CONFLICT_DETECTED', 'NOT_COMPATIBLE', 'UNKNOWN'
);
create type public.armory_sensitive_storage as enum ('CLOUD_ENCRYPTED');
create type public.build_visibility as enum ('PRIVATE', 'UNLISTED', 'PUBLIC');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_roles (
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null check (role in ('USER','CONTRIBUTOR','MODERATOR','CATALOG_EDITOR','VERIFIER','MANUFACTURER_PARTNER','ADMIN','SUPER_ADMIN')),
  granted_by uuid references public.profiles(id) on delete set null,
  granted_at timestamptz not null default now(),
  primary key (user_id, role)
);

create table public.manufacturers (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  publish_status public.catalog_publish_status not null default 'DRAFT',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.product_families (
  id uuid primary key default gen_random_uuid(),
  manufacturer_id uuid not null references public.manufacturers(id),
  name text not null,
  slug text not null,
  category text not null,
  publish_status public.catalog_publish_status not null default 'DRAFT',
  unique (manufacturer_id, slug)
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  manufacturer_id uuid not null references public.manufacturers(id),
  family_id uuid references public.product_families(id),
  category text not null,
  marketing_name text not null,
  publish_status public.catalog_publish_status not null default 'DRAFT',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id),
  exact_model text not null,
  manufacturer_sku text,
  upc text,
  generation text,
  caliber text,
  barrel_length_mm numeric,
  finish text,
  production_revision text,
  normalized_weight_grams numeric,
  normalized_length_mm numeric,
  normalized_price_cents integer,
  data_completeness text not null default 'PARTIAL',
  verification_status public.verification_status not null default 'UNVERIFIED',
  publish_status public.catalog_publish_status not null default 'DRAFT',
  revision integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique nulls not distinct (product_id, manufacturer_sku, production_revision)
);

create table public.firearm_variants (
  product_variant_id uuid primary key references public.product_variants(id) on delete cascade,
  platform text not null,
  frame_or_receiver_size text,
  factory_rail_code text,
  factory_optic_cut_code text,
  thread_pitch_code text,
  stock_or_brace_configuration text,
  factory_configuration jsonb not null default '{}'::jsonb,
  check (jsonb_typeof(factory_configuration) = 'object')
);

create table public.interfaces (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  family text not null,
  parent_interface_id uuid references public.interfaces(id),
  version text,
  description text,
  measurement_schema jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (jsonb_typeof(measurement_schema) = 'object')
);

create table public.evidence_sources (
  id uuid primary key default gen_random_uuid(),
  source_type text not null,
  title text not null,
  url text,
  publisher text,
  effective_date date,
  retrieved_at timestamptz,
  reviewed_at timestamptz,
  exact_combination_verified boolean not null default false,
  is_public boolean not null default false,
  source_payload jsonb,
  created_at timestamptz not null default now()
);

create table public.field_sources (
  id uuid primary key default gen_random_uuid(),
  entity_table text not null,
  entity_id uuid not null,
  field_name text not null,
  evidence_source_id uuid not null references public.evidence_sources(id),
  verification_status public.verification_status not null,
  normalized_value jsonb,
  reviewer_id uuid references public.profiles(id),
  reviewed_at timestamptz,
  unique (entity_table, entity_id, field_name, evidence_source_id)
);

create table public.product_interfaces (
  id uuid primary key default gen_random_uuid(),
  product_variant_id uuid not null references public.product_variants(id) on delete cascade,
  interface_id uuid not null references public.interfaces(id),
  direction public.interface_direction not null,
  location text not null,
  quantity integer not null default 1 check (quantity > 0),
  position_data jsonb not null default '{}'::jsonb,
  evidence_source_id uuid references public.evidence_sources(id),
  verification_status public.verification_status not null default 'UNVERIFIED',
  unique (product_variant_id, interface_id, direction, location)
);

create table public.adapter_connections (
  id uuid primary key default gen_random_uuid(),
  adapter_product_variant_id uuid not null references public.product_variants(id),
  input_interface_id uuid not null references public.interfaces(id),
  output_interface_id uuid not null references public.interfaces(id),
  verified boolean not null default false,
  confidence_score integer not null check (confidence_score between 0 and 100),
  restrictions jsonb not null default '[]'::jsonb,
  evidence_source_id uuid references public.evidence_sources(id),
  unique (adapter_product_variant_id, input_interface_id, output_interface_id),
  check (input_interface_id <> output_interface_id),
  check (jsonb_typeof(restrictions) = 'array')
);

create table public.compatibility_exclusions (
  id uuid primary key default gen_random_uuid(),
  host_variant_id uuid not null references public.product_variants(id),
  accessory_variant_id uuid not null references public.product_variants(id),
  reason text not null,
  evidence_source_id uuid not null references public.evidence_sources(id),
  verification_status public.verification_status not null,
  unique (host_variant_id, accessory_variant_id, reason)
);

commit;
