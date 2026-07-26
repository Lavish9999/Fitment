-- Seed records are demonstration-only. They must never be rendered as manufacturer-verified facts.
insert into public.manufacturers (id, name, slug, publish_status) values
  ('10000000-0000-0000-0000-000000000001', 'Glock', 'glock', 'PUBLISHED'),
  ('10000000-0000-0000-0000-000000000002', 'Demo Optics Co.', 'demo-optics', 'PUBLISHED');

insert into public.product_families (id, manufacturer_id, name, slug, category, publish_status) values
  ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'G19', 'g19', 'FIREARM', 'PUBLISHED'),
  ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', 'Demo RMR Optic', 'demo-rmr-optic', 'RED_DOT_OPTIC', 'PUBLISHED');

insert into public.products (id, manufacturer_id, family_id, category, marketing_name, publish_status) values
  ('30000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'FIREARM', 'G19 demonstration record', 'PUBLISHED'),
  ('30000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002', 'RED_DOT_OPTIC', 'RMR-pattern optic demonstration record', 'PUBLISHED');

insert into public.product_variants (id, product_id, exact_model, manufacturer_sku, generation, caliber, normalized_weight_grams, normalized_price_cents, verification_status, publish_status) values
  ('40000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 'G19 Gen5 MOS — demo', 'DEMO-G19-MOS', '5', '9x19', 670, 62000, 'DEMO_UNVERIFIED', 'PUBLISHED'),
  ('40000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000002', 'RMR Footprint Optic — demo', 'DEMO-RMR-01', null, null, 35, 29900, 'DEMO_UNVERIFIED', 'PUBLISHED');

insert into public.firearm_variants (product_variant_id, platform, factory_rail_code, factory_optic_cut_code) values
  ('40000000-0000-0000-0000-000000000001', 'GLOCK_COMPACT_PISTOL', 'GLOCK_UNIVERSAL_RAIL', 'MOS_PLATE_SYSTEM');

insert into public.interfaces (id, code, name, family, description) values
  ('50000000-0000-0000-0000-000000000001', 'MOS_PLATE_SYSTEM', 'MOS plate system', 'PISTOL_OPTIC_CUT', 'Demonstration interface record.'),
  ('50000000-0000-0000-0000-000000000002', 'RM_RMR_FOOTPRINT', 'RMR footprint', 'PISTOL_OPTIC_FOOTPRINT', 'Demonstration interface record.'),
  ('50000000-0000-0000-0000-000000000003', 'GLOCK_UNIVERSAL_RAIL', 'Glock universal rail', 'PISTOL_ACCESSORY_RAIL', 'Demonstration interface record.');
