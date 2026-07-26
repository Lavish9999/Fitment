begin;

alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.manufacturers enable row level security;
alter table public.product_families enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.firearm_variants enable row level security;
alter table public.interfaces enable row level security;
alter table public.evidence_sources enable row level security;
alter table public.field_sources enable row level security;
alter table public.product_interfaces enable row level security;
alter table public.adapter_connections enable row level security;
alter table public.compatibility_exclusions enable row level security;
alter table public.audit_logs enable row level security;
alter table public.builds enable row level security;
alter table public.build_items enable row level security;
alter table public.compatibility_evaluations enable row level security;
alter table public.build_snapshots enable row level security;
alter table public.public_build_snapshots enable row level security;
alter table public.armory_items enable row level security;
alter table public.armory_sensitive_fields enable row level security;

create policy "profiles_select_own" on public.profiles for select using (id = auth.uid());
create policy "profiles_insert_own" on public.profiles for insert with check (id = auth.uid());
create policy "profiles_update_own" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());
create policy "user_roles_read_own" on public.user_roles for select using (user_id = auth.uid());

create policy "manufacturers_public_read" on public.manufacturers for select using (publish_status = 'PUBLISHED');
create policy "families_public_read" on public.product_families for select using (publish_status = 'PUBLISHED');
create policy "products_public_read" on public.products for select using (publish_status = 'PUBLISHED');
create policy "variants_public_read" on public.product_variants for select using (publish_status = 'PUBLISHED');
create policy "firearm_variants_public_read" on public.firearm_variants for select using (
  exists (select 1 from public.product_variants pv where pv.id = product_variant_id and pv.publish_status = 'PUBLISHED')
);
create policy "interfaces_public_read" on public.interfaces for select using (true);
create policy "evidence_public_read" on public.evidence_sources for select using (is_public);
create policy "product_interfaces_public_read" on public.product_interfaces for select using (
  exists (select 1 from public.product_variants pv where pv.id = product_variant_id and pv.publish_status = 'PUBLISHED')
);
create policy "adapters_public_read" on public.adapter_connections for select using (
  verified and exists (select 1 from public.product_variants pv where pv.id = adapter_product_variant_id and pv.publish_status = 'PUBLISHED')
);
create policy "exclusions_public_read" on public.compatibility_exclusions for select using (verification_status = 'VERIFIED');
create policy "builds_owner_all" on public.builds for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "build_items_owner_all" on public.build_items for all using (
  exists (select 1 from public.builds b where b.id = build_id and b.owner_id = auth.uid())
) with check (
  exists (select 1 from public.builds b where b.id = build_id and b.owner_id = auth.uid())
);
create policy "evaluations_owner_select" on public.compatibility_evaluations for select using (
  build_id is not null and exists (select 1 from public.builds b where b.id = build_id and b.owner_id = auth.uid())
);
create policy "snapshots_owner_select" on public.build_snapshots for select using (
  exists (select 1 from public.builds b where b.id = build_id and b.owner_id = auth.uid())
);
create policy "public_builds_read" on public.public_build_snapshots for select using (withdrawn_at is null);
create policy "public_builds_owner_delete" on public.public_build_snapshots for delete using (owner_id = auth.uid());
create policy "armory_owner_all" on public.armory_items for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "armory_sensitive_owner_all" on public.armory_sensitive_fields for all using (owner_id = auth.uid()) with check (
  owner_id = auth.uid() and exists (
    select 1 from public.armory_items a where a.id = armory_item_id and a.owner_id = auth.uid()
  )
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  insert into public.user_roles (user_id, role)
  values (new.id, 'USER')
  on conflict (user_id, role) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.publish_sanitized_build(p_build_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_build public.builds;
  v_public_id uuid;
begin
  select * into v_build from public.builds where id = p_build_id and owner_id = auth.uid();
  if not found then raise exception 'Build not found or not owned by caller'; end if;

  insert into public.public_build_snapshots (source_build_id, owner_id, title, sanitized_snapshot)
  values (
    v_build.id,
    v_build.owner_id,
    v_build.name,
    jsonb_build_object(
      'buildId', v_build.id,
      'title', v_build.name,
      'hostVariantId', v_build.host_variant_id,
      'intendedUse', v_build.intended_use,
      'revision', v_build.current_revision,
      'components', coalesce((
        select jsonb_agg(jsonb_build_object('productVariantId', bi.product_variant_id, 'role', bi.role))
        from public.build_items bi where bi.build_id = v_build.id
      ), '[]'::jsonb)
    )
  )
  on conflict (source_build_id) do update
    set title = excluded.title,
        sanitized_snapshot = excluded.sanitized_snapshot,
        published_at = now(),
        withdrawn_at = null
  returning id into v_public_id;

  return v_public_id;
end;
$$;

revoke all on function public.publish_sanitized_build(uuid) from public;
grant execute on function public.publish_sanitized_build(uuid) to authenticated;

commit;
